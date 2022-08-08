import UploadFileIcon from '@mui/icons-material/UploadFile';
import Button from '@mui/material/Button';
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
  maxSize: number;
};

export default function UploadPhoto({ onUpload, disabled, maxSize }: Props): React.ReactElement {
  // const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [workingImageBase64, setWorkingImageBase64] = useState<string | null>(null);

  // async function handleUploadClick() {
  //   if (workingImageBase64 === null || sourceFile === null) {
  //     return;
  //   }
  //   const file = await base64ToFile(workingImageBase64, sourceFile.name, sourceFile.type);
  //   onUpload(file);
  //   setWorkingImageBase64(null);
  // }

  async function fileChangedHandler(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files && event.target.files.length === 1 ? event.target.files[0] : null;
    if (file === null) {
      return;
    }

    // setSourceFile(file);
    try {
      const base64 = await resizeImageFile(file, { compressFormat: 'JPEG', maxWidth: maxSize, maxHeight: maxSize, rotation: 0, quality: 100 });
      const fileResult = await base64ToFile(base64, file.name, file.type);
      setWorkingImageBase64(base64);
      onUpload(fileResult);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <React.Fragment>
      <Button
        component="label"
        variant="outlined"
        startIcon={<UploadFileIcon />}
        sx={{ marginRight: "1rem" }}
      >
        Upload photo
        <input type="file" accept="image/*" hidden onChange={fileChangedHandler} />
      </Button>
      
      {workingImageBase64 && <img src={workingImageBase64} alt="" />}
    </React.Fragment>
  );
}