import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import React, { useCallback, useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import config from '../../config';
import { photoService } from '../../services';
import { Photo, PhotoId, Vendor, VendorId } from '../../shared';
import photoHelper from '../../shared/photoHelper';
import snackbarService from '../../snackbar/snackbarService';
import PhotoItem from '../common/PhotoItem';

export default function EditVendorPhotos(): React.ReactElement {  
  const vendor = useOutletContext<Vendor>();
  const [photos, setPhotos] = useState<Photo[] | null>(null);

  const fetchPhotos = useCallback(async () => {
    const photos = await photoService.getEntityPhotos('vendor_id', vendor.id as VendorId);
    setPhotos(photos);
  }, [vendor]);
  

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  async function handleDeletePhoto(photoId: PhotoId) {
    if (window.confirm('Sure you want to remove this photo?')) {
      await photoService.deleteEntityPhoto(photoId, 'vendor_id', vendor.id as VendorId);
      // await vendorService.deletePhoto(vendor.id, photoId);
      snackbarService.showSnackbar('Photo was removed.', 'info');
      await fetchPhotos();
    }
  }

  async function onVendorPhotoUpload(photo: Photo) {
    await photoService.addEntityPhoto(photo.id as PhotoId, 'vendor_id', vendor.id as VendorId, { type: 'profile' });
    snackbarService.showSnackbar('Photo added.', 'success');
    fetchPhotos();
  }

  return (
    <React.Fragment>
      <PhotoItem upload={{ sizes: ['sm', 'md'], callback: onVendorPhotoUpload }} />
      
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
