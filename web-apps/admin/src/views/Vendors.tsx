
import Button from '@mui/material/Button';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ActionBar from '../components/common/ActionBar';
import NewVendorDialog from '../components/vendor/NewVendorDialog';
import VendorList from '../components/vendor/VendorList';
import { vendorService } from '../services';
import { Vendor, VendorId, VendorInput } from '../shared';

export default function Vendors(): React.ReactElement {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState<Vendor[] | null>(null);
  const [showNewVendorDialog, setShowNewVendorDialog] = useState<boolean>(false);

  function navigateToVendor(vendorId: VendorId) {
    navigate(`${vendorId}`);
  }

  async function handleCloseNewVendorDialog(creation?: VendorInput) {
    setShowNewVendorDialog(false);
    if (creation && creation.name.length > 0) {
      const vendorId = await vendorService.createVendor(creation);
      navigateToVendor(vendorId);
    }
  }

  async function fetchVendors() {
    const vendors = await vendorService.getVendorList();
    setVendors(vendors);
  }

  useEffect(() => {
    fetchVendors();
  }, []);

  if (vendors) {
    return (
      <React.Fragment>
        <NewVendorDialog open={showNewVendorDialog} onClose={handleCloseNewVendorDialog} />
        <ActionBar>
          <Button variant='outlined' onClick={() => setShowNewVendorDialog(true)}>Create Vendor</Button>
          </ActionBar>
        <VendorList vendors={vendors} onItemClick={navigateToVendor} />
      </React.Fragment>
    );
  } else {
    return <p>Loading vendors...</p>;
  }
}