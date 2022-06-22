
import RefreshIcon from '@mui/icons-material/Refresh';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import { useObservableGetState } from 'observable-hooks';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { placeCreationDefaults } from '../shared/constants';
import { Place } from '../shared/types';
import NewPlaceDialog from './NewPlaceDialog';
import placesService from './placesService';

export default function PlaceList() {
  const navigate = useNavigate();
  const places = useObservableGetState<Place[] | null>(placesService.places, null);
  const [showNewPlaceDialog, setShowNewPlaceDialog] = useState<boolean>(false);

  async function handleClosewNewPlaceDialog(name?: string) {
    setShowNewPlaceDialog(false);
    if (name) {
      try {
        const place = await placesService.createNewSpace(Object.assign({}, placeCreationDefaults, { name }));
        navigate(`${place.id}`);
      } catch(error) {
        alert(JSON.stringify(error));
      }
    }
  }

  if (places) {
    return (
      <React.Fragment>
        <header style={{ marginBottom: 32 }}>
          <Stack direction="row" spacing={2}>
            <Button variant="contained" disabled={placesService.isWorking} onClick={() => setShowNewPlaceDialog(true)}>Create a new Place</Button>
            <Tooltip title="Reload places" placement="top">
              <IconButton aria-label="reload" onClick={() => placesService.fetchPlaces()}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </header>

        <NewPlaceDialog open={showNewPlaceDialog} onClose={handleClosewNewPlaceDialog} />

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell align="right">Id</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Coordinates</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {places.map(({ id, name, street_name, street_number, city, postal_code, coordinates }) => (
                <TableRow
                  key={id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  hover
                >
                  <TableCell align="right">{id}</TableCell>
                  <TableCell><strong>{name}</strong></TableCell>
                  <TableCell>{street_name} {street_number}, {postal_code} {city}</TableCell>
                  <TableCell>{coordinates && coordinates[0]}, {coordinates && coordinates[1]}</TableCell>
                  <TableCell><Link to={`${id}`}>Edit</Link></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </React.Fragment>
    );
  } else {
    return (
      <h4>Loading places...</h4>
    );
  }
}