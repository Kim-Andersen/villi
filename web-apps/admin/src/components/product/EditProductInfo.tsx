import Grid from '@mui/material/Grid';
import React from 'react';
import useForm from '../../hooks/useForm';
import { Product } from '../../shared';
import TextField from '../common/TextField';

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
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          name="description"
          label="Description"
          value={form.description || ''}
          onChange={handleFormElementChange}
          multiline
          minRows={3}
        />
      </Grid>
      </React.Fragment>
  );
}