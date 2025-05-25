import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { eq, isNotNull, or } from "drizzle-orm";
import * as schema from "../db/schema";
import cloudinary from "../lib/cloudinary";
import fs from 'fs';
import path from 'path';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const db = drizzle(pool, { schema });

const uploadFileToCloudinary = async (filePath: string, publicId: string, resourceType: 'image' | 'video' = 'image') => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      public_id: publicId,
      resource_type: resourceType,
      folder: 'tastify',
      overwrite: true,
    });
    
    console.log(`✅ Uploaded ${filePath} -> ${result.secure_url}`);
    return result.public_id;
  } catch (error) {
    console.error(`❌ Failed to upload ${filePath}:`, error);
    return null;
  }
};

const main = async () => {
  try {
    console.log("Starting migration to Cloudinary...");

    // Get all challenge options with media files
    const optionsWithMedia = await db
      .select()
      .from(schema.challengesOptions)
      .where(
        or(
          isNotNull(schema.challengesOptions.imageSrc),
          isNotNull(schema.challengesOptions.audioSrc)
        )
      );

    console.log(`Found ${optionsWithMedia.length} options with media files`);

    const publicDir = path.join(process.cwd(), 'public');
    let uploadedCount = 0;
    let skippedCount = 0;

    for (const option of optionsWithMedia) {
      let updatedImageSrc = option.imageSrc;
      let updatedAudioSrc = option.audioSrc;

      // Handle image upload
      if (option.imageSrc && option.imageSrc.startsWith('/')) {
        const imagePath = path.join(publicDir, option.imageSrc);
        
        if (fs.existsSync(imagePath)) {
          const publicId = option.imageSrc.replace(/^\//, '').replace(/\.[^/.]+$/, '');
          const uploadedPublicId = await uploadFileToCloudinary(imagePath, publicId, 'image');
          
          if (uploadedPublicId) {
            updatedImageSrc = uploadedPublicId;
            uploadedCount++;
          }
        } else {
          console.warn(`⚠️  Image file not found: ${imagePath}`);
          skippedCount++;
        }
      }

      // Handle audio upload
      if (option.audioSrc && option.audioSrc.startsWith('/')) {
        const audioPath = path.join(publicDir, option.audioSrc);
        const downloadsAudioPath = path.join(process.cwd(), 'downloads/audio', path.basename(option.audioSrc));
        
        let actualAudioPath = audioPath;
        if (!fs.existsSync(audioPath) && fs.existsSync(downloadsAudioPath)) {
          actualAudioPath = downloadsAudioPath;
        }
        
        if (fs.existsSync(actualAudioPath)) {
          const publicId = option.audioSrc.replace(/^\//, '').replace(/\.[^/.]+$/, '');
          const uploadedPublicId = await uploadFileToCloudinary(actualAudioPath, publicId, 'video');
          
          if (uploadedPublicId) {
            updatedAudioSrc = uploadedPublicId;
            uploadedCount++;
          }
        } else {
          console.warn(`⚠️  Audio file not found: ${audioPath} or ${downloadsAudioPath}`);
          skippedCount++;
        }
      }

      // Update database if any files were uploaded
      if (updatedImageSrc !== option.imageSrc || updatedAudioSrc !== option.audioSrc) {
        await db
          .update(schema.challengesOptions)
          .set({
            imageSrc: updatedImageSrc,
            audioSrc: updatedAudioSrc,
          })
          .where(eq(schema.challengesOptions.id, option.id));

        console.log(`📝 Updated option ${option.id}: ${option.text}`);
      }

      // Add a small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log(`\n🎉 Migration completed!`);
    console.log(`📊 Statistics:`);
    console.log(`   - Files uploaded: ${uploadedCount}`);
    console.log(`   - Files skipped: ${skippedCount}`);
    console.log(`   - Options processed: ${optionsWithMedia.length}`);

  } catch (error) {
    console.error("❌ Error during migration:", error);
    throw new Error("Failed to migrate files to Cloudinary");
  } finally {
    await pool.end();
  }
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
}); 