import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import React from 'react';
import { GeoAutocompleteResult, Place } from '../shared/types';
import getStaticMapUrl from './getStaticMapUrl';
import LocationAutocomplete from './LocationAutocomplete';

export type FindLocationResult = Required<Pick<Place, 'street_name' | 'street_number' | 'postal_code' | 'city' | 'coordinates'>>

type Props = {
  onClose: (result: FindLocationResult | null) => void;
};

export default function FindLocationDialog(props: Props) {
  const [result, setResult] = React.useState<FindLocationResult | null>(null);
  const [alert, setAlert] = React.useState<string | null>(null);
  

  const handleClose = () => {
    props.onClose(result);
  };

  const handleLocationChange = (result: GeoAutocompleteResult | null) => {
    setAlert(null);
    
    if (result === null) {
      setResult(null);  
    } else {
      const { street_name, street_number, postal_code, city, coordinates } = result;
      if (street_name && street_number && postal_code && city && coordinates) {
        setResult({ 
          street_name,
          street_number,
          postal_code,
          city,
          coordinates
        });
      } else {
        setAlert(`The selected location is missing information.`);
      }
    }
  };

  return (
    <Dialog open onClose={handleClose} fullWidth disableRestoreFocus>
      <DialogTitle>Find an address</DialogTitle>
      <DialogContent>
        <LocationAutocomplete onChange={handleLocationChange} autoFocus />

        {alert && <Alert severity='warning' style={{ marginTop: 16, marginBottom: 16 }}>{alert}</Alert>}

        <div style={{ width: '100%', maxHeight: 300, backgroundColor: '#eee' }}>
          {result && <img style={{ width: '100%' }} src={getStaticMapUrl({ lat: result.coordinates[0], lng: result.coordinates[1] })} />}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" disabled={result === null} onClick={handleClose}>Select</Button>
      </DialogActions>
    </Dialog>
  );
}