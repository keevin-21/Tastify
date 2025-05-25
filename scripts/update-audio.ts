import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { eq, and, isNotNull, isNull } from "drizzle-orm";
import * as schema from "../db/schema";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const db = drizzle(pool, { schema });

const main = async () => {
  try {
    console.log("Updating challenge options with audio sources...");

    // Find all challenge options that have imageSrc but no audioSrc
    const optionsToUpdate = await db
      .select()
      .from(schema.challengesOptions)
      .where(
        and(
          isNotNull(schema.challengesOptions.imageSrc),
          isNull(schema.challengesOptions.audioSrc)
        )
      );

    console.log(`Found ${optionsToUpdate.length} options to update`);

    // Update each option
    for (const option of optionsToUpdate) {
      if (option.imageSrc) {
        // Extract filename without extension and add .mp3
        const filename = option.imageSrc.replace(/\.[^/.]+$/, ""); // Remove extension
        const audioSrc = `${filename}.mp3`;

        await db
          .update(schema.challengesOptions)
          .set({ audioSrc })
          .where(eq(schema.challengesOptions.id, option.id));

        console.log(`Updated option ${option.id}: ${option.text} -> ${audioSrc}`);
      }
    }

    console.log("Audio sources update completed ✅");
  } catch (error) {
    console.error("❌ Error during audio update:", error);
    throw new Error("Failed to update audio sources");
  } finally {
    await pool.end();
  }
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
}); 