import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { eq, isNull } from "drizzle-orm";
import * as schema from "../db/schema";
import fs from "fs";
import path from "path";
import { v2 as cloudinary } from "cloudinary";

// ElevenLabs API configuration
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_API_URL = "https://api.elevenlabs.io/v1/text-to-speech";

// Voice mapping for different cuisines
const CUISINE_VOICES = {
  japanese: "4lOQ7A2l7HPuG7UIHiKA", // Kyoko - Professional Japanese voice
  mexican: "EXAVITQu4vr4xnSDxMaL", // Sarah - Clear, warm voice for Mexican content
  italian: "cgSgspJ2msm6clMCkdW9", // Jessica - Expressive voice for Italian passion
  korean: "9BWtsMINqrJLrRacOk9x", // Aria - Clear, professional voice for Korean content
  default: "EXAVITQu4vr4xnSDxMaL" // Sarah as fallback
};

// Course ID to cuisine mapping (based on your seed data)
const COURSE_CUISINE_MAP = {
  1: "japanese",
  2: "mexican", 
  3: "italian",
  4: "korean"
} as const;

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const db = drizzle(pool, { schema });

interface AudioGenerationOptions {
  text: string;
  filename: string;
  voice_id?: string;
  model_id?: string;
  voice_settings?: {
    stability: number;
    similarity_boost: number;
    style?: number;
    use_speaker_boost?: boolean;
  };
}

class ElevenLabsAudioGenerator {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error("ElevenLabs API key is required");
    }
    this.apiKey = apiKey;
    this.baseUrl = ELEVENLABS_API_URL;
  }

  getVoiceForCuisine(cuisineType: string): string {
    const voice = CUISINE_VOICES[cuisineType as keyof typeof CUISINE_VOICES] || CUISINE_VOICES.default;
    console.log(`🎭 Using voice for ${cuisineType} cuisine: ${voice}`);
    return voice;
  }

  async generateAudio(options: AudioGenerationOptions): Promise<Buffer> {
    const {
      text,
      voice_id,
      model_id = "eleven_multilingual_v2",
      voice_settings = {
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0.0,
        use_speaker_boost: true,
      },
    } = options;

    const url = `${this.baseUrl}/${voice_id}`;
    
    const requestBody = {
      text,
      model_id,
      voice_settings,
    };

    console.log(`🎵 Generating audio for: "${text.substring(0, 50)}..." with voice ${voice_id}`);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Accept": "audio/mpeg",
          "Content-Type": "application/json",
          "xi-api-key": this.apiKey,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`ElevenLabs API error: ${response.status} - ${errorText}`);
      }

      const audioBuffer = Buffer.from(await response.arrayBuffer());
      console.log(`✅ Audio generated successfully (${audioBuffer.length} bytes)`);
      
      return audioBuffer;
    } catch (error) {
      console.error(`❌ Error generating audio: ${error}`);
      throw error;
    }
  }

  async saveAudioFile(audioBuffer: Buffer, filepath: string): Promise<void> {
    const dir = path.dirname(filepath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(filepath, audioBuffer);
    console.log(`💾 Audio saved to: ${filepath}`);
  }

  async uploadToCloudinary(filepath: string, publicId: string): Promise<string> {
    try {
      console.log(`☁️ Uploading to Cloudinary: ${publicId}`);
      
      const result = await cloudinary.uploader.upload(filepath, {
        resource_type: "video", // For audio files
        public_id: publicId,
        folder: "tastify/audio",
        format: "mp3",
      });

      console.log(`✅ Uploaded to Cloudinary: ${result.secure_url}`);
      return result.secure_url;
    } catch (error) {
      console.error(`❌ Error uploading to Cloudinary: ${error}`);
      throw error;
    }
  }
}

