import Button from '@mui/material/Button';
import ImageListItem from '@mui/material/ImageListItem';
import React, { useState } from 'react';
// import ImageListItemBar from '@mui/material/ImageListItemBar';
// import DeleteIcon from '@mui/icons-material/Delete';
// import IconButton from '@mui/material/IconButton';
import config from '../../config';
import { Photo, PhotoSizes } from '../../shared';
import photoHelper from '../../shared/photoHelper';
import AddPhotoDialog from './AddPhotoDialog';

type Props = {
  photo?: Photo;
  upload?: { 
    sizes: PhotoSizes;
    callback: (photo: Photo) => void;
  };
};

export default function PhotoItem({ photo, upload }: Props): React.ReactElement {
  const [showUploadDialog, setShowUploadDialog] = useState<boolean>(false);
  const url = photo ? photoHelper.getPhotoUrl(config.environment, { key: photo.key, bucket: photo.bucket, size: photo.sizes.find(s => s === 'sm') || photo.sizes[0] }) : null;

  function onCloseAddPhotoDialog(photo?: Photo) {
    if (photo && upload) {
      upload.callback(photo);
    }
    setShowUploadDialog(false);
  }

  if (photo && url) {
    return (
      <ImageListItem>
        <img src={url} loading="lazy" alt={url} />
      </ImageListItem>
    );
  } else if (upload) {
    return (
    <ImageListItem>
      <Button variant="outlined" onClick={() => setShowUploadDialog(true)}>Add photo</Button>
      {showUploadDialog && <AddPhotoDialog onClose={onCloseAddPhotoDialog} sizes={upload.sizes} />}
    </ImageListItem>
    );
  } else {
    return <ImageListItem></ImageListItem>
  }
}