import "dotenv/config";

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

interface Voice {
  voice_id: string;
  name: string;
  category: string;
  description?: string;
  preview_url?: string;
  available_for_tiers: string[];
  settings?: {
    stability: number;
    similarity_boost: number;
    style?: number;
    use_speaker_boost?: boolean;
  };
}

async function listVoices() {
  if (!ELEVENLABS_API_KEY) {
    console.error("❌ ELEVENLABS_API_KEY is required in your .env file");
    process.exit(1);
  }

  try {
    console.log("🎵 Fetching available ElevenLabs voices...\n");

    const response = await fetch("https://api.elevenlabs.io/v1/voices", {
      method: "GET",
      headers: {
        "xi-api-key": ELEVENLABS_API_KEY,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`ElevenLabs API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const voices: Voice[] = data.voices;

    console.log(`Found ${voices.length} available voices:\n`);
    console.log("┌─────────────────────────────────┬──────────────────┬─────────────┐");
    console.log("│ Voice ID                        │ Name             │ Category    │");
    console.log("├─────────────────────────────────┼──────────────────┼─────────────┤");

    voices.forEach((voice) => {
      const id = voice.voice_id.padEnd(31);
      const name = voice.name.padEnd(16);
      const category = voice.category.padEnd(11);
      console.log(`│ ${id} │ ${name} │ ${category} │`);
    });

    console.log("└─────────────────────────────────┴──────────────────┴─────────────┘\n");

    // Show recommended voices for different use cases
    console.log("🎯 Recommended voices for your project:\n");
    
    const recommendedVoices = [
      { id: "21m00Tcm4TlvDq8ikWAM", name: "Rachel", reason: "Clear, professional female voice - great for educational content" },
      { id: "pNInz6obpgDQGcFmaJgB", name: "Adam", reason: "Warm, friendly male voice - good for instructions" },
      { id: "EXAVITQu4vr4xnSDxMaL", name: "Bella", reason: "Expressive female voice - good for engaging content" },
      { id: "ErXwobaYiN019PkySvjV", name: "Antoni", reason: "Calm, clear male voice - excellent for learning materials" },
    ];

    recommendedVoices.forEach((voice) => {
      console.log(`🔹 ${voice.name} (${voice.id})`);
      console.log(`   ${voice.reason}\n`);
    });

    console.log("💡 To use a specific voice, set ELEVENLABS_VOICE_ID in your .env file:");
    console.log("   ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM");
    console.log("\n🎧 You can preview voices at: https://elevenlabs.io/voice-library");

  } catch (error) {
    console.error("❌ Error fetching voices:", error);
    process.exit(1);
  }
}

listVoices(); 