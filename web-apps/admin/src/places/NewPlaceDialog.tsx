import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import React, { useState } from 'react';

type NewPlaceDialogProps = {
  open: boolean;
  onClose: (name?: string) => void;
};

export default function NewPlaceDialog(props: NewPlaceDialogProps) {
  const [name, setName] = useState<string>('');

  const handleClose = () => {
    props.onClose(name);
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => setName(event.target.value);

  return (
    <Dialog open={props.open} onClose={handleClose} fullWidth disableRestoreFocus>
      <DialogTitle>Create a new Place</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Name of the place"
          type="text"
          fullWidth
          variant="filled"
          value={name}
          onChange={onChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" disabled={name.length === 0} onClick={handleClose}>Create</Button>
      </DialogActions>
    </Dialog>
  );
}