import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import React from 'react';
import CreateVendorLocationStepper, { Result } from './CreateVendorLocationStepper/CreateVendorLocationStepper';

type Props = {
  open: boolean;
  onClose: (result?: Result) => void;
  vendorName: string;
};

export default function NewVendorLocationDialog(props: Props): React.ReactElement {
  const handleClose = () => {
    props.onClose();
  };

  return (
    <Dialog open={props.open} onClose={handleClose} fullWidth disableRestoreFocus>
      <DialogTitle>Add a location to {props.vendorName}</DialogTitle>
      <DialogContent>
        <CreateVendorLocationStepper onComplete={props.onClose} />
      </DialogContent>
      {/* <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button variant="contained" disabled={false} onClick={handleClose}>Create</Button>
      </DialogActions> */}
    </Dialog>
  );
}