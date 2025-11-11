import React from 'react';
import { Element } from '../types';

interface ElementComponentProps {
  element: Element;
}

const ElementComponent: React.FC<ElementComponentProps> = ({ element }) => {
  const getElementStyle = () => {
    switch (element.tipo) {
      case 'Titulo Principal':
        return 'text-2xl md:text-3xl font-bold text-cyan-300 leading-tight';
      case 'Subtítulo':
        return 'text-lg md:text-xl font-semibold text-cyan-400 mt-2';
      case 'Parágrafo de Texto':
        return 'text-base text-gray-300 leading-relaxed';
      case 'Imagem':
        return 'italic text-gray-400';
      case 'Anúncio':
        return 'italic text-yellow-400';
      default:
        return 'text-base text-gray-300';
    }
  };

  const renderPaywall = () => (
    <div className="relative mt-4">
      <div className="blur-sm">
        <p className="text-gray-500 leading-relaxed">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        <p className="text-gray-500 leading-relaxed mt-2">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.</p>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-gray-800 to-transparent"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center bg-black/60 backdrop-blur-sm p-4 rounded-lg">
          <svg className="w-8 h-8 mx-auto text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2V7a5 5 0 00-5-5zm0 2a3 3 0 013 3v2H7V7a3 3 0 013-3z"></path></svg>
          <p className="font-bold text-yellow-300 mt-2">Premium Content</p>
          <p className="text-sm text-gray-200">Subscribe to read the full article.</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-3 bg-gray-800/50 rounded-md border border-gray-700/50 my-2 animate-fade-in">
      <div className="flex justify-between items-start text-xs text-gray-500 mb-2">
        <span className="font-mono bg-gray-700 px-2 py-0.5 rounded">{element.tipo}</span>
        <span className="font-mono text-right">{element.coordenadas_aproximadas}</span>
      </div>
      <div className={getElementStyle()}>
        {element.teaser_gratuito ? (
          <>
            <p className="whitespace-pre-wrap">{element.teaser_gratuito}</p>
            {renderPaywall()}
          </>
        ) : (
          <p className="whitespace-pre-wrap">{element.texto}</p>
        )}
      </div>
    </div>
  );
};

export default ElementComponent;