async function getCourseIdFromChallenge(challengeId: number): Promise<number> {
  const result = await db
    .select({
      courseId: schema.units.courseId
    })
    .from(schema.challenges)
    .innerJoin(schema.lessons, eq(schema.challenges.lessonId, schema.lessons.id))
    .innerJoin(schema.units, eq(schema.lessons.unitId, schema.units.id))
    .where(eq(schema.challenges.id, challengeId))
    .limit(1);
  
  return result[0]?.courseId || 1;
}

async function getCourseIdFromOption(optionId: number): Promise<number> {
  const result = await db
    .select({
      courseId: schema.units.courseId
    })
    .from(schema.challengesOptions)
    .innerJoin(schema.challenges, eq(schema.challengesOptions.challengeId, schema.challenges.id))
    .innerJoin(schema.lessons, eq(schema.challenges.lessonId, schema.lessons.id))
    .innerJoin(schema.units, eq(schema.lessons.unitId, schema.units.id))
    .where(eq(schema.challengesOptions.id, optionId))
    .limit(1);
  
  return result[0]?.courseId || 1;
}

async function generateChallengeAudios() {
  console.log("\n🎯 Generating audio for challenges...");
  
  const challenges = await db
    .select()
    .from(schema.challenges);

  const audioGenerator = new ElevenLabsAudioGenerator(ELEVENLABS_API_KEY!);

  for (const challenge of challenges) {
    try {
      // Get course ID to determine cuisine type
      const courseId = await getCourseIdFromChallenge(challenge.id);
      const cuisineType = COURSE_CUISINE_MAP[courseId as keyof typeof COURSE_CUISINE_MAP] || "default";
      const voiceId = audioGenerator.getVoiceForCuisine(cuisineType);

      const filename = `challenge_${challenge.id}_question`;
      const localPath = `./downloads/audio/${filename}.mp3`;
      
      // Generate audio
      const audioBuffer = await audioGenerator.generateAudio({
        text: challenge.question,
        filename,
        voice_id: voiceId,
      });

      // Save locally
      await audioGenerator.saveAudioFile(audioBuffer, localPath);

      // Upload to Cloudinary
      const cloudinaryUrl = await audioGenerator.uploadToCloudinary(
        localPath,
        `challenges/${filename}`
      );

      console.log(`✅ Challenge ${challenge.id} (${cuisineType}) audio generated and uploaded`);
      
      // Clean up local file
      fs.unlinkSync(localPath);
      
    } catch (error) {
      console.error(`❌ Error processing challenge ${challenge.id}: ${error}`);
    }
  }
}

