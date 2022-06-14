import LocationOnIcon from '@mui/icons-material/LocationOn';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/system';
import { throttle } from 'lodash';
import React from 'react';
import { GeoAutocompleteResult } from '../shared/types';
import geoService from './geoService';

type Props = {
  onChange: (result: GeoAutocompleteResult | null) => void;
  autoFocus?: boolean;
};

export default function LocationAutocomplete(props: Props) {
  const [value, setValue] = React.useState<GeoAutocompleteResult | null>(null);
  const [inputValue, setInputValue] = React.useState('');
  const [options, setOptions] = React.useState<GeoAutocompleteResult[]>([]);

  const fetch = React.useMemo<(query: string, callback: (result: GeoAutocompleteResult[]) => void) => void>(
    () =>
      throttle(async (query, callback) => {
        const result = await geoService.autocomplete(query);
        callback(result);
      }, 1000),
    [],
  );

  React.useEffect(() => {
    let active = true;

    if (inputValue === '') {
      setOptions(value ? [value] : []);
      return undefined;
    } else if (inputValue.length > 8) {
      fetch(inputValue, results => {
        if (active) {
          let newOptions: GeoAutocompleteResult[] = [];
  
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
      isOptionEqualToValue={(option, value) => option.key === value.key}
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
      getOptionLabel={formatOptionLabel}
      renderInput={(params) => (
        <TextField
          margin='dense'
          label="Start typing the address"
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
          <li {...props} key={option.key}>
            <Grid container alignItems="center">
              <Grid item>
                <Box
                  component={LocationOnIcon}
                  sx={{ color: 'text.secondary', mr: 2 }}
                />
              </Grid>
              <Grid item xs>
                <Typography variant="body2" color="text.secondary">
                  {formatOptionLabel(option)}
                </Typography>
              </Grid>
            </Grid>
          </li>
        );
      }}
    />
  );
}

function formatOptionLabel({ name, street_name, street_number, postal_code, city, country }: GeoAutocompleteResult): string {
  const label = [];

  if (street_name || street_number) {
    label.push(`${street_name || ''} ${street_number || ''}`.trim());
  }
  if (postal_code || city) {
    label.push(`${postal_code || ''} ${city || ''}`.trim());
  }
  if (country) {
    label.push(country);
  }
  return label.join(', ');
}