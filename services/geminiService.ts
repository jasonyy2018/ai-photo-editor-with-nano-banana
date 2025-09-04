import { GoogleGenAI, Modality } from "@google/genai";
import { ImageFile, EditedImage } from '../types';

export async function editImageWithGemini(
  image: ImageFile,
  prompt: string,
  apiKey: string
): Promise<EditedImage> {
  if (!apiKey) {
    throw new Error("Google Gemini API Key not provided.");
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: [
        {
          parts: [
            {
              inlineData: {
                data: image.base64,
                mimeType: image.mimeType,
              },
            },
            {
              text: prompt,
            },
          ],
        },
      ],
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    if (
      !response.candidates ||
      response.candidates.length === 0 ||
      !response.candidates[0].content ||
      !response.candidates[0].content.parts
    ) {
      throw new Error("Invalid response structure from Gemini API.");
    }

    const parts = response.candidates[0].content.parts;
    let editedImage: EditedImage | null = null;
    let accompanyingText: string | null = null;
    
    for (const part of parts) {
      if (part.inlineData) {
        editedImage = {
          base64: part.inlineData.data,
          mimeType: part.inlineData.mimeType,
          text: null
        };
      } else if (part.text) {
        accompanyingText = part.text;
      }
    }
    
    if (!editedImage) {
        throw new Error("API did not return an image. It might have refused the request.");
    }

    editedImage.text = accompanyingText;
    
    return editedImage;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Gemini API Error: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the Gemini API.");
  }
}