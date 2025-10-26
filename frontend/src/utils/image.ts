import imageCompression from 'browser-image-compression';

export async function getImageDimensions(file: Blob): Promise<{ width: number; height: number }>
{
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    return { width: img.naturalWidth, height: img.naturalHeight };
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function isSupportedImageType(file: File) {
  return /^image\/(png|jpe?g|webp|heic|heif)$/i.test(file.type);
}

export function validateFileSize(file: File, maxMB = 10) {
  const ok = file.size <= maxMB * 1024 * 1024;
  return ok;
}

export async function compressImage(file: File, maxWidth = 2048, quality = 0.8) {
  const options = {
    maxSizeMB: undefined as number | undefined,
    maxWidthOrHeight: maxWidth,
    initialQuality: quality,
    useWebWorker: true,
  };
  return imageCompression(file, options);
}

export async function readAsArrayBuffer(file: Blob): Promise<ArrayBuffer> {
  return await file.arrayBuffer();
}