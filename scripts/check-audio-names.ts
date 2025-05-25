import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { isNotNull } from "drizzle-orm";
import * as schema from "../db/schema";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const db = drizzle(pool, { schema });

async function checkAudioNames() {
  try {
    console.log("🔍 Checking current audioSrc naming patterns...\n");

    // Get challenge options that already have audioSrc
    const optionsWithAudio = await db
      .select({
        id: schema.challengesOptions.id,
        text: schema.challengesOptions.text,
        audioSrc: schema.challengesOptions.audioSrc,
      })
      .from(schema.challengesOptions)
      .where(isNotNull(schema.challengesOptions.audioSrc))
      .limit(10);

    if (optionsWithAudio.length === 0) {
      console.log("❌ No challenge options with audioSrc found");
    } else {
      console.log(`📊 Found ${optionsWithAudio.length} options with audioSrc (showing first 10):\n`);
      
      optionsWithAudio.forEach((option, index) => {
        console.log(`${index + 1}. ID: ${option.id}`);
        console.log(`   Text: "${option.text}"`);
        console.log(`   AudioSrc: ${option.audioSrc}`);
        console.log("");
      });

      // Analyze the pattern
      console.log("🔍 Pattern Analysis:");
      const firstAudio = optionsWithAudio[0].audioSrc;
      if (firstAudio) {
        if (firstAudio.includes('cloudinary')) {
          console.log("✅ Using Cloudinary URLs");
        }
        if (firstAudio.includes('.mp3')) {
          console.log("✅ Using .mp3 format");
        }
        
        // Extract filename pattern
        const filename = firstAudio.split('/').pop()?.replace('.mp3', '');
        console.log(`📝 Filename pattern example: ${filename}`);
      }
    }

    // Also check total count
    const totalOptions = await db
      .select({ count: schema.challengesOptions.id })
      .from(schema.challengesOptions);
    
    console.log(`\n📈 Total challenge options in database: ${totalOptions.length}`);

  } catch (error) {
    console.error("❌ Error checking audio names:", error);
  } finally {
    await pool.end();
  }
}

checkAudioNames(); 