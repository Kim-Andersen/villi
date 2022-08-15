import ImageList from '@mui/material/ImageList';
import React, { useCallback, useEffect, useState } from 'react';
import { photoService } from '../../services';
import { EntityPhotoDetails, EntityType, Photo, PhotoId, PhotoSizes } from '../../shared';
import PhotoItem from './PhotoItem';

type Props = {
  entityType: EntityType;
  entityId: number;
  upload?: {
    sizes: PhotoSizes;
  }
};

export default function EntityPhotos({ entityType, entityId, upload }: Props): React.ReactElement {
  const [photos, setPhotos] = useState<EntityPhotoDetails[]>([]);

  const fetchPhotos = useCallback(async () => {
    const photos = await photoService.getEntityPhotos(entityType, entityId);
    setPhotos(photos);
  }, [entityType, entityId]);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  async function onUpload({ id }: Photo) {
    const photo = await photoService.addEntityPhoto(id as PhotoId, entityType, entityId);
    setPhotos([...photos, photo]);
  }

  async function handleDeletePhoto(photo: Photo) {
    await photoService.deleteEntityPhoto(entityType, entityId, photo.id as PhotoId);
    photos.splice(photos.indexOf(photo), 1)
    setPhotos(Array.from(photos));
  }

  return (
    <React.Fragment>
      {upload && <PhotoItem upload={{ sizes: upload.sizes, callback: onUpload }} />}
      <ImageList rowHeight={164} cols={3}>
        {photos.map(photo => <PhotoItem key={photo.id} photo={photo} onDelete={handleDeletePhoto} />)}
      </ImageList>
    </React.Fragment>
  );
}