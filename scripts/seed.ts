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
        title: "Unit 1",
        description: "Japanese Cuisine for Beginners",
        order: 1,
      },
      {
        id: 2,
        courseId: 1, // japanese
        title: "Unit 2",
        description: "Essential Japanese Ingredients",
        order: 2,
      },
      {
        id: 3,
        courseId: 1, // japanese
        title: "Unit 3",
        description: "Cutting and Preparation Techniques",
        order: 1,
      },
      {
        id: 4,
        courseId: 1, // japanese
        title: "Unit 4",
        description: "Classic Japanese Dishes",
        order: 2,
      }
    ]);

    await db.insert(schema.lessons).values([
      {
        id: 1,
        unitId: 1,
        order: 1,
        title: "Introduction to Japanese Cuisine",
      },
      {
        id: 2,
        unitId: 1,
        order: 2,
        title: "Essential Ingredients",
      },
      {
        id: 3,
        unitId: 1,
        order: 3,
        title: "Japanese Cooking Tools",
      },
      {
        id: 4,
        unitId: 1,
        order: 4,
        title: "Basic Knife Skills",
      },
      {
        id: 5,
        unitId: 1,
        order: 5,
        title: "Making Dashi Stock",
      },
      {
        id: 6,
        unitId: 1,
        order: 6,
        title: "Preparing Rice for Sushi",
      },
      // id 2-6 are example lessons
    ]);

    await db.insert(schema.challenges).values([
      {
        id: 1,
        lessonId: 1, // Introduction to Japanese Cuisine
        type: "SELECT",
        order: 1,
        question: "What is the main focus of Japanese cuisine?",
      },
    ]);

    await db.insert(schema.challengesOptions).values([
      {
        id: 1,
        challengeId: 1, // Question 1
        imageSrc: "/umami.jpg",
        correct: true,
        text: "Umami",
        audioSrc: "umami.mp3",
      },
      {
        id: 2,
        challengeId: 1, // Question 1
        imageSrc: "/sushi.jpg",
        correct: false,
        text: "Sushi",
        audioSrc: "sushi.mp3",
      },
      {
        id: 3,
        challengeId: 1, // Question 1
        imageSrc: "/tempura.jpg",
        correct: false,
        text: "Tempura",
        audioSrc: "tempura.mp3",
      },
    ])
    
    console.log("Seeding finished ✅");
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    throw new Error("Failed to seed the database");
  } finally {
    await pool.end(); // close pool connection
  }
};

main();
