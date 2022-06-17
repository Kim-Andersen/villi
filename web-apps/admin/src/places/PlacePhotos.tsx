import DeleteIcon from '@mui/icons-material/Delete';

import IconButton from '@mui/material/IconButton';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import React, { useEffect, useState } from 'react';
import photoHelper from '../shared/photoHelper';
import { Photo, PhotoId, PlaceId } from '../shared/types';
import snackbarService from '../snackbar/snackbarService';
import placesService from './placesService';
import UploadPhoto from './UploadPhoto';


type Props = {
  placeId: PlaceId;
};

export default function PlacePhotos({ placeId }: Props): React.ReactElement {  
  const [photos, setPhotos] = useState<Photo[] | null>(null);
  

  async function fetchPhotos() {
    return placesService.getPhotos(placeId).then(photos => setPhotos(photos));
  }

  useEffect(() => {
    fetchPhotos();
  }, [placeId]);

  async function uploadPhoto(file: File): Promise<void> {
    try {
      await placesService.addPhoto(placeId, { file: file, contentType: file.type });
      snackbarService.showSnackbar('Photo added.', 'success');
      fetchPhotos();
    } catch (error) {
      console.error(`Failed to upload photo`, error, file);
      snackbarService.showSnackbar('Failed to upload photo.', 'error');
    }
  }

  async function handleDeletePhoto(photoId: PhotoId) {
    await placesService.deletePhoto(placeId, photoId);
    snackbarService.showSnackbar('Photo was deleted', 'info');
    await fetchPhotos();
  }

  return (
    <React.Fragment>
      <UploadPhoto onUpload={uploadPhoto} disabled={placesService.isWorking} />
      
      {photos && <ImageList variant='quilted' sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
        {photos.map(({ id, key, bucket, sizes }) => {
          const url = photoHelper.getPhotoUrl({ key, bucket, size: sizes.find(s => s === 'sm') || sizes[0] });
          return (
            <ImageListItem key={id}>
              <img src={url} loading="lazy" alt={key} />
              <ImageListItemBar
                title={`#${id}`}
                actionIcon={
                  <IconButton aria-label="delete" sx={{ color: 'white' }} onClick={() => handleDeletePhoto(id)}>
                    <DeleteIcon />
                  </IconButton>
                }
              />
            </ImageListItem>
          );
        })}
      </ImageList>}
    </React.Fragment>
  );
}
