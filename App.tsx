import React, { useState, useCallback } from 'react';
import FileUpload from './components/FileUpload';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import MagazineViewer from './components/MagazineViewer';
import { analyzeMagazinePdf } from './services/geminiService';
import { Magazine } from './types';

const App: React.FC = () => {
  const [magazine, setMagazine] = useState<Magazine | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);
    setMagazine(null);
    setPdfFile(null);

    try {
      const result = await analyzeMagazinePdf(file);
      setMagazine(result);
      setPdfFile(file); // Keep the file for the viewer
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const handleReset = () => {
    setMagazine(null);
    setPdfFile(null);
    setError(null);
    setIsLoading(false);
  }

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }
    if (error) {
      return <ErrorMessage message={error} onRetry={handleReset} />;
    }
    if (magazine && pdfFile) {
      return <MagazineViewer magazine={magazine} pdfFile={pdfFile} onReset={handleReset}/>;
    }
    return (
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
          AI Digital Magazine Editor
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-400">
          Upload a magazine PDF and let Gemini 2.5 Pro analyze its layout, extract content, and structure it for digital publishing.
        </p>
        <div className="mt-10">
          <FileUpload onFileUpload={handleFileUpload} />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      {renderContent()}
    </div>
  );
};

export default App;
