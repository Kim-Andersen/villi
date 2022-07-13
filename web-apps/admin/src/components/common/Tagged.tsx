import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import { includes } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { taggedService } from '../../services';
import { EntityType, tagEnum } from '../../shared';

const allTags = Object.keys(tagEnum.Values).sort();

type Props = {
  entityId: number;
  type: EntityType;
  onChange: (tags: string[]) => void;
};

export default function Tagged({ entityId, type, onChange }: Props): React.ReactElement {
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const fetchTags = useCallback(async () => {
    const entityTags = await taggedService.getEntityTags(entityId, type);
    setSelectedTags(entityTags);
    setLoading(false);
  }, [entityId, type]);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  function handleCheckboxChange(event: React.ChangeEvent<HTMLInputElement>) {
    const checkbox = event.target;
    if (checkbox.checked && !selectedTags.includes(checkbox.value)) {
      selectedTags.push(checkbox.value);
    } else if (selectedTags.includes(checkbox.value)) {
      selectedTags.splice(selectedTags.indexOf(checkbox.value), 1);
    }
    const updated = Array.from(selectedTags);
    setSelectedTags(updated);
    onChange(updated);
  }

  if (!loading) {
    return (
      <Box sx={{ mb: 2 }}>
        <FormGroup>
          {allTags.map(tag => 
            <FormControlLabel key={tag} control={<Checkbox value={tag} checked={includes(selectedTags, tag)} onChange={handleCheckboxChange} />} label={tag} />
          )}
        </FormGroup>
      </Box>
    );
  } else {
    return <p>Loading...</p>;
  }
}