import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import React from 'react';
import { Link, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { PlaceId } from '../shared/types';
import snackbarService from '../snackbar/snackbarService';
import placesService from './placesService';
import useEditPlace from './useEditPlace';

const tabs = ['', 'photos', 'types'];

export default function EditPlace(): React.ReactElement {
  const navigate = useNavigate();
  const location = useLocation();
  const placeId = Number(useParams<keyof { placeId: PlaceId }>().placeId);
  const [place, setPlaceUpdate, loading, error] = useEditPlace(placeId);
  const tab = location.pathname.substring(location.pathname.lastIndexOf('/') + 1);
  const tabIndex = tabs.includes(tab) ? tabs.indexOf(tab) : 0;
  
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

  if (place) {
    const lastUpdated = new Date(place.updated_at || place.created_at);

    return (
      <React.Fragment>
        <Typography variant="h4">{place.name}</Typography>

        <Box sx={{ width: '100%', typography: 'body1' }}>
          <Tabs value={tabIndex}>
            <Tab component={Link} label="Main" to=""></Tab>
            <Tab component={Link} label="Photos" to="photos"></Tab>
            <Tab component={Link} label="Types" to="types"></Tab>
          </Tabs>

          <Box>
            <Outlet />
          </Box>
        </Box>       
      </React.Fragment>
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