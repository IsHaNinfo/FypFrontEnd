import React, { useState, useRef, useEffect } from 'react';
import './faceCapture.css';

interface FaceCaptureProps {
  onCapture: (file: File) => void;
  onError?: (error: Error) => void;
  onCameraStart?: () => void;
  onCameraStop?: () => void;
}

const FaceCapture: React.FC<FaceCaptureProps> = ({ 
  onCapture, 
  onError, 
  onCameraStart, 
  onCameraStop 
}) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [cameraAvailable, setCameraAvailable] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Check camera availability
  useEffect(() => {
    const checkCameraAvailability = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const hasCamera = devices.some(device => device.kind === 'videoinput');
        setCameraAvailable(hasCamera);
      } catch (err) {
        console.error("Error checking camera availability:", err);
        setCameraAvailable(false);
      }
    };

    checkCameraAvailability();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user' // Front camera
        },
        audio: false 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCapturing(true);
        setImagePreview(null);
        if (onCameraStart) onCameraStart();
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setCameraAvailable(false);
      if (onError) onError(
        new Error("Could not access camera. Please ensure you've granted camera permissions.")
      );
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      streamRef.current = null;
    }
    setIsCapturing(false);
    if (onCameraStop) onCameraStop();
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
            const file = new File([blob], 'face-capture.jpg', { 
              type: 'image/jpeg',
              lastModified: Date.now()
            });
            
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
        <div className="camera-init-container">
          <button 
            className="btn btn-primary mb-2" 
            type="button" 
            onClick={startCamera}
            disabled={!cameraAvailable}
          >
            {cameraAvailable ? 'Start Camera' : 'Camera Not Available'}
          </button>
          {!cameraAvailable && (
            <p className="text-muted small">
              Please ensure your camera is connected and permissions are granted.
            </p>
          )}
        </div>
      ) : null}
      
      {isCapturing && (
        <div className="camera-interface">
          <div className="camera-container">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="camera-feed"
              onCanPlay={() => console.log("Camera feed ready")}
            />
            <canvas 
              ref={canvasRef} 
              style={{ display: 'none' }}
            />
          </div>
          
          <div className="camera-controls mt-3">
            <button 
              className="btn btn-success me-2" 
              type="button" 
              onClick={captureImage}
            >
              <i className="bi bi-camera-fill me-2"></i>
              Capture Photo
            </button>
            <button 
              className="btn btn-outline-danger" 
              type="button" 
              onClick={stopCamera}
            >
              <i className="bi bi-x-circle-fill me-2"></i>
              Cancel
            </button>
          </div>
        </div>
      )}
      
      {imagePreview && !isCapturing && (
        <div className="preview-interface">
          <div className="image-preview-container">
            <h5>Captured Photo</h5>
            <img 
              src={imagePreview} 
              alt="Captured Preview" 
              className="image-preview img-thumbnail"
            />
          </div>
          <div className="preview-controls mt-3">
            <button 
              className="btn btn-primary me-2" 
              type="button"
              onClick={handleRetake}
            >
              <i className="bi bi-arrow-repeat me-2"></i>
              Retake Photo
            </button>
            <span className="text-success">
              <i className="bi bi-check-circle-fill me-2"></i>
              Photo captured successfully
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FaceCapture;