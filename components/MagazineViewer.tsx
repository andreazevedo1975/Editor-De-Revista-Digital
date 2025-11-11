import React, { useState, useEffect } from 'react';
import { Magazine } from '../types';
import PageComponent from './PageComponent';

// SVG icons for controls
const ZoomInIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" /></svg>;
const ZoomOutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" /></svg>;
const FitToWidthIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M12 5a1 1 0 011 1v8a1 1 0 11-2 0V6a1 1 0 011-1zM5 5a1 1 0 011 1v8a1 1 0 11-2 0V6a1 1 0 011-1z" /><path d="M2 10a.5.5 0 01.5-.5h15a.5.5 0 010 1H2.5A.5.5 0 012 10z" /></svg>;
const ChevronLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>;
const ChevronRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>;

interface MagazineViewerProps {
  magazine: Magazine;
  pdfFile: File;
  onReset: () => void;
}

const MagazineViewer: React.FC<MagazineViewerProps> = ({ magazine, pdfFile, onReset }) => {
  const totalPages = magazine.paginas?.length || 0;
  const [currentPage, setCurrentPage] = useState(1);
  const [baseUrl, setBaseUrl] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const [fitToWidth, setFitToWidth] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  // Effect to create and revoke the object URL only when the file changes.
  useEffect(() => {
    if (!pdfFile) return;

    const url = URL.createObjectURL(pdfFile);
    setBaseUrl(url);

    // Cleanup function: revoke the URL when the component unmounts or file changes.
    return () => {
      URL.revokeObjectURL(url);
      setBaseUrl(null);
    };
  }, [pdfFile]);

  // Effect to construct the full iframe URL with parameters whenever the view changes.
  useEffect(() => {
    if (!baseUrl) {
      setPdfUrl(null);
      return;
    }

    let params = `#page=${currentPage}`;
    if (fitToWidth) {
      params += '&view=fitH';
    } else {
      params += `&zoom=${zoom}`;
    }
    setPdfUrl(`${baseUrl}${params}`);
  }, [baseUrl, currentPage, zoom, fitToWidth]);


  const handleZoomIn = () => { setFitToWidth(false); setZoom(z => Math.min(z + 25, 400)); };
  const handleZoomOut = () => { setFitToWidth(false); setZoom(z => Math.max(z - 25, 50)); };
  const handleFitToWidth = () => { setFitToWidth(true); setZoom(100); };
  const handlePreviousPage = () => setCurrentPage(p => Math.max(p - 1, 1));
  const handleNextPage = () => setCurrentPage(p => Math.min(p + 1, totalPages));

  const handlePageJump = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const pageNum = parseInt(e.currentTarget.value, 10);
      if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
        setCurrentPage(pageNum);
      } else {
        e.currentTarget.value = currentPage.toString();
      }
    }
  };

  const onTouchStart = (e: React.TouchEvent) => { setTouchEnd(null); setTouchStart(e.targetTouches[0].clientX); };
  const onTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe && currentPage < totalPages) handleNextPage();
    if (isRightSwipe && currentPage > 1) handlePreviousPage();
    setTouchStart(null);
    setTouchEnd(null);
  };

  const currentPageData = (magazine.paginas || [])[currentPage - 1];

  return (
    <div className="w-full max-w-screen-2xl mx-auto animate-fade-in">
      <header className="sticky top-0 z-10 bg-gray-900/80 backdrop-blur-md p-4 mb-6 rounded-b-xl border-b border-gray-700">
        <div className="flex justify-between items-center max-w-screen-xl mx-auto">
          <div>
            <h1 className="text-2xl font-bold text-white">{magazine.meta_revista.titulo}</h1>
            <p className="text-md text-gray-400">{magazine.meta_revista.edicao} - {magazine.meta_revista.idioma}</p>
          </div>
          <button onClick={onReset} className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-300">
            Analyze Another Magazine
          </button>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-4">
        <div className="lg:sticky top-28 h-96 lg:h-[calc(100vh-8rem)] flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold text-white">Original PDF</h2>
            <div className="flex items-center space-x-2 bg-gray-800 p-1 rounded-lg border border-gray-700">
              <button onClick={handleZoomOut} className="p-1.5 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors" aria-label="Zoom out" title="Zoom out"><ZoomOutIcon/></button>
              <span className="text-sm font-mono text-cyan-400 w-20 text-center">{fitToWidth ? 'Fit Width' : `${zoom}%`}</span>
              <button onClick={handleZoomIn} className="p-1.5 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors" aria-label="Zoom in" title="Zoom in"><ZoomInIcon /></button>
              <div className="border-l border-gray-600 h-5 mx-1"></div>
              <button onClick={handleFitToWidth} disabled={fitToWidth} className="p-1.5 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Fit to width" title="Fit to width"><FitToWidthIcon /></button>
            </div>
          </div>
          {pdfUrl ? (
            <iframe key={pdfUrl} src={pdfUrl} className="w-full flex-grow rounded-lg border border-gray-700 bg-white" title="Magazine PDF" />
          ) : (
            <div className="w-full flex-grow rounded-lg border border-gray-700 flex items-center justify-center bg-gray-800">
              <p className="text-gray-400">Loading PDF...</p>
            </div>
          )}
        </div>
        
        <div onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
          <h2 className="text-xl font-semibold text-white mb-4">Extracted Content</h2>
          {currentPageData ? (
            <PageComponent key={currentPageData.numero_pagina} page={currentPageData} />
          ) : (
            <div className="text-center text-gray-400 p-8 bg-gray-800 rounded-lg">
                <p>No content extracted for this page.</p>
            </div>
          )}
        </div>
      </main>

      <footer className="sticky bottom-4 z-20 mt-4 flex justify-center">
        <div className="flex items-center justify-between gap-4 bg-gray-800/80 backdrop-blur-md text-white p-2 border border-gray-700 rounded-xl shadow-2xl">
          <button onClick={handlePreviousPage} disabled={currentPage === 1} className="p-2 rounded-md hover:bg-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            <ChevronLeftIcon />
          </button>
          <div className="text-center">
            <p className="text-lg font-bold tracking-wider">{currentPage} / {totalPages}</p>
            <input
              type="number"
              defaultValue={currentPage}
              onKeyDown={handlePageJump}
              key={currentPage} 
              className="bg-gray-900/50 text-center rounded-md text-xs w-16 p-1 border border-gray-600 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              aria-label="Jump to page"
            />
          </div>
          <button onClick={handleNextPage} disabled={currentPage === totalPages} className="p-2 rounded-md hover:bg-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            <ChevronRightIcon />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default MagazineViewer;