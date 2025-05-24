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

    // Insert lessons (five lessons per unit: all fundamentals/basics level)
    await db.insert(schema.lessons).values([
      // Japanese Course Lessons - Fundamentals
      {
        id: 1,
        unitId: 1,
        order: 1,
        title: "Essential Japanese Ingredients & Umami",
      },
      {
        id: 2,
        unitId: 1,
        order: 2,
        title: "Basic Japanese Cooking Tools & Equipment",
      },
      {
        id: 3,
        unitId: 1,
        order: 3,
        title: "Fundamental Japanese Cooking Techniques",
      },
      {
        id: 4,
        unitId: 1,
        order: 4,
        title: "Basic Japanese Rice & Noodle Preparation",
      },
      {
        id: 5,
        unitId: 1,
        order: 5,
        title: "Simple Japanese Dishes & Presentation Basics",
      },
      // Mexican Course Lessons - Essentials
      {
        id: 6,
        unitId: 2,
        order: 1,
        title: "Essential Mexican Ingredients & Chiles",
      },
      {
        id: 7,
        unitId: 2,
        order: 2,
        title: "Basic Mexican Cooking Tools & Comal Use",
      },
      {
        id: 8,
        unitId: 2,
        order: 3,
        title: "Fundamental Mexican Cooking Methods",
      },
      {
        id: 9,
        unitId: 2,
        order: 4,
        title: "Basic Mexican Masa & Tortilla Making",
      },
      {
        id: 10,
        unitId: 2,
        order: 5,
        title: "Simple Mexican Salsas & Basic Dishes",
      },
      // Italian Course Lessons - Foundations
      {
        id: 11,
        unitId: 3,
        order: 1,
        title: "Essential Italian Ingredients & Olive Oil",
      },
      {
        id: 12,
        unitId: 3,
        order: 2,
        title: "Basic Italian Cooking Tools & Techniques",
      },
      {
        id: 13,
        unitId: 3,
        order: 3,
        title: "Fundamental Pasta Cooking & Al Dente",
      },
      {
        id: 14,
        unitId: 3,
        order: 4,
        title: "Basic Italian Sauces & Herbs",
      },
      {
        id: 15,
        unitId: 3,
        order: 5,
        title: "Simple Italian Dishes & Plating Basics",
      },
      // Korean Course Lessons - Basics
      {
        id: 16,
        unitId: 4,
        order: 1,
        title: "Essential Korean Ingredients & Fermentation",
      },
      {
        id: 17,
        unitId: 4,
        order: 2,
        title: "Basic Korean Cooking Tools & Rice Preparation",
      },
      {
        id: 18,
        unitId: 4,
        order: 3,
        title: "Fundamental Korean Cooking Techniques",
      },
      {
        id: 19,
        unitId: 4,
        order: 4,
        title: "Basic Korean Marinades & Bulgogi",
      },
      {
        id: 20,
        unitId: 4,
        order: 5,
        title: "Simple Korean Dishes & Banchan Basics",
      },
    ]);

    // Insert challenges for all lessons (4 challenges per lesson = 80 total)
    await db.insert(schema.challenges).values([
      // Japanese Lesson 1: Essential Japanese Ingredients & Umami
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
        question: "Complete: Miso is made from fermented ____",
      },
      {
        id: 4,
        lessonId: 1,
        type: "SELECT",
        order: 4,
        question: "What type of seaweed is commonly used in Japanese cooking?",
      },

      // Japanese Lesson 2: Basic Japanese Cooking Tools & Equipment
      {
        id: 5,
        lessonId: 2,
        type: "SELECT",
        order: 1,
        question: "What is a Japanese wooden rice paddle called?",
      },
      {
        id: 6,
        lessonId: 2,
        type: "SELECT",
        order: 2,
        question: "Which pan is traditionally used for cooking Japanese dishes?",
      },
      {
        id: 7,
        lessonId: 2,
        type: "ASSIST",
        order: 3,
        question: "Complete: Japanese knives should be washed by ____",
      },
      {
        id: 8,
        lessonId: 2,
        type: "SELECT",
        order: 4,
        question: "What material are traditional Japanese cutting boards made from?",
      },

      // Japanese Lesson 3: Fundamental Japanese Cooking Techniques
      {
        id: 9,
        lessonId: 3,
        type: "SELECT",
        order: 1,
        question: "What cooking technique is used for tempura?",
      },
      {
        id: 10,
        lessonId: 3,
        type: "SELECT",
        order: 2,
        question: "What is the Japanese steaming technique called?",
      },
      {
        id: 11,
        lessonId: 3,
        type: "ASSIST",
        order: 3,
        question: "Complete: Tempura batter should be mixed ____",
      },
      {
        id: 12,
        lessonId: 3,
        type: "SELECT",
        order: 4,
        question: "What temperature should oil be for tempura frying?",
      },

      // Japanese Lesson 4: Basic Japanese Rice & Noodle Preparation
      {
        id: 13,
        lessonId: 4,
        type: "SELECT",
        order: 1,
        question: "How many times should rice be washed before cooking?",
      },
      {
        id: 14,
        lessonId: 4,
        type: "SELECT",
        order: 2,
        question: "What type of noodles are used in ramen?",
      },
      {
        id: 15,
        lessonId: 4,
        type: "ASSIST",
        order: 3,
        question: "Complete: Soba noodles are made from ____",
      },
      {
        id: 16,
        lessonId: 4,
        type: "SELECT",
        order: 4,
        question: "What is the ideal rice to water ratio for Japanese rice?",
      },

      // Japanese Lesson 5: Simple Japanese Dishes & Presentation Basics
      {
        id: 17,
        lessonId: 5,
        type: "SELECT",
        order: 1,
        question: "What is a basic Japanese soup called?",
      },
      {
        id: 18,
        lessonId: 5,
        type: "SELECT",
        order: 2,
        question: "How many colors should appear on a Japanese plate?",
      },
      {
        id: 19,
        lessonId: 5,
        type: "ASSIST",
        order: 3,
        question: "Complete: Onigiri is rice shaped into ____",
      },
      {
        id: 20,
        lessonId: 5,
        type: "SELECT",
        order: 4,
        question: "What garnish is commonly used in Japanese dishes?",
      },

      // Mexican Lesson 6: Essential Mexican Ingredients & Chiles
      {
        id: 21,
        lessonId: 6,
        type: "SELECT",
        order: 1,
        question: "What is the base of most Mexican salsas?",
      },
      {
        id: 22,
        lessonId: 6,
        type: "SELECT",
        order: 2,
        question: "Which chile is mildest for beginners?",
      },
      {
        id: 23,
        lessonId: 6,
        type: "ASSIST",
        order: 3,
        question: "Complete: Jalapeño peppers are ____ when fresh",
      },
      {
        id: 24,
        lessonId: 6,
        type: "SELECT",
        order: 4,
        question: "What spice gives Mexican food its yellow color?",
      },

      // Mexican Lesson 7: Basic Mexican Cooking Tools & Comal Use
      {
        id: 25,
        lessonId: 7,
        type: "SELECT",
        order: 1,
        question: "What cooking tool is essential for making tortillas?",
      },
      {
        id: 26,
        lessonId: 7,
        type: "SELECT",
        order: 2,
        question: "What is a molcajete used for?",
      },
      {
        id: 27,
        lessonId: 7,
        type: "ASSIST",
        order: 3,
        question: "Complete: A comal should be heated ____",
      },
      {
        id: 28,
        lessonId: 7,
        type: "SELECT",
        order: 4,
        question: "What material are traditional molcajetes made from?",
      },

      // Mexican Lesson 8: Fundamental Mexican Cooking Methods
      {
        id: 29,
        lessonId: 8,
        type: "SELECT",
        order: 1,
        question: "What technique is used to prepare chiles for salsa?",
      },
      {
        id: 30,
        lessonId: 8,
        type: "SELECT",
        order: 2,
        question: "How should onions be cut for Mexican dishes?",
      },
      {
        id: 31,
        lessonId: 8,
        type: "ASSIST",
        order: 3,
        question: "Complete: Tomatoes should be ____ for better flavor",
      },
      {
        id: 32,
        lessonId: 8,
        type: "SELECT",
        order: 4,
        question: "What cooking method brings out chile flavors best?",
      },

      // Mexican Lesson 9: Basic Mexican Masa & Tortilla Making
      {
        id: 33,
        lessonId: 9,
        type: "SELECT",
        order: 1,
        question: "What are traditional tortillas made from?",
      },
      {
        id: 34,
        lessonId: 9,
        type: "SELECT",
        order: 2,
        question: "What consistency should masa have?",
      },
      {
        id: 35,
        lessonId: 9,
        type: "ASSIST",
        order: 3,
        question: "Complete: Fresh tortillas are cooked without ____",
      },
      {
        id: 36,
        lessonId: 9,
        type: "SELECT",
        order: 4,
        question: "How thick should a tortilla be?",
      },

      // Mexican Lesson 10: Simple Mexican Salsas & Basic Dishes
      {
        id: 37,
        lessonId: 10,
        type: "SELECT",
        order: 1,
        question: "What is the simplest Mexican salsa?",
      },
      {
        id: 38,
        lessonId: 10,
        type: "SELECT",
        order: 2,
        question: "What basic dish uses tortillas and beans?",
      },
      {
        id: 39,
        lessonId: 10,
        type: "ASSIST",
        order: 3,
        question: "Complete: Quesadillas are tortillas filled with ____",
      },
      {
        id: 40,
        lessonId: 10,
        type: "SELECT",
        order: 4,
        question: "What makes guacamole green?",
      },

      // Italian Lesson 11: Essential Italian Ingredients & Olive Oil
      {
        id: 41,
        lessonId: 11,
        type: "SELECT",
        order: 1,
        question: "What type of oil is most important in Italian cooking?",
      },
      {
        id: 42,
        lessonId: 11,
        type: "SELECT",
        order: 2,
        question: "Which herb is essential in Italian cuisine?",
      },
      {
        id: 43,
        lessonId: 11,
        type: "ASSIST",
        order: 3,
        question: "Complete: Garlic should be sliced ____",
      },
      {
        id: 44,
        lessonId: 11,
        type: "SELECT",
        order: 4,
        question: "What cheese is commonly used in Italian dishes?",
      },

      // Italian Lesson 12: Basic Italian Cooking Tools & Techniques
      {
        id: 45,
        lessonId: 12,
        type: "SELECT",
        order: 1,
        question: "What pan is best for cooking pasta sauce?",
      },
      {
        id: 46,
        lessonId: 12,
        type: "SELECT",
        order: 2,
        question: "How should basil be prepared?",
      },
      {
        id: 47,
        lessonId: 12,
        type: "ASSIST",
        order: 3,
        question: "Complete: Italian dishes should be seasoned with ____",
      },
      {
        id: 48,
        lessonId: 12,
        type: "SELECT",
        order: 4,
        question: "What tool is used to grate cheese?",
      },

      // Italian Lesson 13: Fundamental Pasta Cooking & Al Dente
      {
        id: 49,
        lessonId: 13,
        type: "SELECT",
        order: 1,
        question: "How should pasta be cooked?",
      },
      {
        id: 50,
        lessonId: 13,
        type: "SELECT",
        order: 2,
        question: "How much salt should be added to pasta water?",
      },
      {
        id: 51,
        lessonId: 13,
        type: "ASSIST",
        order: 3,
        question: "Complete: Al dente means ____",
      },
      {
        id: 52,
        lessonId: 13,
        type: "SELECT",
        order: 4,
        question: "When should you add oil to pasta water?",
      },

      // Italian Lesson 14: Basic Italian Sauces & Herbs
      {
        id: 53,
        lessonId: 14,
        type: "SELECT",
        order: 1,
        question: "What is the simplest Italian pasta sauce?",
      },
      {
        id: 54,
        lessonId: 14,
        type: "SELECT",
        order: 2,
        question: "When should fresh herbs be added to cooking?",
      },
      {
        id: 55,
        lessonId: 14,
        type: "ASSIST",
        order: 3,
        question: "Complete: Marinara sauce is made with ____",
      },
      {
        id: 56,
        lessonId: 14,
        type: "SELECT",
        order: 4,
        question: "What herb pairs best with tomatoes?",
      },

      // Italian Lesson 15: Simple Italian Dishes & Plating Basics
      {
        id: 57,
        lessonId: 15,
        type: "SELECT",
        order: 1,
        question: "What is a basic Italian appetizer?",
      },
      {
        id: 58,
        lessonId: 15,
        type: "SELECT",
        order: 2,
        question: "How should pasta be served?",
      },
      {
        id: 59,
        lessonId: 15,
        type: "ASSIST",
        order: 3,
        question: "Complete: Bruschetta is topped with ____",
      },
      {
        id: 60,
        lessonId: 15,
        type: "SELECT",
        order: 4,
        question: "What makes a Margherita pizza?",
      },

      // Korean Lesson 16: Essential Korean Ingredients & Fermentation
      {
        id: 61,
        lessonId: 16,
        type: "SELECT",
        order: 1,
        question: "What fermented vegetable is essential in Korean cuisine?",
      },
      {
        id: 62,
        lessonId: 16,
        type: "SELECT",
        order: 2,
        question: "What paste gives Korean food its red color?",
      },
      {
        id: 63,
        lessonId: 16,
        type: "ASSIST",
        order: 3,
        question: "Complete: Kimchi is made from ____",
      },
      {
        id: 64,
        lessonId: 16,
        type: "SELECT",
        order: 4,
        question: "How long should kimchi ferment minimum?",
      },

      // Korean Lesson 17: Basic Korean Cooking Tools & Rice Preparation
      {
        id: 65,
        lessonId: 17,
        type: "SELECT",
        order: 1,
        question: "What type of rice is used in Korean cooking?",
      },
      {
        id: 66,
        lessonId: 17,
        type: "SELECT",
        order: 2,
        question: "What tool is used for Korean BBQ?",
      },
      {
        id: 67,
        lessonId: 17,
        type: "ASSIST",
        order: 3,
        question: "Complete: Korean rice should be washed until water is ____",
      },
      {
        id: 68,
        lessonId: 17,
        type: "SELECT",
        order: 4,
        question: "What is a Korean stone bowl called?",
      },

      // Korean Lesson 18: Fundamental Korean Cooking Techniques
      {
        id: 69,
        lessonId: 18,
        type: "SELECT",
        order: 1,
        question: "What cooking method is used for Korean pancakes?",
      },
      {
        id: 70,
        lessonId: 18,
        type: "SELECT",
        order: 2,
        question: "How should vegetables be prepared for Korean dishes?",
      },
      {
        id: 71,
        lessonId: 18,
        type: "ASSIST",
        order: 3,
        question: "Complete: Korean dishes balance sweet, salty, spicy, and ____",
      },
      {
        id: 72,
        lessonId: 18,
        type: "SELECT",
        order: 4,
        question: "What oil is commonly used in Korean cooking?",
      },

      // Korean Lesson 19: Basic Korean Marinades & Bulgogi
      {
        id: 73,
        lessonId: 19,
        type: "SELECT",
        order: 1,
        question: "What fruit is used in Korean marinades?",
      },
      {
        id: 74,
        lessonId: 19,
        type: "SELECT",
        order: 2,
        question: "How long should meat marinate for bulgogi?",
      },
      {
        id: 75,
        lessonId: 19,
        type: "ASSIST",
        order: 3,
        question: "Complete: Bulgogi means ____",
      },
      {
        id: 76,
        lessonId: 19,
        type: "SELECT",
        order: 4,
        question: "What cut of meat is best for bulgogi?",
      },

      // Korean Lesson 20: Simple Korean Dishes & Banchan Basics
      {
        id: 77,
        lessonId: 20,
        type: "SELECT",
        order: 1,
        question: "What are Korean side dishes called?",
      },
      {
        id: 78,
        lessonId: 20,
        type: "SELECT",
        order: 2,
        question: "What is the most basic Korean soup?",
      },
      {
        id: 79,
        lessonId: 20,
        type: "ASSIST",
        order: 3,
        question: "Complete: Bibimbap means ____",
      },
      {
        id: 80,
        lessonId: 20,
        type: "SELECT",
        order: 4,
        question: "How many banchan are typically served?",
      },
    ]);

    // Challenge options for challenges 41-80 (Italian and Korean lessons)
    await db.insert(schema.challengesOptions).values([
      // Italian Lesson 11 - Challenge 41: Extra virgin olive oil (correct in position 2)
      { challengeId: 41, correct: false, text: "Vegetable oil", imageSrc: "/vegetable_oil.jpg" },
      { challengeId: 41, correct: true, text: "Extra virgin olive oil", imageSrc: "/extra_virgin.jpg" },
      { challengeId: 41, correct: false, text: "Canola oil", imageSrc: "/canola_oil.jpg" },
      { challengeId: 41, correct: false, text: "Sunflower oil", imageSrc: "/sunflower_oil.jpg" },

      // Italian Lesson 11 - Challenge 42: Basil (correct in position 3)
      { challengeId: 42, correct: false, text: "Oregano", imageSrc: "/oregano.jpg" },
      { challengeId: 42, correct: false, text: "Thyme", imageSrc: "/thyme.jpg" },
      { challengeId: 42, correct: true, text: "Basil", imageSrc: "/basil.jpg" },
      { challengeId: 42, correct: false, text: "Rosemary", imageSrc: "/rosemary.jpg" },

      // Italian Lesson 11 - Challenge 43: Thinly (correct in position 1)
      { challengeId: 43, correct: true, text: "thinly", audioSrc: "/thinly.mp3" },
      { challengeId: 43, correct: false, text: "thickly", audioSrc: "/thickly.mp3" },
      { challengeId: 43, correct: false, text: "chopped", audioSrc: "/chopped.mp3" },
      { challengeId: 43, correct: false, text: "crushed", audioSrc: "/crushed.mp3" },

      // Italian Lesson 11 - Challenge 44: Parmesan (correct in position 4)
      { challengeId: 44, correct: false, text: "Mozzarella", imageSrc: "/mozzarella.jpg" },
      { challengeId: 44, correct: false, text: "Ricotta", imageSrc: "/ricotta.jpg" },
      { challengeId: 44, correct: false, text: "Gorgonzola", imageSrc: "/gorgonzola.jpg" },
      { challengeId: 44, correct: true, text: "Parmesan", imageSrc: "/parmesan.jpg" },

      // Italian Lesson 12 - Challenge 45: Heavy-bottomed pan (correct in position 2)
      { challengeId: 45, correct: false, text: "Thin aluminum pan", imageSrc: "/thin_pan.jpg" },
      { challengeId: 45, correct: true, text: "Heavy-bottomed pan", imageSrc: "/heavy_pan.jpg" },
      { challengeId: 45, correct: false, text: "Non-stick pan", imageSrc: "/nonstick_pan.jpg" },
      { challengeId: 45, correct: false, text: "Glass pan", imageSrc: "/glass_pan.jpg" },

      // Italian Lesson 12 - Challenge 46: Torn by hand (correct in position 3)
      { challengeId: 46, correct: false, text: "Chopped with knife", imageSrc: "/chopped_knife.jpg" },
      { challengeId: 46, correct: false, text: "Blended", imageSrc: "/blended.jpg" },
      { challengeId: 46, correct: true, text: "Torn by hand", imageSrc: "/torn_hand.jpg" },
      { challengeId: 46, correct: false, text: "Minced", imageSrc: "/minced.jpg" },

      // Italian Lesson 12 - Challenge 47: Salt and pepper (correct in position 1)
      { challengeId: 47, correct: true, text: "salt and pepper", audioSrc: "/salt_pepper.mp3" },
      { challengeId: 47, correct: false, text: "sugar", audioSrc: "/sugar.mp3" },
      { challengeId: 47, correct: false, text: "vinegar", audioSrc: "/vinegar.mp3" },
      { challengeId: 47, correct: false, text: "lemon juice", audioSrc: "/lemon_juice.mp3" },

      // Italian Lesson 12 - Challenge 48: Microplane grater (correct in position 4)
      { challengeId: 48, correct: false, text: "Knife", imageSrc: "/knife.jpg" },
      { challengeId: 48, correct: false, text: "Spoon", imageSrc: "/spoon.jpg" },
      { challengeId: 48, correct: false, text: "Fork", imageSrc: "/fork.jpg" },
      { challengeId: 48, correct: true, text: "Microplane grater", imageSrc: "/microplane.jpg" },

      // Italian Lesson 13 - Challenge 49: Al dente (correct in position 2)
      { challengeId: 49, correct: false, text: "Very soft", imageSrc: "/very_soft.jpg" },
      { challengeId: 49, correct: true, text: "Al dente", imageSrc: "/al_dente.jpg" },
      { challengeId: 49, correct: false, text: "Hard", imageSrc: "/hard.jpg" },
      { challengeId: 49, correct: false, text: "Mushy", imageSrc: "/mushy.jpg" },

      // Italian Lesson 13 - Challenge 50: Like sea water (correct in position 3)
      { challengeId: 50, correct: false, text: "No salt", imageSrc: "/no_salt.jpg" },
      { challengeId: 50, correct: false, text: "A pinch", imageSrc: "/pinch.jpg" },
      { challengeId: 50, correct: true, text: "Like sea water", imageSrc: "/sea_water.jpg" },
      { challengeId: 50, correct: false, text: "Very salty", imageSrc: "/very_salty.jpg" },

      // Italian Lesson 13 - Challenge 51: To the tooth (correct in position 1)
      { challengeId: 51, correct: true, text: "to the tooth", audioSrc: "/to_tooth.mp3" },
      { challengeId: 51, correct: false, text: "very soft", audioSrc: "/very_soft.mp3" },
      { challengeId: 51, correct: false, text: "hard", audioSrc: "/hard.mp3" },
      { challengeId: 51, correct: false, text: "overcooked", audioSrc: "/overcooked.mp3" },

      // Italian Lesson 13 - Challenge 52: Never (correct in position 4)
      { challengeId: 52, correct: false, text: "Always", imageSrc: "/always.jpg" },
      { challengeId: 52, correct: false, text: "Sometimes", imageSrc: "/sometimes.jpg" },
      { challengeId: 52, correct: false, text: "Before boiling", imageSrc: "/before_boil.jpg" },
      { challengeId: 52, correct: true, text: "Never", imageSrc: "/never.jpg" },

      // Italian Lesson 14 - Challenge 53: Aglio e olio (correct in position 2)
      { challengeId: 53, correct: false, text: "Carbonara", imageSrc: "/carbonara.jpg" },
      { challengeId: 53, correct: true, text: "Aglio e olio", imageSrc: "/aglio_olio.jpg" },
      { challengeId: 53, correct: false, text: "Bolognese", imageSrc: "/bolognese.jpg" },
      { challengeId: 53, correct: false, text: "Pesto", imageSrc: "/pesto.jpg" },

      // Italian Lesson 14 - Challenge 54: At the end (correct in position 3)
      { challengeId: 54, correct: false, text: "At the beginning", imageSrc: "/beginning.jpg" },
      { challengeId: 54, correct: false, text: "In the middle", imageSrc: "/middle.jpg" },
      { challengeId: 54, correct: true, text: "At the end", imageSrc: "/end.jpg" },
      { challengeId: 54, correct: false, text: "Never", imageSrc: "/never.jpg" },

      // Italian Lesson 14 - Challenge 55: Tomatoes (correct in position 1)
      { challengeId: 55, correct: true, text: "tomatoes", audioSrc: "/tomatoes.mp3" },
      { challengeId: 55, correct: false, text: "cream", audioSrc: "/cream.mp3" },
      { challengeId: 55, correct: false, text: "meat", audioSrc: "/meat.mp3" },
      { challengeId: 55, correct: false, text: "cheese", audioSrc: "/cheese.mp3" },

      // Italian Lesson 14 - Challenge 56: Basil (correct in position 4)
      { challengeId: 56, correct: false, text: "Oregano", imageSrc: "/oregano.jpg" },
      { challengeId: 56, correct: false, text: "Thyme", imageSrc: "/thyme.jpg" },
      { challengeId: 56, correct: false, text: "Rosemary", imageSrc: "/rosemary.jpg" },
      { challengeId: 56, correct: true, text: "Basil", imageSrc: "/basil.jpg" },

      // Italian Lesson 15 - Challenge 57: Bruschetta (correct in position 2)
      { challengeId: 57, correct: false, text: "Antipasto", imageSrc: "/antipasto.jpg" },
      { challengeId: 57, correct: true, text: "Bruschetta", imageSrc: "/bruschetta.jpg" },
      { challengeId: 57, correct: false, text: "Crostini", imageSrc: "/crostini.jpg" },
      { challengeId: 57, correct: false, text: "Focaccia", imageSrc: "/focaccia.jpg" },

      // Italian Lesson 15 - Challenge 58: Hot (correct in position 3)
      { challengeId: 58, correct: false, text: "Cold", imageSrc: "/cold.jpg" },
      { challengeId: 58, correct: false, text: "Room temperature", imageSrc: "/room_temp.jpg" },
      { challengeId: 58, correct: true, text: "Hot", imageSrc: "/hot.jpg" },
      { challengeId: 58, correct: false, text: "Warm", imageSrc: "/warm.jpg" },

      // Italian Lesson 15 - Challenge 59: Tomatoes (correct in position 1)
      { challengeId: 59, correct: true, text: "tomatoes", audioSrc: "/tomatoes.mp3" },
      { challengeId: 59, correct: false, text: "cheese", audioSrc: "/cheese.mp3" },
      { challengeId: 59, correct: false, text: "prosciutto", audioSrc: "/prosciutto.mp3" },
      { challengeId: 59, correct: false, text: "mushrooms", audioSrc: "/mushrooms.mp3" },

      // Italian Lesson 15 - Challenge 60: Tomato, mozzarella, basil (correct in position 4)
      { challengeId: 60, correct: false, text: "Pepperoni", imageSrc: "/pepperoni.jpg" },
      { challengeId: 60, correct: false, text: "Mushrooms", imageSrc: "/mushrooms.jpg" },
      { challengeId: 60, correct: false, text: "Four cheese", imageSrc: "/four_cheese.jpg" },
      { challengeId: 60, correct: true, text: "Tomato, mozzarella, basil", imageSrc: "/margherita.jpg" },

      // Korean Lesson 16 - Challenge 61: Kimchi (correct in position 2)
      { challengeId: 61, correct: false, text: "Seaweed", imageSrc: "/seaweed.jpg" },
      { challengeId: 61, correct: true, text: "Kimchi", imageSrc: "/kimchi.jpg" },
      { challengeId: 61, correct: false, text: "Bean sprouts", imageSrc: "/bean_sprouts.jpg" },
      { challengeId: 61, correct: false, text: "Pickled radish", imageSrc: "/pickled_radish.jpg" },

      // Korean Lesson 16 - Challenge 62: Gochujang (correct in position 3)
      { challengeId: 62, correct: false, text: "Soy sauce", imageSrc: "/soy_sauce.jpg" },
      { challengeId: 62, correct: false, text: "Sesame oil", imageSrc: "/sesame_oil.jpg" },
      { challengeId: 62, correct: true, text: "Gochujang", imageSrc: "/gochujang.jpg" },
      { challengeId: 62, correct: false, text: "Miso", imageSrc: "/miso.jpg" },

      // Korean Lesson 16 - Challenge 63: Napa cabbage (correct in position 1)
      { challengeId: 63, correct: true, text: "napa cabbage", audioSrc: "/napa_cabbage.mp3" },
      { challengeId: 63, correct: false, text: "regular cabbage", audioSrc: "/regular_cabbage.mp3" },
      { challengeId: 63, correct: false, text: "lettuce", audioSrc: "/lettuce.mp3" },
      { challengeId: 63, correct: false, text: "spinach", audioSrc: "/spinach.mp3" },

      // Korean Lesson 16 - Challenge 64: 3 days (correct in position 4)
      { challengeId: 64, correct: false, text: "1 day", imageSrc: "/1_day.jpg" },
      { challengeId: 64, correct: false, text: "1 week", imageSrc: "/1_week.jpg" },
      { challengeId: 64, correct: false, text: "1 month", imageSrc: "/1_month.jpg" },
      { challengeId: 64, correct: true, text: "3 days", imageSrc: "/3_days.jpg" },

      // Korean Lesson 17 - Challenge 65: Short grain (correct in position 2)
      { challengeId: 65, correct: false, text: "Long grain", imageSrc: "/long_grain.jpg" },
      { challengeId: 65, correct: true, text: "Short grain", imageSrc: "/short_grain.jpg" },
      { challengeId: 65, correct: false, text: "Wild rice", imageSrc: "/wild_rice.jpg" },
      { challengeId: 65, correct: false, text: "Jasmine rice", imageSrc: "/jasmine_rice.jpg" },

      // Korean Lesson 17 - Challenge 66: Grill grates (correct in position 3)
      { challengeId: 66, correct: false, text: "Wok", imageSrc: "/wok.jpg" },
      { challengeId: 66, correct: false, text: "Frying pan", imageSrc: "/frying_pan.jpg" },
      { challengeId: 66, correct: true, text: "Grill grates", imageSrc: "/grill_grates.jpg" },
      { challengeId: 66, correct: false, text: "Steamer", imageSrc: "/steamer.jpg" },

      // Korean Lesson 17 - Challenge 67: Clear (correct in position 1)
      { challengeId: 67, correct: true, text: "clear", audioSrc: "/clear.mp3" },
      { challengeId: 67, correct: false, text: "cloudy", audioSrc: "/cloudy.mp3" },
      { challengeId: 67, correct: false, text: "dirty", audioSrc: "/dirty.mp3" },
      { challengeId: 67, correct: false, text: "soapy", audioSrc: "/soapy.mp3" },

      // Korean Lesson 17 - Challenge 68: Dolsot (correct in position 4)
      { challengeId: 68, correct: false, text: "Ddukbaegi", imageSrc: "/ddukbaegi.jpg" },
      { challengeId: 68, correct: false, text: "Regular bowl", imageSrc: "/regular_bowl.jpg" },
      { challengeId: 68, correct: false, text: "Metal bowl", imageSrc: "/metal_bowl.jpg" },
      { challengeId: 68, correct: true, text: "Dolsot", imageSrc: "/dolsot.jpg" },

      // Korean Lesson 18 - Challenge 69: Pan frying (correct in position 2)
      { challengeId: 69, correct: false, text: "Deep frying", imageSrc: "/deep_frying.jpg" },
      { challengeId: 69, correct: true, text: "Pan frying", imageSrc: "/pan_frying.jpg" },
      { challengeId: 69, correct: false, text: "Grilling", imageSrc: "/grilling.jpg" },
      { challengeId: 69, correct: false, text: "Steaming", imageSrc: "/steaming.jpg" },

      // Korean Lesson 18 - Challenge 70: Julienned (correct in position 3)
      { challengeId: 70, correct: false, text: "Diced", imageSrc: "/diced.jpg" },
      { challengeId: 70, correct: false, text: "Whole", imageSrc: "/whole.jpg" },
      { challengeId: 70, correct: true, text: "Julienned", imageSrc: "/julienned.jpg" },
      { challengeId: 70, correct: false, text: "Minced", imageSrc: "/minced.jpg" },

      // Korean Lesson 18 - Challenge 71: Sour (correct in position 1)
      { challengeId: 71, correct: true, text: "sour", audioSrc: "/sour.mp3" },
      { challengeId: 71, correct: false, text: "bitter", audioSrc: "/bitter.mp3" },
      { challengeId: 71, correct: false, text: "umami", audioSrc: "/umami.mp3" },
      { challengeId: 71, correct: false, text: "hot", audioSrc: "/hot.mp3" },

      // Korean Lesson 18 - Challenge 72: Sesame oil (correct in position 4)
      { challengeId: 72, correct: false, text: "Vegetable oil", imageSrc: "/vegetable_oil.jpg" },
      { challengeId: 72, correct: false, text: "Olive oil", imageSrc: "/olive_oil.jpg" },
      { challengeId: 72, correct: false, text: "Canola oil", imageSrc: "/canola_oil.jpg" },
      { challengeId: 72, correct: true, text: "Sesame oil", imageSrc: "/sesame_oil.jpg" },

      // Korean Lesson 19 - Challenge 73: Asian pear (correct in position 2)
      { challengeId: 73, correct: false, text: "Apple", imageSrc: "/apple.jpg" },
      { challengeId: 73, correct: true, text: "Asian pear", imageSrc: "/asian_pear.jpg" },
      { challengeId: 73, correct: false, text: "Orange", imageSrc: "/orange.jpg" },
      { challengeId: 73, correct: false, text: "Pineapple", imageSrc: "/pineapple.jpg" },

      // Korean Lesson 19 - Challenge 74: 4 hours (correct in position 3)
      { challengeId: 74, correct: false, text: "30 minutes", imageSrc: "/30_minutes.jpg" },
      { challengeId: 74, correct: false, text: "2 hours", imageSrc: "/2_hours.jpg" },
      { challengeId: 74, correct: true, text: "4 hours", imageSrc: "/4_hours.jpg" },
      { challengeId: 74, correct: false, text: "24 hours", imageSrc: "/24_hours.jpg" },

      // Korean Lesson 19 - Challenge 75: Fire meat (correct in position 1)
      { challengeId: 75, correct: true, text: "fire meat", audioSrc: "/fire_meat.mp3" },
      { challengeId: 75, correct: false, text: "sweet meat", audioSrc: "/sweet_meat.mp3" },
      { challengeId: 75, correct: false, text: "grilled meat", audioSrc: "/grilled_meat.mp3" },
      { challengeId: 75, correct: false, text: "marinated meat", audioSrc: "/marinated_meat.mp3" },

      // Korean Lesson 19 - Challenge 76: Ribeye (correct in position 4)
      { challengeId: 76, correct: false, text: "Chicken", imageSrc: "/chicken.jpg" },
      { challengeId: 76, correct: false, text: "Pork", imageSrc: "/pork.jpg" },
      { challengeId: 76, correct: false, text: "Ground beef", imageSrc: "/ground_beef.jpg" },
      { challengeId: 76, correct: true, text: "Ribeye", imageSrc: "/ribeye.jpg" },

      // Korean Lesson 20 - Challenge 77: Banchan (correct in position 2)
      { challengeId: 77, correct: false, text: "Jjigae", imageSrc: "/jjigae.jpg" },
      { challengeId: 77, correct: true, text: "Banchan", imageSrc: "/banchan.jpg" },
      { challengeId: 77, correct: false, text: "Guksu", imageSrc: "/guksu.jpg" },
      { challengeId: 77, correct: false, text: "Bap", imageSrc: "/bap.jpg" },

      // Korean Lesson 20 - Challenge 78: Miyeok-guk (correct in position 3)
      { challengeId: 78, correct: false, text: "Kimchi jjigae", imageSrc: "/kimchi_jjigae.jpg" },
      { challengeId: 78, correct: false, text: "Doenjang jjigae", imageSrc: "/doenjang_jjigae.jpg" },
      { challengeId: 78, correct: true, text: "Miyeok-guk", imageSrc: "/miyeok_guk.jpg" },
      { challengeId: 78, correct: false, text: "Samgyetang", imageSrc: "/samgyetang.jpg" },

      // Korean Lesson 20 - Challenge 79: Mixed rice (correct in position 1)
      { challengeId: 79, correct: true, text: "mixed rice", audioSrc: "/mixed_rice.mp3" },
      { challengeId: 79, correct: false, text: "fried rice", audioSrc: "/fried_rice.mp3" },
      { challengeId: 79, correct: false, text: "steamed rice", audioSrc: "/steamed_rice.mp3" },
      { challengeId: 79, correct: false, text: "rice bowl", audioSrc: "/rice_bowl.mp3" },

      // Korean Lesson 20 - Challenge 80: 3-5 (correct in position 4)
      { challengeId: 80, correct: false, text: "2", imageSrc: "/2.jpg" },
      { challengeId: 80, correct: false, text: "6-8", imageSrc: "/6_8.jpg" },
      { challengeId: 80, correct: false, text: "10-12", imageSrc: "/10_12.jpg" },
      { challengeId: 80, correct: true, text: "3-5", imageSrc: "/3_5.jpg" },
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
