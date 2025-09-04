
import React from 'react';
import { ImageFile, EditedImage } from '../types';
import Spinner from './Spinner';

interface ImageDisplayProps {
  originalImage: ImageFile;
  editedImage: EditedImage | null;
  isLoading: boolean;
}

const ImageCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="flex flex-col">
        <h2 className="text-center text-lg font-semibold mb-4 text-slate-300">{title}</h2>
        <div className="aspect-square w-full bg-slate-800/50 rounded-lg flex items-center justify-center overflow-hidden ring-1 ring-slate-700">
            {children}
        </div>
    </div>
);

const Placeholder: React.FC<{ text: string }> = ({ text }) => (
    <div className="text-slate-500 text-center p-4">{text}</div>
);

export default function ImageDisplay({ originalImage, editedImage, isLoading }: ImageDisplayProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <ImageCard title="Original">
        <img
          src={`data:${originalImage.mimeType};base64,${originalImage.base64}`}
          alt="Original"
          className="w-full h-full object-contain"
        />
      </ImageCard>
      
      <ImageCard title="Edited">
        {isLoading && (
            <div className="flex flex-col items-center justify-center text-slate-400">
                <Spinner />
                <p className="mt-4 text-sm">AI is working its magic...</p>
            </div>
        )}
        {!isLoading && !editedImage && (
            <Placeholder text="Your edited image will appear here." />
        )}
        {!isLoading && editedImage && (
            <div className="w-full h-full relative group">
                <img
                  src={`data:${editedImage.mimeType};base64,${editedImage.base64}`}
                  alt="Edited"
                  className="w-full h-full object-contain"
                />
                {editedImage.text && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-4 text-xs text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <p className="font-semibold mb-1">AI Note:</p>
                        <p>{editedImage.text}</p>
                    </div>
                )}
            </div>
        )}
      </ImageCard>
    </div>
  );
}
