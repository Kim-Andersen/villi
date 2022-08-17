import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';
import React, { useState } from 'react';
import { Product } from '../../shared';
import TextField from '../common/TextField';

type ProductProps = Pick<Product, 'highlights'>;

type Props = {
  product: ProductProps;
  onChange: (changes: ProductProps) => void;
};

export default function EditProductHighlights({ product, onChange }: Props): React.ReactElement {
  const [highlights, setHighlights] = useState<string[]>(product.highlights ?? []);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    highlights[Number(event.target.dataset.index)] = event.target.value;
    setHighlights(highlights);
    onChange({ highlights });
  }

  function addHighlight() {
    const updated = highlights.concat(['']);
    setHighlights(updated);
    onChange({ highlights: updated });
  }

  function removeHighlight(index: number) {
    const updated = Array.from(highlights);
    updated.splice(index, 1);
    setHighlights(updated);
    onChange({ highlights: updated });
  }

  return (
    <React.Fragment>
      <Grid item xs={12}>
        <Typography variant='h6' component='div'>Highlights</Typography>
        <Typography variant='body2' component='div'>5 or more highlights is recommended.</Typography>
      </Grid>
      
      {highlights.map((highlight, index) => (
        <Grid item xs={12} key={index}>
          <TextField
            name="price"
            label="Highlight"
            value={highlight}
            onChange={handleChange}
            inputProps={{ 'data-index': index }}
            InputProps={{
              endAdornment: 
                <InputAdornment position="end">
                  <IconButton onClick={() => removeHighlight(index)}>
                    <DeleteIcon />
                  </IconButton>
                </InputAdornment>
            }}
          />
        </Grid>
      ))}

      <Grid item xs={12}>
        <Button variant='outlined' onClick={addHighlight}>Add highlight</Button>
      </Grid>
    </React.Fragment>
  );
}