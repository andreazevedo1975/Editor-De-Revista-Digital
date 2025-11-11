// FIX: Import React to resolve the "Cannot find namespace 'JSX'" error.
import React from 'react';
import { Page } from '../types';
import ElementComponent from './ElementComponent';

interface PageComponentProps {
  page: Page;
}

const PageComponent: React.FC<PageComponentProps> = ({ page }) => {
  const isPremium = page.status_monetizacao === 'premium_assinatura';

  const columns = ['1', '2', '3'];
  const elementsByColumn: { [key: string]: React.JSX.Element[] } = { '1': [], '2': [], '3': [] };

  let maxColumn = 1;
  // FIX: Ensure page.elementos is an array before calling forEach to prevent runtime errors.
  (page.elementos || []).forEach((el, index) => {
    const colIndex = parseInt(el.coluna, 10);
    if (!isNaN(colIndex) && colIndex > 0 && colIndex <= 3) {
      if(colIndex > maxColumn) maxColumn = colIndex;
      elementsByColumn[el.coluna].push(<ElementComponent key={`${page.numero_pagina}-${index}`} element={el} />);
    } else {
        // Fallback for elements without a valid column number
        elementsByColumn['1'].push(<ElementComponent key={`${page.numero_pagina}-${index}`} element={el} />);
    }
  });

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6 mb-8 animate-fade-in">
      <header className="flex justify-between items-center pb-4 border-b border-gray-700">
        <div>
          <h3 className="text-xl font-bold text-white">Page {page.numero_pagina}</h3>
          <p className="text-sm text-gray-400">{page.tipo_layout}</p>
        </div>
        <span
          className={`px-3 py-1 text-xs font-bold uppercase rounded-full ${isPremium ? 'bg-yellow-500/20 text-yellow-300' : 'bg-green-500/20 text-green-300'}`}
        >
          {(page.status_monetizacao || '').replace('_', ' ')}
        </span>
      </header>
      <div className={`grid grid-cols-1 md:grid-cols-${maxColumn} gap-6 mt-6`}>
        {columns.slice(0, maxColumn).map(col => (
          <div key={col} className="flex flex-col space-y-4">
            {elementsByColumn[col].length > 0 ? elementsByColumn[col] : (
              <div className="p-4 text-center text-gray-600 border-2 border-dashed border-gray-700 rounded-md">
                Column {col}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PageComponent;