
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { join } from 'lodash';
import React from 'react';
import { VendorLocationDetails, VendorLocationId } from '../../shared';

type Props = {
  vendorLocations: VendorLocationDetails[];
  onItemClick: (vendorLocation: VendorLocationDetails) => void;
  onDeleteItemClick: (id: VendorLocationId) => void;
};

export default function VendorLocationList({ vendorLocations, onItemClick, onDeleteItemClick }: Props): React.ReactElement {
  function handleDeleteClick(id: VendorLocationId, event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    event.stopPropagation();
    onDeleteItemClick(id);
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>Types</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {vendorLocations.map((vendorLocation, index) => {
            const { id, types, location: { name, street_name, street_number, postal_code, city } } = vendorLocation;
            return (
              <TableRow
              key={index}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              hover
              onClick={() => onItemClick(vendorLocation)}
            >
              <TableCell><strong>{name}</strong></TableCell>
              <TableCell>{street_name} {street_number}, {postal_code} {city}</TableCell>
              <TableCell>{join(types, ', ')}</TableCell>
              <TableCell align="right">
                <IconButton onClick={(event) => handleDeleteClick(id as VendorLocationId, event)}>
                  <DeleteIcon color="error" />
                </IconButton>
              </TableCell>
            </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}