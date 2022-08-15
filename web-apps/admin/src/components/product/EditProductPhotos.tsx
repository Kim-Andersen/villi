import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import React from 'react';
import { ProductId } from '../../shared';
import EntityPhotos from '../common/EntityPhotos';

type Props = {
  productId: ProductId;
};

export default function EditProductPhotos({ productId }: Props): React.ReactElement {
  return (
    <React.Fragment>
      <Grid item xs={12}>
        <Typography variant='h6' component='div'>Photos</Typography>
      </Grid>
      <Grid item xs={12}>
        <EntityPhotos entityType='product' entityId={productId} upload={{ sizes: ['sm', 'md'] }} />
      </Grid>
      </React.Fragment>
  );
}