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

    // Clean existing data
    await db.delete(schema.questProgress);
    await db.delete(schema.challengeProgress);
    await db.delete(schema.challengesOptions);
    await db.delete(schema.challenges);
    await db.delete(schema.lessons);
    await db.delete(schema.units);
    await db.delete(schema.userProgress);
    await db.delete(schema.courses);
    await db.delete(schema.userSubscription);

    // Insert courses
    await db.insert(schema.courses).values([
      { id: 1, title: "Japanese", imageSrc: "/jp.svg" },
      { id: 2, title: "Mexican", imageSrc: "/mx.svg" },
      { id: 3, title: "Italian", imageSrc: "/it.svg" },
      { id: 4, title: "Korean", imageSrc: "/kr.svg" },
    ]);

    // Insert units (one basic unit per course)
    await db.insert(schema.units).values([
      {
        id: 1,
        courseId: 1, // Japanese
        title: "Japanese Basics",
        description: "Learn the fundamentals of Japanese cuisine",
        order: 1,
      },
      {
        id: 2,
        courseId: 2, // Mexican
        title: "Mexican Basics",
        description: "Discover the essentials of Mexican cooking",
        order: 1,
      },
      {
        id: 3,
        courseId: 3, // Italian
        title: "Italian Basics",
        description: "Master the foundations of Italian cuisine",
        order: 1,
      },
      {
        id: 4,
        courseId: 4, // Korean
        title: "Korean Basics",
        description: "Explore the basics of Korean cooking",
        order: 1,
      }
    ]);

    // Insert lessons (one lesson per unit)
    await db.insert(schema.lessons).values([
      {
        id: 1,
        unitId: 1,
        order: 1,
        title: "Essential Japanese Ingredients & Techniques",
      },
      {
        id: 2,
        unitId: 2,
        order: 1,
        title: "Essential Mexican Ingredients & Techniques",
      },
      {
        id: 3,
        unitId: 3,
        order: 1,
        title: "Essential Italian Ingredients & Techniques",
      },
      {
        id: 4,
        unitId: 4,
        order: 1,
        title: "Essential Korean Ingredients & Techniques",
      },
    ]);

    // Insert challenges for Japanese lesson
    await db.insert(schema.challenges).values([
      {
        id: 1,
        lessonId: 1,
        type: "SELECT",
        order: 1,
        question: "What is the most important flavor component in Japanese cuisine?",
      },
      {
        id: 2,
        lessonId: 1,
        type: "SELECT",
        order: 2,
        question: "Which ingredient is essential for making dashi stock?",
      },
      {
        id: 3,
        lessonId: 1,
        type: "ASSIST",
        order: 3,
        question: "Complete: Rice is prepared with ____ for sushi",
      },
      {
        id: 4,
        lessonId: 1,
        type: "SELECT",
        order: 4,
        question: "What cooking technique is used for tempura?",
      },
    ]);

    // Insert challenges for Mexican lesson
    await db.insert(schema.challenges).values([
      {
        id: 5,
        lessonId: 2,
        type: "SELECT",
        order: 1,
        question: "What is the base of most Mexican salsas?",
      },
      {
        id: 6,
        lessonId: 2,
        type: "SELECT",
        order: 2,
        question: "Which chili is commonly used in Mexican cooking for mild heat?",
      },
      {
        id: 7,
        lessonId: 2,
        type: "ASSIST",
        order: 3,
        question: "Complete: Tortillas are traditionally made from ____",
      },
      {
        id: 8,
        lessonId: 2,
        type: "SELECT",
        order: 4,
        question: "What cooking tool is essential for making fresh tortillas?",
      },
    ]);

    // Insert challenges for Italian lesson
    await db.insert(schema.challenges).values([
      {
        id: 9,
        lessonId: 3,
        type: "SELECT",
        order: 1,
        question: "What type of oil is most commonly used in Italian cooking?",
      },
      {
        id: 10,
        lessonId: 3,
        type: "SELECT",
        order: 2,
        question: "Which herb is essential in most Italian pasta sauces?",
      },
      {
        id: 11,
        lessonId: 3,
        type: "ASSIST",
        order: 3,
        question: "Complete: Pasta should be cooked until ____",
      },
      {
        id: 12,
        lessonId: 3,
        type: "SELECT",
        order: 4,
        question: "What cheese is traditionally used in Carbonara?",
      },
    ]);

    // Insert challenges for Korean lesson
    await db.insert(schema.challenges).values([
      {
        id: 13,
        lessonId: 4,
        type: "SELECT",
        order: 1,
        question: "What fermented vegetable is a staple in Korean cuisine?",
      },
      {
        id: 14,
        lessonId: 4,
        type: "SELECT",
        order: 2,
        question: "Which paste is essential for Korean cooking?",
      },
      {
        id: 15,
        lessonId: 4,
        type: "ASSIST",
        order: 3,
        question: "Complete: Korean rice is typically cooked using ____",
      },
      {
        id: 16,
        lessonId: 4,
        type: "SELECT",
        order: 4,
        question: "What cooking method is used for Korean BBQ?",
      },
    ]);

    // Challenge options for Japanese challenges
    await db.insert(schema.challengesOptions).values([
      // Challenge 1: Umami
      { challengeId: 1, correct: true, text: "Umami", imageSrc: "/umami.jpg" },
      { challengeId: 1, correct: false, text: "Spice", imageSrc: "/spice.jpg" },
      { challengeId: 1, correct: false, text: "Sweetness", imageSrc: "/sweet.jpg" },
      
      // Challenge 2: Dashi
      { challengeId: 2, correct: true, text: "Kombu (seaweed)", imageSrc: "/kombu.jpg" },
      { challengeId: 2, correct: false, text: "Miso", imageSrc: "/miso.jpg" },
      { challengeId: 2, correct: false, text: "Soy sauce", imageSrc: "/soy.jpg" },
      
      // Challenge 3: Rice vinegar
      { challengeId: 3, correct: true, text: "vinegar", audioSrc: "/vinegar.mp3" },
      { challengeId: 3, correct: false, text: "salt", audioSrc: "/salt.mp3" },
      { challengeId: 3, correct: false, text: "sugar", audioSrc: "/sugar.mp3" },
      
      // Challenge 4: Deep frying
      { challengeId: 4, correct: true, text: "Deep frying", imageSrc: "/deepfry.jpg" },
      { challengeId: 4, correct: false, text: "Grilling", imageSrc: "/grill.jpg" },
      { challengeId: 4, correct: false, text: "Steaming", imageSrc: "/steam.jpg" },
    ]);

    // Challenge options for Mexican challenges
    await db.insert(schema.challengesOptions).values([
      // Challenge 5: Tomatoes
      { challengeId: 5, correct: true, text: "Tomatoes", imageSrc: "/tomato.jpg" },
      { challengeId: 5, correct: false, text: "Onions", imageSrc: "/onion.jpg" },
      { challengeId: 5, correct: false, text: "Peppers", imageSrc: "/pepper.jpg" },
      
      // Challenge 6: Poblano
      { challengeId: 6, correct: true, text: "Poblano", imageSrc: "/poblano.jpg" },
      { challengeId: 6, correct: false, text: "Habanero", imageSrc: "/habanero.jpg" },
      { challengeId: 6, correct: false, text: "Ghost pepper", imageSrc: "/ghost.jpg" },
      
      // Challenge 7: Corn masa
      { challengeId: 7, correct: true, text: "corn masa", audioSrc: "/masa.mp3" },
      { challengeId: 7, correct: false, text: "wheat flour", audioSrc: "/wheat.mp3" },
      { challengeId: 7, correct: false, text: "rice flour", audioSrc: "/rice.mp3" },
      
      // Challenge 8: Comal
      { challengeId: 8, correct: true, text: "Comal (griddle)", imageSrc: "/comal.jpg" },
      { challengeId: 8, correct: false, text: "Deep fryer", imageSrc: "/fryer.jpg" },
      { challengeId: 8, correct: false, text: "Steamer", imageSrc: "/steamer.jpg" },
    ]);

    // Challenge options for Italian challenges
    await db.insert(schema.challengesOptions).values([
      // Challenge 9: Olive oil
      { challengeId: 9, correct: true, text: "Extra virgin olive oil", imageSrc: "/olive_oil.jpg" },
      { challengeId: 9, correct: false, text: "Vegetable oil", imageSrc: "/veg_oil.jpg" },
      { challengeId: 9, correct: false, text: "Butter", imageSrc: "/butter.jpg" },
      
      // Challenge 10: Basil
      { challengeId: 10, correct: true, text: "Basil", imageSrc: "/basil.jpg" },
      { challengeId: 10, correct: false, text: "Oregano", imageSrc: "/oregano.jpg" },
      { challengeId: 10, correct: false, text: "Thyme", imageSrc: "/thyme.jpg" },
      
      // Challenge 11: Al dente
      { challengeId: 11, correct: true, text: "al dente", audioSrc: "/aldente.mp3" },
      { challengeId: 11, correct: false, text: "very soft", audioSrc: "/soft.mp3" },
      { challengeId: 11, correct: false, text: "hard", audioSrc: "/hard.mp3" },
      
      // Challenge 12: Pecorino Romano
      { challengeId: 12, correct: true, text: "Pecorino Romano", imageSrc: "/pecorino.jpg" },
      { challengeId: 12, correct: false, text: "Mozzarella", imageSrc: "/mozzarella.jpg" },
      { challengeId: 12, correct: false, text: "Parmesan", imageSrc: "/parmesan.jpg" },
    ]);

    // Challenge options for Korean challenges
    await db.insert(schema.challengesOptions).values([
      // Challenge 13: Kimchi
      { challengeId: 13, correct: true, text: "Kimchi", imageSrc: "/kimchi.jpg" },
      { challengeId: 13, correct: false, text: "Seaweed", imageSrc: "/seaweed.jpg" },
      { challengeId: 13, correct: false, text: "Bean sprouts", imageSrc: "/sprouts.jpg" },
      
      // Challenge 14: Gochujang
      { challengeId: 14, correct: true, text: "Gochujang", imageSrc: "/gochujang.jpg" },
      { challengeId: 14, correct: false, text: "Miso", imageSrc: "/miso.jpg" },
      { challengeId: 14, correct: false, text: "Soy sauce", imageSrc: "/soysauce.jpg" },
      
      // Challenge 15: Short grain rice
      { challengeId: 15, correct: true, text: "short grain rice", audioSrc: "/shortgrain.mp3" },
      { challengeId: 15, correct: false, text: "long grain rice", audioSrc: "/longgrain.mp3" },
      { challengeId: 15, correct: false, text: "wild rice", audioSrc: "/wildrice.mp3" },
      
      // Challenge 16: Grilling
      { challengeId: 16, correct: true, text: "Grilling", imageSrc: "/korean_grill.jpg" },
      { challengeId: 16, correct: false, text: "Boiling", imageSrc: "/boiling.jpg" },
      { challengeId: 16, correct: false, text: "Steaming", imageSrc: "/steaming.jpg" },
    ]);

    console.log("Seeding finished ✅");
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    throw new Error("Failed to seed the database");
  } finally {
    await pool.end();
  }
};

main();