async function generateChallengeOptionsAudios() {
  console.log("\n🎯 Generating audio for challenge options...");
  
  // Get ALL challenge options (not just those without audioSrc)
  const options = await db
    .select()
    .from(schema.challengesOptions);

  console.log(`📊 Found ${options.length} challenge options to process`);

  const audioGenerator = new ElevenLabsAudioGenerator(ELEVENLABS_API_KEY!);
  const processedTexts = new Set<string>(); // Track processed texts to avoid duplicates
  let generatedCount = 0;
  let skippedCount = 0;
  let duplicateCount = 0;

  for (const option of options) {
    try {
      // Check for duplicate text content
      const textKey = option.text.toLowerCase().trim();
      if (processedTexts.has(textKey)) {
        console.log(`⏭️  Skipping duplicate text: "${option.text}"`);
        duplicateCount++;
        continue;
      }
      processedTexts.add(textKey);

      // Get course ID to determine cuisine type
      const courseId = await getCourseIdFromOption(option.id);
      const cuisineType = COURSE_CUISINE_MAP[courseId as keyof typeof COURSE_CUISINE_MAP] || "default";
      const voiceId = audioGenerator.getVoiceForCuisine(cuisineType);

      // Create filename based on text content (matching existing pattern)
      const sanitizedText = option.text
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '') // Remove special characters and spaces
        .substring(0, 50); // Limit length
      
      const filename = sanitizedText;
      const localPath = `./downloads/audio/${filename}.mp3`;
      
      // The audioSrc should match the existing pattern: /{text}.mp3
      const expectedAudioSrc = `/${sanitizedText}.mp3`;
      
      // Check if we should regenerate (if audioSrc exists but we want to update with new voice)
      if (option.audioSrc) {
        console.log(`🔄 Regenerating audio for option ${option.id} with ${cuisineType} voice`);
      }
      
      // Generate audio
      const audioBuffer = await audioGenerator.generateAudio({
        text: option.text,
        filename,
        voice_id: voiceId,
      });

      // Save locally
      await audioGenerator.saveAudioFile(audioBuffer, localPath);

      // Upload to Cloudinary
      const cloudinaryUrl = await audioGenerator.uploadToCloudinary(
        localPath,
        `options/${filename}`
      );

      // Update database with the expected audioSrc format (not the Cloudinary URL)
      await db
        .update(schema.challengesOptions)
        .set({ audioSrc: expectedAudioSrc })
        .where(eq(schema.challengesOptions.id, option.id));

      console.log(`✅ Option ${option.id} (${cuisineType}) audio generated:`);
      console.log(`   Text: "${option.text}"`);
      console.log(`   AudioSrc: ${expectedAudioSrc}`);
      console.log(`   Cloudinary: ${cloudinaryUrl}`);
      generatedCount++;
      
      // Clean up local file
      fs.unlinkSync(localPath);
      
      // Add a small delay to avoid hitting API rate limits
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.error(`❌ Error processing option ${option.id}: ${error}`);
      skippedCount++;
    }
  }

  console.log(`\n📈 Challenge Options Summary:`);
  console.log(`   ✅ Generated: ${generatedCount}`);
  console.log(`   ⏭️  Duplicates skipped: ${duplicateCount}`);
  console.log(`   ❌ Errors: ${skippedCount}`);
  console.log(`   📊 Total processed: ${options.length}`);
}

