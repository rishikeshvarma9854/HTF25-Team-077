import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Button from '@/components/common/Button';

type Props = {
  onFiles: (files: File[]) => void;
};

export default function UploadArea({ onFiles }: Props) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles?.length) onFiles(acceptedFiles);
  }, [onFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.heic', '.heif'] },
    multiple: true,
  });

  return (
    <div {...getRootProps()} className={`rounded-2xl border-2 border-dashed p-12 text-center transition-all cursor-pointer ${isDragActive ? 'border-brand-700 bg-brand-100/50 scale-[1.02]' : 'border-brand-300 hover:border-brand-500 hover:bg-brand-50/30'}`}>
      <input {...getInputProps()} />
      <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-brand-100 flex items-center justify-center">
        <svg className="h-8 w-8 text-brand-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      </div>
      <p className="mb-2 text-lg font-semibold text-brand-900">
        {isDragActive ? 'Drop your images here' : 'Drag & drop your clothing images'}
      </p>
      <p className="mb-6 text-sm text-brand-600">PNG, JPG, WEBP up to 15MB each</p>
      {!isDragActive && <Button type="button" variant="outline">Browse Files</Button>}
    </div>
  );
}