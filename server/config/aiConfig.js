// Single source of truth for the Gemini model name.
//
// "gemini-3.8-flash": verified live against the Google API — gemini-2.5-flash
// now returns 404 "no longer available to new users. Please update your code
// to use models/gemini-3.8-flash". The model is intentionally a code constant:
// it is NOT read from process.env.GEMINI_MODEL and .env must not require it.
export const GEMINI_MODEL = "gemini-3.8-flash";

// Startup banner lives here (not server.js) so the effective model is
// always reported no matter which entry point loads this module.
// Model name only — never log API keys here.
console.log(`[ai-config] GEMINI_MODEL=${GEMINI_MODEL}`);

export function getGeminiModel() {
  return GEMINI_MODEL;
}

export default GEMINI_MODEL;
