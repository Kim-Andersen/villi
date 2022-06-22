import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { firstValueFrom } from 'rxjs';
import { PlaceId, TypeOfPlace, TypeOfPlaceId } from '../shared/types';
import snackbarService from '../snackbar/snackbarService';
import placesService from './placesService';

export default function EditPlaceTypes(): React.ReactElement {
  const placeId = Number(useParams<keyof { placeId: PlaceId }>().placeId);
  const [types, setTypes] = useState<TypeOfPlace[]>([]);
  const [selected, setSelected] = useState<TypeOfPlaceId[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [dirty, setDirty] = useState<boolean>(false);

  useEffect(() => {
    Promise.all([
      firstValueFrom(placesService.typesOfPlaces),
      placesService.getPlaceTypes(placeId)
    ]).then(([types, selected]) => {
      setTypes(types);
      setSelected(selected);
      setLoading(false);
    });
  }, [placeId]);

  async function save() {
    await placesService.updatePlaceTypes(placeId, selected);
    setDirty(false);
    snackbarService.showSnackbar('Changes were saved', 'success');
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const value = Number(event.target.value);
    const index = selected.indexOf(value);
    if (index === -1) {
      selected.push(value);
    } else {
      selected.splice(index, 1);
    } 
    setSelected([...selected]);
    setDirty(true);
  }

  if (!loading) {
    return (
      <React.Fragment>
        <header style={{ marginBottom: 32 }}>
          <Button disabled={dirty === false || placesService.isWorking} variant='contained' onClick={save}>Save</Button>
        </header>
        <FormGroup>
          {types.map(type => 
            <FormControlLabel
              key={type.id}
              label={type.name}
              value={type.id}
              control={
                <Checkbox checked={selected.includes(type.id)} onChange={handleChange} />
              }
            />
          )}
        </FormGroup>
      </React.Fragment>
    );
  } else {
    return (<div>Loading...</div>);
  }
}
