import Alert from '@mui/material/Alert';
import Container from '@mui/material/Container';
import LinearProgress from '@mui/material/LinearProgress';
import Snackbar from '@mui/material/Snackbar';
import { useObservableGetState } from 'observable-hooks';
import React from 'react';
import { Link, Route, Routes } from "react-router-dom";
import { backendAPI } from './api/backendAPI';
import './App.css';
import Home from './home/Home';
import EditPlace from './places/EditPlace';
import EditPlaceInfo from './places/EditPlaceInfo';
import EditPlacePhotos from './places/EditPlacePhotos';
import EditPlaceTypes from './places/EditPlaceTypes';
import PlaceList from './places/PlaceList';
import ScrollToTop from './ScrollToTop';
import snackbarService, { SnackbarOptions } from './snackbar/snackbarService';
import UserList from './users/UserList';

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
            <li><Link to="/users">Users</Link></li>
            <li><Link to="/places">Places</Link></li>
          </ul>
        </nav>
        <main>
          <ScrollToTop />
          <Routes>
            <Route path="places" element={<PlaceList />}></Route>
            <Route path="places/:placeId" element={<EditPlace />}>
              <Route path="" element={<EditPlaceInfo />}></Route>
              <Route path="photos" element={<EditPlacePhotos />}></Route>
              <Route path="types" element={<EditPlaceTypes />}></Route>
            </Route>
            <Route path="users" element={<UserList />}></Route>
            <Route path="/" element={<Home />}></Route>
          </Routes>
        </main>
      </Container>

      <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} disableWindowBlurListener key={snackbar ? snackbar.message : 'foo'} open={snackbar !== null} autoHideDuration={5000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbar ? snackbar.severity : 'info'} sx={{ width: '100%' }}>
          {snackbar ? snackbar.message : ''}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default App;