async function generateLessonContentAudios() {
  console.log("\n📚 Generating audio for lesson content...");
  
  const lessonsDir = "./content/lessons";
  const lessonFiles = fs.readdirSync(lessonsDir).filter(file => file.endsWith('.json'));
  
  const audioGenerator = new ElevenLabsAudioGenerator(ELEVENLABS_API_KEY!);

  for (const lessonFile of lessonFiles) {
    try {
      const lessonPath = path.join(lessonsDir, lessonFile);
      const lessonData = JSON.parse(fs.readFileSync(lessonPath, 'utf-8'));
      const lessonId = parseInt(path.basename(lessonFile, '.json'));
      
      // Get lesson info to determine course and cuisine type
      const lessonInfo = await db
        .select({
          courseId: schema.units.courseId
        })
        .from(schema.lessons)
        .innerJoin(schema.units, eq(schema.lessons.unitId, schema.units.id))
        .where(eq(schema.lessons.id, lessonId))
        .limit(1);
      
      const courseId = lessonInfo[0]?.courseId || 1;
      const cuisineType = COURSE_CUISINE_MAP[courseId as keyof typeof COURSE_CUISINE_MAP] || "default";
      const voiceId = audioGenerator.getVoiceForCuisine(cuisineType);
      
      console.log(`📖 Processing lesson ${lessonId} (${cuisineType} cuisine)`);
      
      // Generate audio for introduction
      if (lessonData.context?.introduction) {
        const filename = `lesson_${lessonId}_introduction`;
        const localPath = `./downloads/audio/${filename}.mp3`;
        
        const audioBuffer = await audioGenerator.generateAudio({
          text: lessonData.context.introduction,
          filename,
          voice_id: voiceId,
        });

        await audioGenerator.saveAudioFile(audioBuffer, localPath);
        
        const cloudinaryUrl = await audioGenerator.uploadToCloudinary(
          localPath,
          `lessons/${filename}`
        );

        console.log(`✅ Lesson ${lessonId} (${cuisineType}) introduction audio generated`);
        fs.unlinkSync(localPath);
      }

      // Generate audio for each section
      if (lessonData.context?.sections) {
        for (let i = 0; i < lessonData.context.sections.length; i++) {
          const section = lessonData.context.sections[i];
          
          // Section title
          if (section.title) {
            const filename = `lesson_${lessonId}_section_${i}_title`;
            const localPath = `./downloads/audio/${filename}.mp3`;
            
            const audioBuffer = await audioGenerator.generateAudio({
              text: section.title,
              filename,
              voice_id: voiceId,
            });

            await audioGenerator.saveAudioFile(audioBuffer, localPath);
            
            const cloudinaryUrl = await audioGenerator.uploadToCloudinary(
              localPath,
              `lessons/${filename}`
            );

            console.log(`✅ Lesson ${lessonId} (${cuisineType}) section ${i} title audio generated`);
            fs.unlinkSync(localPath);
          }

          // Section content
          if (section.content) {
            const filename = `lesson_${lessonId}_section_${i}_content`;
            const localPath = `./downloads/audio/${filename}.mp3`;
            
            const audioBuffer = await audioGenerator.generateAudio({
              text: section.content,
              filename,
              voice_id: voiceId,
            });

            await audioGenerator.saveAudioFile(audioBuffer, localPath);
            
            const cloudinaryUrl = await audioGenerator.uploadToCloudinary(
              localPath,
              `lessons/${filename}`
            );

            console.log(`✅ Lesson ${lessonId} (${cuisineType}) section ${i} content audio generated`);
            fs.unlinkSync(localPath);
          }

          // List items
          if (section.listItems) {
            for (let j = 0; j < section.listItems.length; j++) {
              const filename = `lesson_${lessonId}_section_${i}_item_${j}`;
              const localPath = `./downloads/audio/${filename}.mp3`;
              
              const audioBuffer = await audioGenerator.generateAudio({
                text: section.listItems[j],
                filename,
                voice_id: voiceId,
              });

              await audioGenerator.saveAudioFile(audioBuffer, localPath);
              
              const cloudinaryUrl = await audioGenerator.uploadToCloudinary(
                localPath,
                `lessons/${filename}`
              );

              console.log(`✅ Lesson ${lessonId} (${cuisineType}) section ${i} item ${j} audio generated`);
              fs.unlinkSync(localPath);
            }
          }
        }
      }
      
    } catch (error) {
      console.error(`❌ Error processing lesson ${lessonFile}: ${error}`);
    }
  }
}

async function main() {
  try {
    console.log("🎵 Starting ElevenLabs audio generation with cuisine-specific voices...");
    console.log("🎭 Voice mapping:");
    console.log("   🍣 Japanese: Kyoko (Professional Japanese voice)");
    console.log("   🌮 Mexican: Sarah (Clear, warm voice)");
    console.log("   🍝 Italian: Jessica (Expressive voice)");
    console.log("   🥢 Korean: Aria (Clear, professional voice)");
    
    // Create downloads directory if it doesn't exist
    if (!fs.existsSync('./downloads/audio')) {
      fs.mkdirSync('./downloads/audio', { recursive: true });
    }

    // Generate audios for different content types
    await generateChallengeOptionsAudios();
    await generateChallengeAudios();
    await generateLessonContentAudios();

    console.log("\n🎉 Audio generation completed successfully!");
    
  } catch (error) {
    console.error("❌ Error during audio generation:", error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Allow running specific functions
const args = process.argv.slice(2);
if (args.length > 0) {
  const command = args[0];
  
  switch (command) {
    case 'challenges':
      generateChallengeAudios().catch(console.error).finally(() => pool.end());
      break;
    case 'options':
      generateChallengeOptionsAudios().catch(console.error).finally(() => pool.end());
      break;
    case 'lessons':
      generateLessonContentAudios().catch(console.error).finally(() => pool.end());
      break;
    default:
      main().catch((error) => {
        console.error(error);
        process.exit(1);
      });
  }
} else {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
} 