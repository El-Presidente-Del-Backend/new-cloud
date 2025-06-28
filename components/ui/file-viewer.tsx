"use client"

import React, { useState } from 'react';

interface FileViewerProps {
  file: any;
  onClose: () => void;
}

const FileViewer = ({ file, onClose }: FileViewerProps) => {
  const [loading, setLoading] = useState(true);

  // Determinar la URL del archivo
  const fileUrl = file.isShared ? file.fileUrl : file.url;
  const fileName = file.isShared ? file.fileName : file.name;
  const fileType = file.type || getFileTypeFromName(fileName);

  // Función para determinar el tipo de archivo por su extensión
  function getFileTypeFromName(name: string) {
    const extension = name.split('.').pop()?.toLowerCase() || '';
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) {
      return 'Imagen';
    } else if (['mp4', 'webm', 'ogg', 'mov'].includes(extension)) {
      return 'Video';
    } else if (['mp3', 'wav', 'ogg', 'aac'].includes(extension)) {
      return 'Audio';
    } else if (['pdf'].includes(extension)) {
      return 'PDF';
    } else if (['doc', 'docx', 'txt', 'rtf'].includes(extension)) {
      return 'Documento';
    } else {
      return 'Otro';
    }
  }

  // Función para renderizar el contenido según el tipo de archivo
  const renderContent = () => {
    const handleLoad = () => setLoading(false);
    const extension = fileName.split('.').pop()?.toLowerCase() || '';

    // Usar Google Docs Viewer para documentos
    if (['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf'].includes(extension)) {
      const googleDocsUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`;
      return (
        <div className="google-docs-container">
          <iframe 
            src={googleDocsUrl}
            title={fileName}
            width="100%"
            height="100%"
            onLoad={handleLoad}
          />
          {loading && <div className="loading-indicator">Cargando documento...</div>}
        </div>
      );
    }
    
    switch (fileType) {
      case 'Imagen':
        return (
          <div className="image-container">
            {loading && <div className="loading-indicator">Cargando imagen...</div>}
            <img 
              src={fileUrl} 
              alt={fileName} 
              onLoad={handleLoad}
              style={{ display: loading ? 'none' : 'block' }}
            />
          </div>
        );
      
      case 'Video':
        return (
          <div className="video-container">
            <video controls autoPlay onLoadedData={handleLoad}>
              <source src={fileUrl} type={`video/${fileName.split('.').pop()?.toLowerCase()}`} />
              Tu navegador no soporta la reproducción de videos.
            </video>
            {loading && <div className="loading-indicator">Cargando video...</div>}
          </div>
        );
      
      case 'Audio':
        return (
          <div className="audio-container">
            <audio controls autoPlay onLoadedData={handleLoad}>
              <source src={fileUrl} type={`audio/${fileName.split('.').pop()?.toLowerCase()}`} />
              Tu navegador no soporta la reproducción de audio.
            </audio>
            {loading && <div className="loading-indicator">Cargando audio...</div>}
          </div>
        );
      
      case 'PDF':
        return (
          <div className="pdf-container">
            <iframe 
              src={`${fileUrl}#toolbar=1&navpanes=1&scrollbar=1`}
              title={fileName}
              width="100%"
              height="100%"
              onLoad={handleLoad}
            />
            {loading && <div className="loading-indicator">Cargando PDF...</div>}
          </div>
        );
      
      default:
        return (
          <div className="unsupported-file">
            <p>Este tipo de archivo no se puede previsualizar directamente.</p>
            <p>Puedes descargarlo para verlo en tu dispositivo.</p>
            <a 
              href={fileUrl} 
              download={fileName}
              className="download-button"
            >
              Descargar {fileName}
            </a>
          </div>
        );
    }
  };

  return (
    <div className="file-viewer-overlay">
      <div className="file-viewer-container">
        <div className="file-viewer-header">
          <h3>{fileName}</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="file-viewer-content">
          {renderContent()}
        </div>
        <div className="file-viewer-footer">
          <a 
            href={fileUrl} 
            download={fileName}
            className="download-button"
          >
            Descargar
          </a>
        </div>
      </div>
    </div>
  );
};

export default FileViewer;