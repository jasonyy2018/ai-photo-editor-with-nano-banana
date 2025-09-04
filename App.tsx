
import React, { useState, useCallback, useEffect } from 'react';
import { ImageFile, EditedImage } from './types';
import { editImageWithGemini } from './services/geminiService';
import { describeImageWithOpenRouter } from './services/openRouterService';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import ControlPanel from './components/ControlPanel';
import ImageDisplay from './components/ImageDisplay';
import ApiKeyModal from './components/ApiKeyModal';

export default function App() {
  const [originalImage, setOriginalImage] = useState<ImageFile | null>(null);
  const [editedImage, setEditedImage] = useState<EditedImage | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [description, setDescription] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDescribing, setIsDescribing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const [googleApiKey, setGoogleApiKey] = useState<string>('');
  const [openRouterApiKey, setOpenRouterApiKey] = useState<string>('');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      const storedGoogleKey = localStorage.getItem('googleApiKey');
      const storedOpenRouterKey = localStorage.getItem('openRouterApiKey');
      if (storedGoogleKey) setGoogleApiKey(storedGoogleKey);
      if (storedOpenRouterKey) setOpenRouterApiKey(storedOpenRouterKey);
    } catch (e) {
      console.error("Could not access local storage:", e);
    }
  }, []);

  const handleSaveKeys = (newGoogleKey: string, newOpenRouterKey: string) => {
    setGoogleApiKey(newGoogleKey);
    setOpenRouterApiKey(newOpenRouterKey);
    try {
      localStorage.setItem('googleApiKey', newGoogleKey);
      localStorage.setItem('openRouterApiKey', newOpenRouterKey);
    } catch (e) {
      console.error("Could not access local storage:", e);
      setError("Could not save API keys to local storage. They will be lost on refresh.")
    }
    setIsSettingsOpen(false);
  };

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const base64Data = base64String.split(',')[1];
      setOriginalImage({
        base64: base64Data,
        mimeType: file.type,
        name: file.name,
      });
      setEditedImage(null);
      setDescription(null);
      setError(null);
    };
    reader.onerror = () => {
      setError("Failed to read the image file.");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = useCallback(async () => {
    if (!originalImage || !prompt.trim()) {
      setError("Please upload an image and enter a prompt.");
      return;
    }
    if (!googleApiKey) {
      setError("Please set your Google Gemini API Key in the settings.");
      setIsSettingsOpen(true);
      return;
    }

    setIsLoading(true);
    setError(null);
    setEditedImage(null);
    setDescription(null);

    try {
      const result = await editImageWithGemini(originalImage, prompt, googleApiKey);
      setEditedImage(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(`Failed to edit image: ${errorMessage}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [originalImage, prompt, googleApiKey]);

  const handleDescribe = useCallback(async () => {
    if (!originalImage) {
      setError("Please upload an image first.");
      return;
    }
    if (!openRouterApiKey) {
      setError("Please set your OpenRouter API Key in the settings.");
      setIsSettingsOpen(true);
      return;
    }

    setIsDescribing(true);
    setError(null);
    setDescription(null);

    try {
      const result = await describeImageWithOpenRouter(originalImage, openRouterApiKey);
      setDescription(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(`Failed to describe image: ${errorMessage}`);
      console.error(err);
    } finally {
      setIsDescribing(false);
    }
  }, [originalImage, openRouterApiKey]);
  
  const handleClear = () => {
    setOriginalImage(null);
    setEditedImage(null);
    setPrompt('');
    setDescription(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-gray-200 font-sans">
      <Header onSettingsClick={() => setIsSettingsOpen(true)} />
      <ApiKeyModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleSaveKeys}
        currentGoogleApiKey={googleApiKey}
        currentOpenRouterApiKey={openRouterApiKey}
      />
      <main className="container mx-auto p-4 md:p-8">
        {!originalImage ? (
          <ImageUploader onImageUpload={handleImageUpload} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <ControlPanel
                originalImage={originalImage}
                prompt={prompt}
                setPrompt={setPrompt}
                isLoading={isLoading}
                isDescribing={isDescribing}
                description={description}
                onSubmit={handleSubmit}
                onDescribe={handleDescribe}
                onClear={handleClear}
                isGoogleKeySet={!!googleApiKey}
                isOpenRouterKeySet={!!openRouterApiKey}
              />
            </div>
            <div className="lg:col-span-2">
              {error && (
                <div 
                  className="bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg mb-6 text-center cursor-pointer"
                  onClick={() => setError(null)}
                >
                  <div className="flex justify-between items-center">
                    <p className="font-semibold">Error</p>
                    <button className="text-xl font-bold">&times;</button>
                  </div>
                  <p className="mt-2 text-left">{error}</p>
                </div>
              )}
              <ImageDisplay
                originalImage={originalImage}
                editedImage={editedImage}
                isLoading={isLoading}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
