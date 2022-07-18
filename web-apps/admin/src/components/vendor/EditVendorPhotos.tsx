import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import React, { useCallback, useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import config from '../../config';
import { photoService } from '../../services';
import { Photo, PhotoId, Vendor } from '../../shared';
import photoHelper from '../../shared/photoHelper';
import snackbarService from '../../snackbar/snackbarService';
import UploadPhoto from '../common/UploadPhoto';

export default function EditVendorPhotos(): React.ReactElement {  
  const vendor = useOutletContext<Vendor>();
  const [photos, setPhotos] = useState<Photo[] | null>(null);

  const fetchPhotos = useCallback(async () => {
    const photos = await photoService.getEntityPhotos('vendor', vendor.id);
    setPhotos(photos);
  }, [vendor]);
  

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  async function uploadPhoto(file: File): Promise<void> {
    try {
      const photo = await photoService.uploadPhoto(file);
      await photoService.addEntityPhotos('vendor', vendor.id, photo.id as PhotoId);
      snackbarService.showSnackbar('Photo added.', 'success');
      fetchPhotos();
    } catch (error) {
      console.error(`Failed to upload photo`, error, file);
      snackbarService.showSnackbar('Failed to upload photo.', 'error');
    }
  }

  async function handleDeletePhoto(photoId: PhotoId) {
    if (window.confirm('Sure you want to remove this photo?')) {
      await photoService.deleteEntityPhoto('vendor', vendor.id, photoId);
      snackbarService.showSnackbar('Photo was removed.', 'info');
      await fetchPhotos();
    }
  }

  return (
    <React.Fragment>
      <hr />
      <UploadPhoto onUpload={uploadPhoto} disabled={false/*placesService.isWorking*/} />
      <hr />
      
      {photos && <ImageList variant='quilted' sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
        {photos.map(({ id, key, bucket, sizes }) => {
          const url = photoHelper.getPhotoUrl(config.environment, { key, bucket, size: sizes.find(s => s === 'sm') || sizes[0] });
          return (
            <ImageListItem key={id}>
              <img src={url} loading="lazy" alt={key} />
              <ImageListItemBar
                title={`#${id}`}
                actionIcon={
                  <IconButton aria-label="delete" sx={{ color: 'white' }} onClick={() => handleDeletePhoto(id as PhotoId)}>
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
