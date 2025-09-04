
export interface ImageFile {
  base64: string;
  mimeType: string;
  name: string;
}

export interface EditedImage {
    base64: string;
    mimeType: string;
    text: string | null;
}
