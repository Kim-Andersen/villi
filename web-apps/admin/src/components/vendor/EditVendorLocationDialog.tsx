import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import React, { useEffect, useState } from 'react';
import { locationService, vendorService } from '../../services';
import { LocationInput, VendorLocationDetails } from '../../shared';
import FindLocation from '../location/FindLocation';
import LocationAddressDisplay from '../location/LocationAddressDisplay';
import EditVendorLocation from './EditVendorLocation';

type Props = {
  open: boolean;
  onClose: (vendorLocation?: VendorLocationDetails) => void;
  vendorLocation: VendorLocationDetails;
};

export default function EditVendorLocationDialog({ vendorLocation, open, onClose }: Props): React.ReactElement {
  const [view, setView] = useState<'edit' | 'change-location'>('edit');
  const [locationInput, setLocationInput] = useState<LocationInput | null>(null);
  const [editedVendorLocation, setEditedVendorLocation] = useState<VendorLocationDetails>(vendorLocation);
  
  useEffect(() => {
    // Reset
    setView('edit');
    setEditedVendorLocation(vendorLocation);
    setLocationInput(null);
  }, [vendorLocation]);

  const handleSaveClick = async () => {
    const location_id = locationInput ? await locationService.addLocation(locationInput) : editedVendorLocation.location_id;
    const vendorLocation = await vendorService.updateVendorLocation({...editedVendorLocation, location_id});
    onClose(vendorLocation);
  };

  const handleClose = () => {
    onClose();
  };

  const handleCancelChangeLocation = () => {
    setLocationInput(null);
    setView('edit');
  };

  const handleSelectChangedLocation = () => {
    setView('edit');
  };

  let dialogTitle: string;
  let dialogContent: JSX.Element;
  let dialogActions: JSX.Element | undefined = undefined;

  if (view === 'edit' && editedVendorLocation) {
    dialogTitle = editedVendorLocation.location.name;
    dialogContent = (
      <DialogContent>
        <LocationAddressDisplay location={locationInput ?? editedVendorLocation.location} />
        <Button variant='text' onClick={() => setView('change-location')}>Change location</Button>
        <hr/>
        <EditVendorLocation vendorLocation={editedVendorLocation} onChange={changes => setEditedVendorLocation({ ...editedVendorLocation, ...changes })} />
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
        <FindLocation country='ch' onSelect={locationInput => setLocationInput(locationInput)} />
      </DialogContent>
    );
    dialogActions = (
      <DialogActions>
        <Button onClick={handleCancelChangeLocation}>Cancel</Button>
        <Button variant="contained" disabled={locationInput === null} onClick={handleSelectChangedLocation}>Continue</Button>
      </DialogActions>
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