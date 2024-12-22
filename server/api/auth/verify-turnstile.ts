// server/api/verify-turnstile.ts
import { defineEventHandler, readBody } from 'h3';
import fetch from 'node-fetch';

const TURNSTILE_SECRET_KEY = process.env.NUXT_TURNSTILE_SECRET_KEY;

export default defineEventHandler(async (event) => {
  const { captchaToken } = await readBody(event);

  if (!captchaToken) {
    return { success: false, message: 'Captcha token is missing.' };
  }

  // Ensure the secret key is defined
  if (!TURNSTILE_SECRET_KEY) {
    return { success: false, message: 'Turnstile secret key is not configured.' };
  }

  // Call Turnstile API
  const turnstileResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      secret: TURNSTILE_SECRET_KEY,
      response: captchaToken,
    }),
  });

  const turnstileData = await turnstileResponse.json();

  if (!turnstileData.success) {
    return { success: false, message: 'Captcha verification failed.' };
  }

  return { success: true, message: 'Captcha verification succeeded.' };
});
