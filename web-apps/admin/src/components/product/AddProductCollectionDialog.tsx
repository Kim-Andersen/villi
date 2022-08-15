import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import React from 'react';
import useForm from '../../hooks/useForm';
import { ProductCollectionInput } from '../../shared';

type Props = {
  onClose: (data?: Pick<ProductCollectionInput, 'name' | 'description'>) => void;
};

export default function AddProductCollectionDialog({ onClose }: Props): React.ReactElement {
  const [form, handleFormElementChange] = useForm<Pick<ProductCollectionInput, 'name' | 'description'>>({ name: '', description: '' });
  
  const handleSaveClick = async () => {
    onClose(form);
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open onClose={handleClose} fullWidth disableRestoreFocus>
      <DialogTitle>Add Product Collections</DialogTitle>
      <DialogContent>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <TextField
              name="name"
              autoFocus
              required
              value={form.name}
              onChange={handleFormElementChange}
              variant="filled"
              fullWidth
              size='small'
              label='Name'
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
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" disabled={form.name.length === 0} onClick={handleSaveClick}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}