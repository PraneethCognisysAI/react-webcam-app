import { useRef, useState, useEffect } from 'react';

export default function App() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>('');

  const startCamera = async (): Promise<void> => {
    try {
      setError('');
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
        },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStream(mediaStream);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(`Camera error: ${err.message}`);
      } else {
        setError('An unknown error occurred while accessing the camera.');
      }
    }
  };

  const stopCamera = (): void => {
    if (stream) {
      stream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
      setStream(null);
    }
  };

  // Clean up media tracks when component unmounts
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
      }
    };
  }, [stream]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.25rem',
        padding: '2rem',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <h2>React Webcam Viewer</h2>

      {error && (
        <p style={{ color: '#ef4444', backgroundColor: '#fee2e2', padding: '0.75rem 1rem', borderRadius: '6px' }}>
          {error}
        </p>
      )}

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{
          width: '100%',
          maxWidth: '640px',
          aspectRatio: '16/9',
          borderRadius: '12px',
          backgroundColor: '#111827',
          objectFit: 'cover',
        }}
      />

      <div style={{ display: 'flex', gap: '1rem' }}>
        {!stream ? (
          <button
            onClick={startCamera}
            style={{
              padding: '0.6rem 1.4rem',
              fontSize: '1rem',
              fontWeight: 500,
              cursor: 'pointer',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#2563eb',
              color: '#ffffff',
            }}
          >
            Start Camera
          </button>
        ) : (
          <button
            onClick={stopCamera}
            style={{
              padding: '0.6rem 1.4rem',
              fontSize: '1rem',
              fontWeight: 500,
              cursor: 'pointer',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#dc2626',
              color: '#ffffff',
            }}
          >
            Stop Camera
          </button>
        )}
      </div>
    </div>
  );
}