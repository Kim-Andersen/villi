import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import { includes } from 'lodash';
import React from 'react';
import useForm from '../../hooks/useForm';
import { VendorLocationDetails, VendorLocationInput } from '../../shared';

type Props = {
  vendorLocation: VendorLocationDetails | VendorLocationInput;
  onChange: (vendorLocation: VendorLocationDetails | VendorLocationInput) => void;
};

export default function EditVendorLocation({ vendorLocation, onChange }: Props): React.ReactElement {
  const [form, handleFormElementChange] = useForm<VendorLocationDetails | VendorLocationInput>(vendorLocation, onChange);

  return (
    <React.Fragment>
      <Box sx={{ mb: 2 }}>
        <FormLabel>What is this location's function for the Vendor?</FormLabel>
        <FormGroup>
          <FormControlLabel control={<Checkbox name='types' value="admin" checked={includes(form.types, 'admin')} onChange={handleFormElementChange} />} label="Administration" />
          <FormControlLabel control={<Checkbox name='types' value="outlet" checked={includes(form.types, 'outlet')} onChange={handleFormElementChange} />} label="Outlet" />
        </FormGroup>
        <TextField
          name="note"
          label="Note"
          value={form.note || ''}
          onChange={handleFormElementChange}
          variant="filled"
          multiline
          minRows={3}
          fullWidth
        />
      </Box>
    </React.Fragment>
  );
}