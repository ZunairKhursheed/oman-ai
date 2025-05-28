// Test script for ElevenLabs API
// Run with: node scripts/test-elevenlabs.js

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || "";

async function testElevenLabsAPI() {
  console.log("Testing ElevenLabs API connection...\n");

  if (!ELEVENLABS_API_KEY) {
    console.error("❌ ELEVENLABS_API_KEY not found in environment variables");
    console.log("Please set ELEVENLABS_API_KEY in your .env.local file");
    return;
  }

  console.log("✅ API Key found");

  // Test 1: Fetch voices
  console.log("\n📋 Fetching available voices...");
  try {
    const voicesResponse = await fetch("https://api.elevenlabs.io/v1/voices", {
      headers: {
        "xi-api-key": ELEVENLABS_API_KEY,
      },
    });

    if (voicesResponse.ok) {
      const data = await voicesResponse.json();
      console.log(`✅ Found ${data.voices.length} voices`);
      console.log("\nAvailable voices:");
      data.voices.slice(0, 5).forEach((voice) => {
        console.log(`  - ${voice.name} (${voice.voice_id})`);
      });
      if (data.voices.length > 5) {
        console.log(`  ... and ${data.voices.length - 5} more`);
      }
    } else {
      console.error(
        "❌ Failed to fetch voices:",
        voicesResponse.status,
        voicesResponse.statusText
      );
    }
  } catch (error) {
    console.error("❌ Error fetching voices:", error.message);
  }

  // Test 2: User info
  console.log("\n👤 Fetching user info...");
  try {
    const userResponse = await fetch("https://api.elevenlabs.io/v1/user", {
      headers: {
        "xi-api-key": ELEVENLABS_API_KEY,
      },
    });

    if (userResponse.ok) {
      const data = await userResponse.json();
      console.log("✅ User info retrieved successfully");
      console.log(
        `  - Character count: ${data.subscription.character_count}/${data.subscription.character_limit}`
      );
      console.log(`  - Tier: ${data.subscription.tier}`);
    } else {
      console.error(
        "❌ Failed to fetch user info:",
        userResponse.status,
        userResponse.statusText
      );
    }
  } catch (error) {
    console.error("❌ Error fetching user info:", error.message);
  }

  console.log("\n✨ Test complete!");
}

// Run the test
testElevenLabsAPI();
