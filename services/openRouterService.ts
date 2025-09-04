import { ImageFile } from '../types';

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

export async function describeImageWithOpenRouter(image: ImageFile, apiKey: string): Promise<string> {
  if (!apiKey) {
    throw new Error("OpenRouter API Key not provided.");
  }

  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      // Recommended headers for OpenRouter
      'HTTP-Referer': location.href,
      'X-Title': 'AI Photo Editor',
    },
    body: JSON.stringify({
      model: "google/gemini-flash-1.5", // Corrected model ID for OpenRouter
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Describe this image in detail, focusing on the main subject, setting, and any notable elements.' },
            {
              type: 'image_url',
              image_url: {
                url: `data:${image.mimeType};base64,${image.base64}`,
              },
            },
          ],
        },
      ],
      max_tokens: 512,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => response.text());
    console.error("OpenRouter API Error:", errorData);
    let message = "An unknown error occurred with the OpenRouter API.";
    if (typeof errorData === "string") {
        message = errorData;
    } else if (errorData && errorData.error && typeof errorData.error.message === 'string') {
        message = errorData.error.message;
    } else if (errorData && errorData.error) {
        message = JSON.stringify(errorData.error);
    }
    throw new Error(message);
  }

  const data = await response.json();
  
  if (!data.choices || data.choices.length === 0 || !data.choices[0].message?.content) {
    throw new Error("Invalid response structure from OpenRouter API.");
  }

  return data.choices[0].message.content;
}