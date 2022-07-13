import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import React from 'react';
import useForm from '../../hooks/useForm';
import { VendorInput } from '../../shared';


type Props = {
  open: boolean;
  onClose: (input?: VendorInput) => void;
};

export default function NewVendorDialog(props: Props): React.ReactElement {
  const [form, handleFormElementChange, reset] = useForm<VendorInput>({ name: '' });

  const handleClose = () => {
    props.onClose(form);
  };

  const handleCancel = () => {
    props.onClose();
    reset();
  };

  return (
    <Dialog open={props.open} onClose={handleClose} fullWidth disableRestoreFocus>
      <DialogTitle>Create a new Vendor</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="name"
          label="Name of the vendor"
          type="text"
          fullWidth
          variant="filled"
          value={form.name}
          onChange={handleFormElementChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button variant="contained" disabled={form.name.length === 0} onClick={handleClose}>Create</Button>
      </DialogActions>
    </Dialog>
  );
}