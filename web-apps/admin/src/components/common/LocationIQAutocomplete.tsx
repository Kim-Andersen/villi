import LocationOnIcon from '@mui/icons-material/LocationOn';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/system';
import { throttle } from 'lodash';
import React from 'react';

export namespace LocationIQ {
  // https://locationiq.com/docs#autocomplete
  export type AutocompleteResult = {
    place_id: string,
    osm_id: number,
    osm_type: 'node' | 'way' | 'relation',
    licence: string,
    lat: string,
    lon: string,
    boundingbox: number[],
    class: string,
    type: string,
    display_name: string,
    display_place: string,
    display_address: string,
    address: {
      name: string,
      house_number: string,
      road: string,
      city: string,
      state: string,
      postcode: string,
      country: string
      country_code: string;
    }
  };
}

type Props = {
  country: string;
  onSelect: (result: LocationIQ.AutocompleteResult) => void;
};

export default function LocationIQAutocomplete(props: Props): React.ReactElement {
  const [value, setValue] = React.useState<LocationIQ.AutocompleteResult | null>(null);
  const [inputValue, setInputValue] = React.useState('');
  const [loading, setLoading] = React.useState<boolean>(false);
  const [options, setOptions] = React.useState<LocationIQ.AutocompleteResult[]>([]);

  const fetchAutocompleteResults = React.useMemo<(query: string, callback: (results: LocationIQ.AutocompleteResult[]) => void) => void>(
    () =>
      throttle(async (query, callback) => {
        setLoading(true);
        const querystring = new URLSearchParams({
          key: 'pk.f9ea8541082951f34f72e11a54cd5dea',
          q: query,
          countrycodes: props.country,
          addressdetails: '1',
          normalizeaddress: '1'
        });
        const response = await fetch(`https://api.locationiq.com/v1/autocomplete.php?${querystring}`);
        if (response.ok) {
          const results = await response.json() as LocationIQ.AutocompleteResult[];
          callback(results);
          setLoading(false);
        } else {
          throw response;
        }
      }, 1000),
    [],
  );

  React.useEffect(() => {
    let active = true;

    if (inputValue === '') {
      setOptions(value ? [value] : []);
      return undefined;
    } else if (inputValue.length > 5) {
      fetchAutocompleteResults(inputValue, results => {
        if (active) {
          let newOptions: LocationIQ.AutocompleteResult[] = [];
  
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
      loading={loading}
      isOptionEqualToValue={(option, value) => option.osm_id === value.osm_id}
      value={value}
      onChange={(event, newValue) => {
        setOptions(newValue ? [newValue, ...options] : options);
        setValue(newValue);
        if (newValue) {
          props.onSelect(newValue);
        }
      }}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      options={options}
      getOptionLabel={option => option.display_name}
      renderInput={(params) => (
        <TextField
          margin='dense'
          label="Start typing the name or address of the location"
          {...params}
          InputProps={{
            autoFocus: true,
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
      renderOption={(props, option) => {
        return (
          <li {...props} key={option.osm_id}>
            <Grid container alignItems="center">
              <Grid item>
                <Box
                  component={LocationOnIcon}
                  sx={{ color: 'text.secondary', mr: 2 }}
                />
              </Grid>
              <Grid item xs>
                <Typography variant="body2" color="text.secondary">
                  {option.display_name}
                </Typography>
              </Grid>
            </Grid>
          </li>
        );
      }}
    />
  );
}

// function formatOptionLabel({ address }: LocationIQAutocompleteResult): string {
//   const output = [];
//   if (address.name !== address.road) {
//     output.push(address.name);
//   }
//   output.push(`${address.road} ${address.house_number}`);
//   output.push(`${address.postcode} ${address.city}`);
//   output.push(address.state);
//   output.push(address.country_code.toUpperCase());
//   return output.join(', ');
// }