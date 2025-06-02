import React, { useState, useRef, useEffect } from 'react';
import './faceCapture.css';

interface FaceCaptureProps {
  onCapture: (file: File) => void;
  onError?: (error: Error) => void;
}

const FaceCapture: React.FC<FaceCaptureProps> = ({ onCapture, onError }) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 640, 
          height: 480,
          facingMode: 'user' // Front camera
        },
        audio: false 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCapturing(true);
        setImagePreview(null); // Clear any previous preview
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      if (onError) onError(new Error("Could not access camera. Please ensure you've granted camera permissions."));
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCapturing(false);
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Draw current video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to Blob (image file)
        canvas.toBlob((blob) => {
          if (blob) {
            // Create a File object from the Blob
            const file = new File([blob], 'face-capture.jpg', { type: 'image/jpeg' });
            
            // Notify parent component
            onCapture(file);
            
            // Create preview URL
            setImagePreview(URL.createObjectURL(blob));
            
            // Stop camera after capture
            stopCamera();
          }
        }, 'image/jpeg', 0.95); // 0.95 is the quality (0-1)
      }
    }
  };

  // Clean up camera on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleRetake = () => {
    setImagePreview(null);
    startCamera();
  };

  return (
    <div className="face-capture">
      {!isCapturing && !imagePreview ? (
        <button 
          className="btn btn-secondary mb-2" 
          type="button" 
          onClick={startCamera}
        >
          Start Camera
        </button>
      ) : null}
      
      {isCapturing ? (
        <div className="camera-container">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="camera-feed"
          />
          <canvas 
            ref={canvasRef} 
            style={{ display: 'none' }}
          />
          
          <div className="camera-controls mt-2">
            <button 
              className="btn btn-primary me-2" 
              type="button" 
              onClick={captureImage}
            >
              Capture Photo
            </button>
            <button 
              className="btn btn-danger" 
              type="button" 
              onClick={stopCamera}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}
      
      {imagePreview && !isCapturing && (
        <div className="image-preview-container mt-2">
          <img src={imagePreview} alt="Captured Preview" className="image-preview" />
          <button 
            className="btn btn-sm btn-outline-danger mt-2" 
            type="button"
            onClick={handleRetake}
          >
            Retake Photo
          </button>
        </div>
      )}
    </div>
  );
};

export default FaceCapture;