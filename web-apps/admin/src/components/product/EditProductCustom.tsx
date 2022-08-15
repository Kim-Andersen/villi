import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import React from 'react';
import useForm from '../../hooks/useForm';
import { Product } from '../../shared';

type ProductProps = Pick<Product, 'offer_id'>;

type Props = {
  product: ProductProps;
  onChange: (changes: ProductProps) => void;
};

export default function EditProductCustom({ product, onChange }: Props): React.ReactElement {
  const [form, handleFormElementChange] = useForm<ProductProps>(product, onChange);

  return (
    <React.Fragment>
      <Grid item xs={12}>
        <Typography variant='h6' component='div'>Custom</Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          name="offer_id"
          required
          label="Offer ID"
          value={form.offer_id}
          onChange={handleFormElementChange}
          variant="filled"
          fullWidth
          inputProps={{ maxLength: 50 }}
          helperText={`Vendor's own product/offer id (SKU etc).`}
        />
      </Grid>
      </React.Fragment>
  );
}