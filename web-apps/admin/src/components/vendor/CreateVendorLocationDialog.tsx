import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import React, { useEffect, useState } from 'react';
import { locationService, vendorService } from '../../services';
import { LocationInput, VendorId, VendorLocationDetails, VendorLocationInput } from '../../shared';
import FindLocation from '../location/FindLocation';
import LocationAddressDisplay from '../location/LocationAddressDisplay';
import EditVendorLocation from './EditVendorLocation';

type Props = {
  vendorId: VendorId;
  open: boolean;
  onClose: (vendorLocation?: VendorLocationDetails) => void;
};

export default function CreateVendorLocationDialog({ vendorId, open, onClose }: Props): React.ReactElement {
  const [view, setView] = useState<'select-location' | 'meta'>('select-location');
  const [vendorLocationInput, setVendorLocationInput] = useState<VendorLocationInput>({
    location_id: 0,
    vendor_id: vendorId,
    note: '',
    types: ['admin', 'outlet'],
    opening_hours: []
  });
  const [locationInput, setLocationInput] = useState<LocationInput | null>(null);
  
  useEffect(() => {
    setView('select-location');
  }, [open]);

  const handleSaveClick = async () => {
    if (locationInput) {
      const location_id = await locationService.addLocation(locationInput);
      const vendorLocation = await vendorService.addVendorLocation({...vendorLocationInput, location_id});
      onClose(vendorLocation);
    } else {
      throw new Error('Expected locationInput and vendorLocationInput to be defined.');
    }
  };

  const handleClose = () => {
    onClose();
  };

  const handleLocationSelected = (locationInput: LocationInput) => {
    setLocationInput(locationInput);
    setView('meta');
  };

  let dialogTitle: string;
  let dialogContent: JSX.Element;
  let dialogActions: JSX.Element | undefined = undefined;

  if (view === 'meta' && locationInput) {
    dialogTitle = locationInput.name;
    dialogContent = (
      <DialogContent>
        <LocationAddressDisplay location={locationInput} />
        <Button variant='text' onClick={() => setView('select-location')}>Change location</Button>
        <hr/>
        <EditVendorLocation vendorLocation={vendorLocationInput} onChange={input => setVendorLocationInput(input)} />
      </DialogContent>
    );
    dialogActions = (
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" disabled={locationInput === null} onClick={handleSaveClick}>Save</Button>
      </DialogActions>
    );
  } else {
    dialogTitle = 'Find the location';
    dialogContent = (
      <DialogContent>
        <FindLocation country='ch' onSelect={handleLocationSelected} />
      </DialogContent>
    );
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth disableRestoreFocus>
      <DialogTitle>{dialogTitle}</DialogTitle>
      {dialogContent}
      {dialogActions}
    </Dialog>
  );
}