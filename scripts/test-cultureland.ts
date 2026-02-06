
import { config } from "dotenv";
import { CultureLandVerifier } from "../src/lib/business/verifiers/CultureLandVerifier";

// Load .env from root
config();

async function main() {
  const pin = process.argv[2] || "1234-1234-1234-123456";
  console.log(`[Test] Starting Culture Land Verification Test for PIN: ${pin}`);

  const verifier = new CultureLandVerifier();
  
  try {
    const result = await verifier.verify("CULTURE_LAND", pin);
    console.log("[Test] Result:", result);
  } catch (e) {
    console.error("[Test] Error:", e);
  }
}

main();
