import LoadingButton from '@mui/lab/LoadingButton';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import React, { useState } from 'react';
import { photoService } from '../../services';
import { Photo, PhotoSizes } from '../../shared';
import photoHelper from '../../shared/photoHelper';
import UploadPhoto from './UploadPhoto';

type Props = {
  onClose: (photo?: Photo) => void;
  sizes: PhotoSizes;
};

export default function AddPhotoDialog({ onClose, sizes }: Props): React.ReactElement {
  const [file, setFile] = useState<File | null>(null);
  
  const handleClose = () => {
    onClose();
  };

  async function handleUploadPhoto(file: File): Promise<void> {
    setFile(file);
  }
  
  async function onUploadClick() {
    if (file) {
      const photo = await photoService.uploadPhoto(file, { sizes });
      onClose(photo);
    }
  }

  const maxSize = Math.max(...sizes.map(size => photoHelper.getPhotoSize(size)));

  return (
    <Dialog open onClose={handleClose} disableRestoreFocus fullWidth maxWidth='md'>
      <DialogTitle>Add a photo</DialogTitle>
      <DialogContent>
        <UploadPhoto onUpload={handleUploadPhoto} disabled={photoService.isWorking} maxSize={maxSize} />
      </DialogContent>
      <DialogActions>
        <LoadingButton sx={{ minWidth: 100 }} loading={photoService.isWorking} disabled={file === null} variant='contained' onClick={onUploadClick}>Save</LoadingButton>
      </DialogActions>
    </Dialog>
  );
}