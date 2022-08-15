import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import React from 'react';
import useForm from '../../hooks/useForm';
import { Product } from '../../shared';

type ProductProps = Pick<Product, 'title' | 'description'>;

type Props = {
  product: ProductProps;
  onChange: (changes: ProductProps) => void;
};

export default function EditProductInfo({ product, onChange }: Props): React.ReactElement {
  const [form, handleFormElementChange] = useForm<ProductProps>(product, onChange);

  return (
    <React.Fragment>
      <Grid item xs={12}>
        <TextField
          name="title"
          required
          label="Title"
          value={form.title}
          onChange={handleFormElementChange}
          variant="filled"
          fullWidth
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          name="description"
          label="Description"
          value={form.description || ''}
          onChange={handleFormElementChange}
          variant="filled"
          multiline
          minRows={3}
          fullWidth
        />
      </Grid>
      </React.Fragment>
  );
}