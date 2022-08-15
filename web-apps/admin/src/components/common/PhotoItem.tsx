import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import React, { useState } from 'react';
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
  onDelete?: (photo: Photo) => void;
};

export default function PhotoItem({ photo, upload, onDelete }: Props): React.ReactElement {
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
        {onDelete && 
          <ImageListItemBar
            actionIcon={
            <IconButton onClick={() => onDelete(photo)} sx={{ color: 'rgba(255, 255, 255, 0.54)' }}>
              <DeleteIcon></DeleteIcon>
            </IconButton>
          }
          / >
        }
      </ImageListItem>
    );
  } else if (upload) {
    return (
      <React.Fragment>
        {showUploadDialog && <AddPhotoDialog onClose={onCloseAddPhotoDialog} sizes={upload.sizes} />}
        <ImageListItem>
          <Button variant="outlined" onClick={() => setShowUploadDialog(true)}>Add photo</Button>
        </ImageListItem>
      </React.Fragment>
    );
  } else {
    return <ImageListItem></ImageListItem>
  }
}