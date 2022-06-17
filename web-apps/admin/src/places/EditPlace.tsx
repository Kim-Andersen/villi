import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Place, PlaceId } from '../shared/types';
import snackbarService from '../snackbar/snackbarService';
import formatDateTime from '../utils/formatDateTime';
import FindLocationDialog, { FindLocationResult } from './FindLocationDialog';
import getStaticMapUrl from './getStaticMapUrl';
import PlacePhotos from './PlacePhotos';
import placesService from './placesService';
import useEditPlace from './useEditPlace';

export default function EditPlace(): React.ReactElement {
  const navigate = useNavigate();
  const placeId = Number(useParams<keyof { placeId: PlaceId }>().placeId);
  const [place, setPlaceUpdate, loading, error] = useEditPlace(placeId);
  const [openFindLocationDialog, setOpenFindLocationDialog] = useState<boolean>(false);
  
  function handleOnChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    if (place) {
      const target = event.target;
      setPlaceUpdate({
        ...place,
        [target.name]: target.value
      });
    }
  }  

  async function handleSaveClick() {
    try {
      await placesService.updatePlace(placeId, place!);
      snackbarService.showSnackbar('Changes were saved.');
    } catch(error) {
      snackbarService.showSnackbar('Failed to save changes.', 'error');
    }
  }

  async function handleDeleteClick() {
    const result = prompt(`To confirm that you want to permanently delete this place,\nplease type in "delete" below and click "OK":`)
    if (result === null) {
      return;
    } else if (result.toLowerCase() === 'delete') {
      try {
        await placesService.deletePlace(placeId);
        snackbarService.showSnackbar('Place deleted.', 'success');
        navigate('/places');
      } catch (error) {
        snackbarService.showSnackbar('Could not delete place.', 'error');
      }
    } else {
      snackbarService.showSnackbar(`You didn't type in "delete", so nothing was done.`);
    }
  }

  function handleChangeLocation() {
    setOpenFindLocationDialog(true);
  }

  function handleFindLocationDialogClose(result: FindLocationResult | null) {
    setOpenFindLocationDialog(false);
    const placeUpdate: Place = Object.assign({}, place, result);
    setPlaceUpdate(placeUpdate);
  }

  if (place) {
    const lastUpdated = new Date(place.updated_at || place.created_at);

    return (
      <div id="edit-place">
        {openFindLocationDialog && <FindLocationDialog onClose={handleFindLocationDialogClose}></FindLocationDialog>}

        <header style={{ marginBottom: 32 }}>
          <Stack direction="row" spacing={2}>
            <LoadingButton loading={placesService.isWorking} variant='contained' onClick={handleSaveClick}>Save</LoadingButton>
            <LoadingButton loading={placesService.isWorking} variant='outlined' color="error" onClick={handleDeleteClick}>Delete</LoadingButton>
            <Typography variant='caption'>Last updated: {formatDateTime(lastUpdated)}</Typography>
          </Stack>
        </header>

        <Box component="form" noValidate autoComplete="off">
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <TextField
                name="name"
                required
                label="Name"
                value={place.name}
                onChange={handleOnChange}
                variant="filled"
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="description"
                required
                label="Description"
                value={place.description}
                onChange={handleOnChange}
                variant="filled"
                multiline
                minRows={3}
                fullWidth
              />
            </Grid>
          
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" gutterBottom>Address</Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={9}>
                  <TextField
                    name="street_name"
                    required
                    label="Street name"
                    value={place.street_name}
                    onChange={handleOnChange}
                    variant="filled"
                    size="small"
                    fullWidth
                    disabled
                    />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    name="street_number"
                    required
                    label="Street number"
                    value={place.street_number}
                    onChange={handleOnChange}
                    variant="filled"
                    size="small"
                    fullWidth
                    disabled
                    />  
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    name="postal_code"
                    required
                    label="Postal code"
                    value={place.postal_code}
                    onChange={handleOnChange}
                    variant="filled"
                    size="small"
                    fullWidth
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={8}>
                  <TextField
                    name="city"
                    required
                    label="City"
                    value={place.city}
                    onChange={handleOnChange}
                    variant="filled"
                    size="small"
                    fullWidth
                    disabled
                  />
                </Grid>
              </Grid>
              <Button variant='text' onClick={handleChangeLocation} style={{ marginTop: 16 }}>Change address</Button>
            </Grid>
            <Grid item container xs={12} sm={6} spacing={2}>
              <Grid item xs={12}>
                {place.coordinates && (
                  <div style={{ width: '100%', maxHeight: 400 }}>
                    <img style={{ width: '100%' }} src={getStaticMapUrl({ lat: place.coordinates[0], lng: place.coordinates[1] })} />
                  </div>
                )}
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required
                  label="Latitude"
                  defaultValue={place.coordinates && place.coordinates[0]}
                  variant="filled"
                  size="small"
                  fullWidth
                  disabled
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required
                  label="Longitude"
                  defaultValue={place.coordinates && place.coordinates[1]}
                  variant="filled"
                  size="small"
                  fullWidth
                  disabled
                />
              </Grid>
            </Grid>
          </Grid>

          <PlacePhotos placeId={placeId} />
        </Box>       
      </div>
    ); 
  } else {
    return (
      <React.Fragment>
        {loading && <h4>Loading place...</h4>}
        {error && <p>{error.message}</p>}
      </React.Fragment>
    );
  }
}