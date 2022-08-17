import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';
import cc from 'currency-codes';
import React from 'react';
import useForm from '../../hooks/useForm';
import { Product } from '../../shared';
import TextField from '../common/TextField';

type ProductProps = Pick<Product, 'price' | 'sale_price'>;

type Props = {
  product: ProductProps;
  currency: number;
  onChange: (changes: ProductProps) => void;
};

export default function EditProductPrice({ product, currency, onChange }: Props): React.ReactElement {
  const [form, handleFormElementChange] = useForm<ProductProps>(product, ({ price, sale_price }) => onChange({ price: Number(price), sale_price: Number(sale_price) }));

  return (
    <React.Fragment>
      <Grid item xs={12}>
        <Typography variant='h6' component='div'>Pricing</Typography>
      </Grid>
      <Grid item xs={6}>
        <TextField
          name="price"
          required
          label="Price"
          value={form.price ?? ''}
          onChange={handleFormElementChange}
          inputProps={{ type: 'number', step: 'any' }}
          InputProps={{
            startAdornment: <InputAdornment position="start">{cc.number(String(currency))?.code}</InputAdornment>
          }}
        />
      </Grid>

      <Grid item xs={6}>
        <TextField
          name="sale_price"
          label="Sale price"
          value={form.sale_price ?? ''}
          onChange={handleFormElementChange}
          inputProps={{ type: 'number', step: 'any' }}
          InputProps={{
            startAdornment: <InputAdornment position="start">{cc.number(String(currency))?.code}</InputAdornment>
          }}
        />
      </Grid>
      </React.Fragment>
  );
}