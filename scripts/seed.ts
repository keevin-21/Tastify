import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "../db/schema";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const db = drizzle(pool, { schema });

const main = async () => {
  try {
    console.log("Seeding database...");

    await db.delete(schema.challengeProgress);
    await db.delete(schema.challengesOptions);
    await db.delete(schema.challenges);
    await db.delete(schema.lessons);
    await db.delete(schema.units);
    await db.delete(schema.userProgress);
    await db.delete(schema.courses);

    await db.insert(schema.courses).values([
      { id: 1, title: "Japanese", imageSrc: "/jp.svg" },
      { id: 2, title: "Mexican", imageSrc: "/mx.svg" },
      { id: 3, title: "Italian", imageSrc: "/it.svg" },
      { id: 4, title: "Chinese", imageSrc: "/ch.svg" },
      { id: 5, title: "Spanish", imageSrc: "/es.svg" },
    ]);

    // units
    await db.insert(schema.units).values([
      {
        id: 1,
        courseId: 1, // japanese
        title: "Unit 1 - Japanese Cuisine for Beginners",
        description: "Learn the basics of Japanese cuisine, including sushi, ramen, and tempura.",
        order: 1,
      },
    ]);

    console.log("Seeding finished ✅");
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    throw new Error("Failed to seed the database");
  } finally {
    await pool.end(); // close pool connection
  }
};

main();
