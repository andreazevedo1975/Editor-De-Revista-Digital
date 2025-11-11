import React from 'react';

interface ErrorMessageProps {
  message: string;
  onRetry: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div className="animate-fade-in bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg relative max-w-lg text-center" role="alert">
      <strong className="font-bold">Error! </strong>
      <span className="block sm:inline">{message}</span>
      <div className="mt-4">
        <button
          onClick={onRetry}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-300"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default ErrorMessage;
