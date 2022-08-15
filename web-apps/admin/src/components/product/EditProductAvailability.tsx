import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import React from 'react';
import useForm from '../../hooks/useForm';
import { Product } from '../../shared';

type ProductProps = Pick<Product, 'channel'>;

type Props = {
  product: ProductProps;
  onChange: (changes: ProductProps) => void;
};

export default function EditProductAvailability({ product, onChange }: Props): React.ReactElement {
  const [form, handleFormElementChange] = useForm<ProductProps>(product, onChange);

  const handleChange = (event: SelectChangeEvent) => {
    handleFormElementChange(event as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <React.Fragment>
      <Grid item xs={12}>
        <Typography variant='h6' component='div'>Availability</Typography>
      </Grid>
      <Grid item xs={12}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Age</InputLabel>
          <Select
            name="channel"
            value={form.channel}
            label="Age"
            onChange={handleChange}
          >
            <MenuItem value='local'>Local</MenuItem>
            <MenuItem value='online' disabled>Online</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      </React.Fragment>
  );
}