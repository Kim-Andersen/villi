import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useObservableGetState } from 'observable-hooks';
import React from 'react';
import errorHandlerService, { ErrorDetails } from '../../snackbar/errorHandlerService';

export default function ErrorDialog(): React.ReactElement {
  const error = useObservableGetState<ErrorDetails | null>(errorHandlerService.error, null);

  const handleClose = () => {
    errorHandlerService.clear();
  };

  if (error) {
    return (
      <Dialog
        open={true}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{error.title}</DialogTitle>
        <DialogContent>
          {error.text ?
            <DialogContentText id="alert-dialog-description">
              {error.text}
            </DialogContentText>
          : undefined }
          {error.json ? 
            <code>
              <pre>
                {JSON.stringify(error.json, null, 2)}
              </pre>
            </code>
            : undefined
          }
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>Close</Button>
        </DialogActions>
      </Dialog>
    );
  } else {
    return <React.Fragment />;
  }
}
