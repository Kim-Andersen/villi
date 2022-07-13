
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import React, { useCallback, useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { backendAPI } from '../api/backendAPI';
import { vendorService } from '../services';
import { parseId, Vendor, VendorId } from '../shared';

export default function VendorDetails(): React.ReactElement {
  const vendorId = parseId<VendorId>(useParams().vendorId!);
  const location = useLocation();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const tabs = ['', 'locations', 'photos', 'tags'];
  const tab = location.pathname.substring(location.pathname.lastIndexOf('/') + 1);
  const tabIndex = tabs.includes(tab) ? tabs.indexOf(tab) : 0;

  const fetchVendor = useCallback(async () => {
    const vendor = await vendorService.getVendor(vendorId);
    setVendor(vendor);
  }, [vendorId]);

  async function onDeleteClick() {
    await vendorService.deleteVendor(vendorId);
    navigate('/');
  }

  useEffect(() => {
    fetchVendor();
  }, [fetchVendor]);

  if (vendor) {
    return (
      <React.Fragment>
        <Typography variant="h4">{vendor.name}</Typography>
        <LoadingButton sx={{ minWidth: 100 }} loading={backendAPI.isWorking} variant='outlined' color="error" onClick={onDeleteClick}>Delete</LoadingButton>

        <Box sx={{ width: '100%', typography: 'body1' }}>
          <Tabs value={tabIndex}>
            <Tab component={Link} label="Vendor" to=""></Tab>
            <Tab component={Link} label="Locations" to="locations"></Tab>
            <Tab component={Link} label="Photos" to="photos"></Tab>
            <Tab component={Link} label="Tags" to="tags"></Tab>
          </Tabs>
          <Box>
            <Outlet context={vendor} />            
          </Box>
        </Box>
      </React.Fragment>
    );
  } else {
    return <p>Loading Vendor...</p>;
  }
}