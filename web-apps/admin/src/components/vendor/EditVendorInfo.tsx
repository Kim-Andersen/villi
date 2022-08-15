import LoadingButton from '@mui/lab/LoadingButton';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { isEqual, omit } from 'lodash';
import React, { useState } from 'react';
import { useOutletContext } from "react-router-dom";
import { backendAPI } from '../../api/backendAPI';
import useForm from '../../hooks/useForm';
import { vendorService } from '../../services';
import { Vendor, VendorId, VendorInput } from '../../shared';

import ActionBar from '../common/ActionBar';
import TimeAgo from '../common/TimeAgo';

export default function EditVendorInfo(): React.ReactElement {
  const vendor = useOutletContext<Vendor>();
  const [vendorInput, setVendorInput] = useState<VendorInput>(omit(vendor, 'id', 'created_at', 'updated_at'));
  const [form, handleFormElementChange] = useForm<VendorInput>(vendorInput);
  const [lastSaved, setLastSaved] = useState<Date>(new Date(vendor.updated_at || vendor.created_at));

  async function onSaveClick() {
    const { updated_at } = await vendorService.updateVendor(vendor.id as VendorId, form);
    setVendorInput(form);
    setLastSaved(new Date(updated_at!));
  }

  return (
    <React.Fragment>
      <ActionBar>
        <TimeAgo date={lastSaved} />
        <LoadingButton sx={{ minWidth: 100 }} loading={backendAPI.isWorking} disabled={isEqual(form, vendorInput)} variant='contained' onClick={onSaveClick}>Save</LoadingButton>
      </ActionBar>
    
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <TextField
            autoFocus
            name="name"
            required
            label="Name"
            value={form.name}
            onChange={handleFormElementChange}
            variant="filled"
            fullWidth
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

        <Grid item xs={12}>
          <TextField
            name="email"
            type="email"
            label="E-mail"
            value={form.email || ''}
            onChange={handleFormElementChange}
            variant="filled"
            fullWidth
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            name="phone"
            type="text"
            label="Phone"
            value={form.phone || ''}
            onChange={handleFormElementChange}
            variant="filled"
            fullWidth
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            name="website_url"
            type="url"
            label="Website"
            value={form.website_url || ''}
            onChange={handleFormElementChange}
            variant="filled"
            fullWidth
            placeholder='Ex: https://www.myfarm.com'
            helperText="Website address"
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            name="instagram_url"
            type="url"
            label="Instagram"
            value={form.instagram_url || ''}
            onChange={handleFormElementChange}
            variant="filled"
            fullWidth
            placeholder='Ex: https://www.instagram.com/my_farm'
            helperText="Instagram profile address"
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            name="facebook_url"
            type="url"
            label="Facebook"
            value={form.facebook_url || ''}
            onChange={handleFormElementChange}
            variant="filled"
            fullWidth
            placeholder='Ex: https://www.facebook.com/myfarm'
            helperText="Facebook profile address"
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            name="youtube_url"
            type="url"
            label="Youtube"
            value={form.youtube_url || ''}
            onChange={handleFormElementChange}
            variant="filled"
            fullWidth
            placeholder='Ex: https://www.youtube.com/myfarm'
            helperText="Youtube profile address"
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}