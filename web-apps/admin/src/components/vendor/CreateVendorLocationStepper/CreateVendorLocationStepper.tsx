import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import Step from '@mui/material/Step';
import StepContent from '@mui/material/StepContent';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import TextField from '@mui/material/TextField';
import React, { useState } from 'react';
import useForm from '../../../hooks/useForm';
import { LocationInput, LocationType } from '../../../shared';
import LocationIQAutocomplete, { LocationIQ } from '../../common/LocationIQAutocomplete';
import Map from '../../common/Map';

export type Result = {
  locationInput: LocationInput;
  locationTypes: LocationType[];
  note: string;
};

type Props = {
  onComplete: (result: Result) => void;
};

export default function CreateVendorLocationStepper(props: Props): React.ReactElement {
  const [activeStep, setActiveStep] = useState(0);
  const [location, setLocation] = useState<LocationInput | null>(null);
  const [form, handleFormElementChange] = useForm<{ note: string; type_admin: boolean; type_outlet: boolean; }>({ note: '', type_admin: true, type_outlet: false });

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleComplete = () => {
    const locationTypes: LocationType[] = [];
    if (form.type_admin) {
      locationTypes.push('admin');
    }
    if (form.type_outlet) {
      locationTypes.push('outlet');
    }

    if (location && form) {
      props.onComplete({
        locationInput: location,
        note: form.note,
        locationTypes
      });
    }
  };

  const handlePlaceSelected = (place: LocationIQ.AutocompleteResult) => {
    const { name, road: street_name, house_number: street_number, postcode: postal_code, city, country_code: country } = place.address;
    setLocation({
      name,
      street_name,
      street_number,
      postal_code,
      city,
      country,
      point: [Number(place.lat), Number(place.lon)]
    });
  };

  return (
    <Box>
      <Stepper activeStep={activeStep} orientation="vertical">
        <Step key={0}>
          <StepLabel>Find the location</StepLabel>
          <StepContent TransitionProps={{ unmountOnExit: false }}>
            <Box sx={{ mb: 2 }}>
              <LocationIQAutocomplete onSelect={handlePlaceSelected} country="ch" />
              <Box sx={{ mb: 2, mt: 2, width: '100%', height: 300, backgroundColor: '#eee' }}>
                {location && <Map center={{ lat: location.point[0], lng: location.point[1] }} />}
              </Box>
              <Button disabled={location === null} variant="contained" onClick={handleNext} sx={{ mt: 1, mr: 1 }}>Continue</Button>
            </Box>
          </StepContent>
        </Step>
        <Step key={1}>
          <StepLabel>Additional info</StepLabel>
          <StepContent TransitionProps={{ unmountOnExit: false }}>
            <Box sx={{ mb: 2 }}>
              <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
                <FormLabel>What is the location's function for the Vendor?</FormLabel>
                <FormGroup>
                  <FormControlLabel control={<Checkbox name='type_admin' checked={form.type_admin} onChange={handleFormElementChange} />} label="Administration" />
                  <FormControlLabel control={<Checkbox name='type_outlet' checked={form.type_outlet} onChange={handleFormElementChange} />} label="Outlet" />
                </FormGroup>
              </FormControl>
              <TextField
                name="note"
                label="Note"
                value={form.note || ''}
                onChange={handleFormElementChange}
                variant="filled"
                multiline
                minRows={3}
                fullWidth
              />
              <Button variant="contained" onClick={handleComplete} sx={{ mt: 1, mr: 1 }}>Complete</Button>
              <Button onClick={handleBack} sx={{ mt: 1, mr: 1 }}>Back</Button>
            </Box>
          </StepContent>
        </Step>
      </Stepper>
      {/* {activeStep === steps.length && (
        <Paper square elevation={0} sx={{ p: 3 }}>
          <Typography>All steps completed - you&apos;re finished</Typography>
          <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
            Reset
          </Button>
        </Paper>
      )} */}
    </Box>
  );
}