import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import React, { useState } from 'react';
import { GooglePlaceAutocompleteResult } from '../services/GooglePlacesService/types';
import GoogleMaps from './GoogleMaps';

type NewPlaceDialogProps = {
  open: boolean;
  onClose: (name?: string) => void;
};

export default function NewPlaceDialog(props: NewPlaceDialogProps): React.ReactElement {
  const [autoCompleteResult, setAutocompleteResult] = useState<GooglePlaceAutocompleteResult | null>(null);
  const [name, setName] = useState<string>('');

  const handleClose = () => {
    props.onClose(name);
  };

  const onAutocompleteSelect = (result: GooglePlaceAutocompleteResult | null) => setAutocompleteResult(result);

  function onPlaceSelected(place_id: string) {
    console.log('onPlaceSelected', place_id);
  }

  return (
    <Dialog open={props.open} onClose={handleClose} fullWidth disableRestoreFocus>
      <DialogTitle>Create a new Place</DialogTitle>
      <DialogContent>
        <GoogleMaps onSelect={onPlaceSelected} />
      {/* <GooglePlacesAutocomplete apiKey={config.google.maps.apiKey} /> */}
        {/* <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Name of the place"
          type="text"
          fullWidth
          variant="filled"
          value={name}
          onChange={onChange}
        /> */}
        {autoCompleteResult && autoCompleteResult.description}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" disabled={name.length === 0} onClick={handleClose}>Create</Button>
      </DialogActions>
    </Dialog>
  );
}