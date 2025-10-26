import React, { useEffect, useRef, useState } from 'react';
import Modal from '@/components/common/Modal';
import Button from '@/components/common/Button';

type Props = {
  open: boolean;
  onClose: () => void;
  onCapture: (file: File) => void;
};

export default function CameraCaptureModal({ open, onClose, onCapture }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    if (!open) return;
    let mounted = true;
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } }).then(s => {
      if (!mounted) return;
      setStream(s);
      if (videoRef.current) {
        videoRef.current.srcObject = s;
        videoRef.current.play();
      }
    }).catch(err => console.error('Camera error', err));
    return () => {
      mounted = false;
      if (stream) stream.getTracks().forEach(t => t.stop());
      setStream(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const capture = async () => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(b => resolve(b), 'image/jpeg', 0.9));
    if (!blob) return;
    const file = new File([blob], `camera-${Date.now()}.jpg`, { type: 'image/jpeg' });
    onCapture(file);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Capture from camera">
      <div className="space-y-4">
        <video ref={videoRef} className="w-full rounded-lg bg-black" playsInline muted />
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={capture}>Capture</Button>
        </div>
      </div>
    </Modal>
  );
}