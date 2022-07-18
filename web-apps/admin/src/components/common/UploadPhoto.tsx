import LoadingButton from '@mui/lab/LoadingButton';
import React, { useState } from 'react';
import { resizeImageFile } from '../../utils/resizeImageFile';

async function base64ToFile(base64: string, name: string, type: string): Promise<File> {
  const res: Response = await fetch(base64);
  const blob: Blob = await res.blob();
  return new File([blob], name, { type });
}

type Props = {
  onUpload: (file: File) => void;
  disabled?: boolean;
};

export default function UploadPhoto({ onUpload, disabled }: Props): React.ReactElement {
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [workingImageBase64, setWorkingImageBase64] = useState<string | null>(null);

  async function handleUploadClick() {
    if (workingImageBase64 === null || sourceFile === null) {
      return;
    }
    const file = await base64ToFile(workingImageBase64, sourceFile.name, sourceFile.type);
    onUpload(file);
    setWorkingImageBase64(null);
  }

  async function fileChangedHandler(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files && event.target.files.length === 1 ? event.target.files[0] : null;
    if (file === null) {
      return;
    }

    setSourceFile(file);

    try {
      const base64 = await resizeImageFile(file, { compressFormat: 'JPEG', maxWidth: 800, maxHeight: 800, rotation: 0, quality: 100 });
      setWorkingImageBase64(base64);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div>
      <input type="file" onChange={fileChangedHandler} />
      {workingImageBase64 && <img src={workingImageBase64} alt="" />}
      <LoadingButton onClick={handleUploadClick} disabled={workingImageBase64 === null} loading={disabled}>Upload</LoadingButton>
    </div>
  );
}