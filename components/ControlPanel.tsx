
import React from 'react';
import { ImageFile } from '../types';

interface ControlPanelProps {
  originalImage: ImageFile;
  prompt: string;
  setPrompt: (prompt: string) => void;
  isLoading: boolean;
  isDescribing: boolean;
  description: string | null;
  onSubmit: () => void;
  onDescribe: () => void;
  onClear: () => void;
  isGoogleKeySet: boolean;
  isOpenRouterKeySet: boolean;
}

const ClearIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

const MagicWandIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
    </svg>
);

const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);


export default function ControlPanel({
  originalImage,
  prompt,
  setPrompt,
  isLoading,
  isDescribing,
  description,
  onSubmit,
  onDescribe,
  onClear,
  isGoogleKeySet,
  isOpenRouterKeySet,
}: ControlPanelProps) {
  const isBusy = isLoading || isDescribing;
  const editButtonDisabled = isBusy || !prompt.trim() || !isGoogleKeySet;
  const describeButtonDisabled = isBusy || !isOpenRouterKeySet;


  return (
    <div className="bg-slate-800/50 rounded-lg p-6 space-y-6 sticky top-24">
      <div>
        <h2 className="text-lg font-semibold text-white mb-2">Original Image</h2>
        <div className="aspect-square w-full rounded-lg overflow-hidden bg-slate-900">
            <img
                src={`data:${originalImage.mimeType};base64,${originalImage.base64}`}
                alt="Original"
                className="w-full h-full object-contain"
            />
        </div>
        <button
          onClick={onClear}
          className="mt-4 w-full flex items-center justify-center gap-2 text-sm text-slate-400 hover:text-white bg-slate-700/50 hover:bg-slate-700 px-3 py-2 rounded-md transition-colors"
        >
          <ClearIcon />
          Upload a different image
        </button>
      </div>

      <div>
        <label htmlFor="prompt" className="block text-lg font-semibold text-white mb-2">
          Editing Prompt
        </label>
        <textarea
          id="prompt"
          rows={4}
          className="block w-full rounded-md border-0 bg-slate-700/80 p-3 text-gray-200 shadow-sm ring-1 ring-inset ring-slate-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 transition-all"
          placeholder="e.g., 'Add a birthday hat on the cat'"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isBusy}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onSubmit}
          disabled={editButtonDisabled}
          title={!isGoogleKeySet ? "Please set your Google Gemini API Key in settings" : ""}
          className="w-full flex items-center justify-center gap-2 rounded-md bg-sky-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isLoading ? 'Generating...' : <><MagicWandIcon /> Edit Image</>}
        </button>
         <button
          onClick={onDescribe}
          disabled={describeButtonDisabled}
          title={!isOpenRouterKeySet ? "Please set your OpenRouter API Key in settings" : ""}
          className="w-full flex items-center justify-center gap-2 rounded-md bg-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isDescribing ? 'Analyzing...' : <><EyeIcon /> Describe</>}
        </button>
      </div>

      {description && (
        <div className="space-y-2 pt-2">
          <h3 className="text-md font-semibold text-white">Image Description</h3>
            <div className="p-4 rounded-lg bg-slate-900/70 ring-1 ring-slate-700 text-sm text-slate-300 whitespace-pre-wrap">
              {description}
            </div>
        </div>
      )}
    </div>
  );
}
