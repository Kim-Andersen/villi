import LocationOnIcon from '@mui/icons-material/LocationOn';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/system';
import { throttle } from 'lodash';
import React from 'react';
import { googlePlacesService } from '../services';
import { GooglePlaceAutocompleteResult } from '../services/GooglePlacesService/types';
import geoService from './geoService';

type Props = {
  onChange: (result: GooglePlaceAutocompleteResult | null) => void;
  autoFocus?: boolean;
};

export default function GooglePlaceAutocomplete(props: Props) {
  const [value, setValue] = React.useState<GooglePlaceAutocompleteResult | null>(null);
  const [inputValue, setInputValue] = React.useState('');
  const [options, setOptions] = React.useState<GooglePlaceAutocompleteResult[]>([]);

  const fetch = React.useMemo<(query: string, callback: (results: GooglePlaceAutocompleteResult[]) => void) => void>(
    () =>
      throttle(async (query, callback) => {
        const result = await googlePlacesService.autocomplete(query);
        callback(result);
      }, 1000),
    [],
  );

  React.useEffect(() => {
    let active = true;

    if (inputValue === '') {
      setOptions(value ? [value] : []);
      return undefined;
    } else if (inputValue.length > 5) {
      fetch(inputValue, results => {
        if (active) {
          let newOptions: GooglePlaceAutocompleteResult[] = [];
  
          if (value) {
            newOptions = [value];
          }
          
          if (results) {
            newOptions = [...newOptions, ...results];
          }
  
          setOptions(newOptions);
        }
      });
    }

    return () => {
      active = false;
    };
  }, [fetch, inputValue, value]);

  return (
    <Autocomplete
      fullWidth
      filterOptions={(x) => x}
      includeInputInList
      autoComplete
      loading={geoService.isWorking}
      isOptionEqualToValue={(option, value) => option.place_id === value.place_id}
      value={value}
      onChange={(event, newValue) => {
        setOptions(newValue ? [newValue, ...options] : options);
        setValue(newValue);
        props.onChange(newValue);
      }}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      options={options}
      getOptionLabel={option => option.description}
      renderInput={(params) => (
        <TextField
          margin='dense'
          label="Start typing the name or address"
          {...params}
          InputProps={{
            autoFocus: props.autoFocus,
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {geoService.isWorking ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
      renderOption={(props, option) => {
        return (
          <li {...props} key={option.place_id}>
            <Grid container alignItems="center">
              <Grid item>
                <Box
                  component={LocationOnIcon}
                  sx={{ color: 'text.secondary', mr: 2 }}
                />
              </Grid>
              <Grid item xs>
                <Typography variant="body2" color="text.secondary">
                  {option.description}
                </Typography>
              </Grid>
            </Grid>
          </li>
        );
      }}
    />
  );
}

// function formatOptionLabel({ name, street_name, street_number, postal_code, city, country }: GeoAutocompleteResult): string {
//   const label = [];

//   if (street_name || street_number) {
//     label.push(`${street_name || ''} ${street_number || ''}`.trim());
//   }
//   if (postal_code || city) {
//     label.push(`${postal_code || ''} ${city || ''}`.trim());
//   }
//   if (country) {
//     label.push(country);
//   }
//   return label.join(', ');
// }