import Alert from '@mui/material/Alert';
import Container from '@mui/material/Container';
import LinearProgress from '@mui/material/LinearProgress';
import Snackbar from '@mui/material/Snackbar';
import { useObservableGetState } from 'observable-hooks';
import React from 'react';
import { Link, Route, Routes } from "react-router-dom";
import { backendAPI } from './api/backendAPI';
import './App.css';
import ErrorDialog from './components/common/ErrorDialog';
import EditVendorInfo from './components/vendor/EditVendorInfo';
import EditVendorLocations from './components/vendor/EditVendorLocations';
import EditVendorPhotos from './components/vendor/EditVendorPhotos';
import EditVendorTags from './components/vendor/EditVendorTags';
import VendorProducts from './components/vendor/VendorProducts';
import Home from './home/Home';
import ScrollToTop from './ScrollToTop';
import snackbarService, { SnackbarOptions } from './snackbar/snackbarService';
import EditProduct from './views/EditProduct';
import VendorDetails from './views/VendorDetails';
import Vendors from './views/Vendors';


function App(): React.ReactElement {
  const working = useObservableGetState<boolean>(backendAPI.working, false);
  const snackbar = useObservableGetState<SnackbarOptions | null>(snackbarService.snackbar, null);

  function handleSnackbarClose() {
    if (arguments[1] !== 'clickaway') {
      snackbarService.handleCloseSnackbar();
    }
  }
  
  return (
      <div id="app">
        <div id="app-progress">
          {working && <LinearProgress />}
        </div>
        <Container>
          <nav>
            <ul>
              <li><Link to="/vendors">Vendors</Link></li>
            </ul>
          </nav>
          <main>
            <ScrollToTop />
            <Routes>
              <Route path="vendors" element={<Vendors />}></Route>
              <Route path="vendors/:vendorId" element={<VendorDetails />}>
                <Route path="" element={<EditVendorInfo />}></Route>
                <Route path="locations" element={<EditVendorLocations />}></Route>
                <Route path="photos" element={<EditVendorPhotos />}></Route>
                <Route path="tags" element={<EditVendorTags />}></Route>
                <Route path="products" element={<VendorProducts />}></Route>
                <Route path="products/:productId" element={<EditProduct />}></Route>
              </Route>
              <Route path="/" element={<Home />}></Route>
            </Routes>
          </main>
        </Container>

        <ErrorDialog></ErrorDialog>

        <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} disableWindowBlurListener key={snackbar ? snackbar.message : 'foo'} open={snackbar !== null} autoHideDuration={5000} onClose={handleSnackbarClose}>
          <Alert onClose={handleSnackbarClose} severity={snackbar ? snackbar.severity : 'info'} sx={{ width: '100%' }}>
            {snackbar ? snackbar.message : ''}
          </Alert>
        </Snackbar>
      </div>
    
  );
}

export default App;


