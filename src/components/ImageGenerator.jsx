import { useState, useEffect, useContext } from 'react';
import { generateImage } from '../services/stableHordeService';
import { ThemeContext } from '../App';
import './ImageGenerator.css';

const ImageGenerator = () => {
  const { theme } = useContext(ThemeContext);
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generationStatus, setGenerationStatus] = useState('');
  const [imageFormat, setImageFormat] = useState('webp'); // Default format
  const [animateImage, setAnimateImage] = useState(false);

  // Clean up event listeners on unmount
  useEffect(() => {
    return () => {
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);

  // Trigger animation when image loads
  useEffect(() => {
    if (image) {
      setAnimateImage(true);
    }
  }, [image]);

  const handleRejection = (event) => {
    console.error('Unhandled rejection:', event.reason);
    setError('Network error: ' + (event.reason?.message || 'Failed to connect to the server'));
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setImage(null);
      setAnimateImage(false);
      setGenerationStatus('Submitting request to Stable Horde...');
      
      window.addEventListener('unhandledrejection', handleRejection);
      
      setTimeout(() => {
        setGenerationStatus('Waiting for available workers...');
      }, 3000);
      
      setTimeout(() => {
        setGenerationStatus('Generating your image (this may take a minute)...');
      }, 8000);
      
      const imageData = await generateImage(prompt);
      console.log('Image data received:', typeof imageData, imageData?.substring?.(0, 50));
      
      // Try to determine the image format
      if (imageData && typeof imageData === 'string') {
        if (imageData.startsWith('data:image/jpeg')) {
          setImageFormat('jpeg');
        } else if (imageData.startsWith('data:image/png')) {
          setImageFormat('png');
        } else if (imageData.startsWith('data:image/webp')) {
          setImageFormat('webp');
        } else if (imageData.startsWith('http')) {
          // It's a URL, no need to set format
          setImageFormat('url');
        }
      }
      
      setImage(imageData);
      
    } catch (err) {
      console.error('Error details:', err);
      setError(`Failed to generate image: ${err.message || 'Unknown error'}`);
      if (err.response) {
        console.error('Response data:', err.response.data);
        console.error('Response status:', err.response.status);
        setError(`API Error (${err.response.status}): ${err.response.data?.message || 'Server error'}`);
      }
    } finally {
      setLoading(false);
      setGenerationStatus('');
      window.removeEventListener('unhandledrejection', handleRejection);
    }
  };

  const renderImage = () => {
    if (!image) return null;
    
    try {
      if (imageFormat === 'url' || image.startsWith('http')) {
        return (
          <img 
            src={image} 
            alt={prompt} 
            className={`generated-image ${animateImage ? 'fade-in' : ''}`} 
          />
        );
      } else if (image.startsWith('data:')) {
        return (
          <img 
            src={image} 
            alt={prompt} 
            className={`generated-image ${animateImage ? 'fade-in' : ''}`} 
          />
        );
      } else {
        // Assume it's base64 data without the data URI prefix
        return (
          <img 
            src={`data:image/${imageFormat};base64,${image}`} 
            alt={prompt} 
            className={`generated-image ${animateImage ? 'fade-in' : ''}`}
            onError={(e) => {
              console.error('Image failed to load with format:', imageFormat);
              // Try other formats if the current one fails
              if (imageFormat === 'webp') {
                setImageFormat('png');
              } else if (imageFormat === 'png') {
                setImageFormat('jpeg');
              } else {
                e.target.src = 'https://via.placeholder.com/512x512?text=Image+Failed+to+Load';
              }
            }}
          />
        );
      }
    } catch (err) {
      console.error('Error rendering image:', err);
      return <div className="error">Error displaying image: {err.message}</div>;
    }
  };

  // Simple function to download the image
  const handleDownload = () => {
    // Find the image element
    const imgElement = document.querySelector('.generated-image');
    
    if (!imgElement) {
      console.error('Image element not found');
      return;
    }
    
    // Create a link that opens the image in a new tab
    window.open(imgElement.src, '_blank');
  };

  return (
    <div className={`image-generator ${theme}`}>
      <div className="generator-content">
        <div className="description">
          <p>
            Create stunning AI-generated images by describing what you want to see.
            <br />
            <span className="description-detail">Powered by Stable Horde AI</span>
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="prompt-form">
          <div className="input-container">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the image you want to create..."
              disabled={loading}
              className="prompt-input"
            />
            <button 
              type="submit" 
              disabled={loading}
              className={`generate-button ${loading ? 'loading' : ''}`}
            >
              {loading ? (
                <span className="button-text">Generating</span>
              ) : (
                <span className="button-text">Generate</span>
              )}
            </button>
          </div>
        </form>
        
        {error && (
          <div className="error slide-up">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>{error}</span>
          </div>
        )}
        
        <div className="result-container">
          {loading && (
            <div className="loading-container fade-in">
              <div className="loading-spinner">
                <div className="spinner-ring"></div>
                <div className="spinner-ring"></div>
                <div className="spinner-ring"></div>
              </div>
              <div className="loading-status">
                <p>{generationStatus || 'Processing your request...'}</p>
                <div className="loading-dots">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
              </div>
            </div>
          )}
          
          {image && (
            <div className={`image-result ${animateImage ? 'slide-up' : ''}`}>
              <div className="image-card">
                {renderImage()}
                <div className="image-actions">
                  <button 
                    onClick={handleDownload}
                    className="download-button"
                    aria-label="Download image"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    <span>Download</span>
                  </button>
                </div>
              </div>
              <div className="prompt-display">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <p className="prompt-text">"{prompt}"</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageGenerator;