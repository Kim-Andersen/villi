
import Button from '@mui/material/Button';
import React, { useCallback, useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { vendorService } from '../../services';
import { Vendor } from '../../shared';
import { VendorId, VendorLocationDetails, VendorLocationId } from '../../shared/types';
import ActionBar from '../common/ActionBar';
import CreateVendorLocationDialog from './CreateVendorLocationDialog';
import EditVendorLocationDialog from './EditVendorLocationDialog';
import VendorLocationList from './VendorLocationList';

export default function EditVendorLocations(): React.ReactElement {
  const vendor = useOutletContext<Vendor>();
  const [vendorLocations, setVendorLocations] = useState<VendorLocationDetails[] | null>(null);
  const [create, setCreate] = useState<boolean>(false);
  const [edit, setEdit] = useState<VendorLocationDetails | null>(null);

  const fetchVendorLocations = useCallback(async () => {
    const vendorLocations = await vendorService.getVendorLocations(vendor.id as VendorId);
    setVendorLocations(vendorLocations);
  }, [vendor.id]);

  async function onCloseCreateVendorLocationDialog(vendorLocation?: VendorLocationDetails) {
    setCreate(false);
    if (vendorLocation) {
      fetchVendorLocations();
    }
  }

  async function handleListItemClick(vendorLocation: VendorLocationDetails) {
    setEdit(vendorLocation);
  }

  async function handleDeleteItemClick(id: VendorLocationId) {
    if (window.confirm('Delete this vendor location?')) {
      await vendorService.deleteVendorLocation(vendor.id as VendorId, id);
      fetchVendorLocations();
    }
  }

  useEffect(() => {
    fetchVendorLocations();
  }, [fetchVendorLocations]);

  return (
    <React.Fragment>
      <ActionBar>
        <Button variant='outlined' onClick={() => setCreate(true)}>Add</Button>
      </ActionBar>
      {vendorLocations && 
        <VendorLocationList 
          vendorLocations={vendorLocations} 
          onItemClick={handleListItemClick} 
          onDeleteItemClick={handleDeleteItemClick} 
          />}
      <CreateVendorLocationDialog vendorId={vendor.id as VendorId} open={create} onClose={onCloseCreateVendorLocationDialog} />
      {edit && <EditVendorLocationDialog vendorLocation={edit} open={edit !== null} onClose={() => setEdit(null)} />}
    </React.Fragment>
  );
}