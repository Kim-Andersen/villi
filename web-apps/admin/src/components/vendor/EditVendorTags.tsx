import LoadingButton from '@mui/lab/LoadingButton';
import React, { useState } from 'react';
import { useOutletContext } from "react-router-dom";
import { backendAPI } from '../../api/backendAPI';
import { taggedService } from '../../services';
import { taggedSchema, Vendor } from '../../shared';

import ActionBar from '../common/ActionBar';
import Tagged from '../common/Tagged';

export default function EditVendorTags(): React.ReactElement {
  const vendor = useOutletContext<Vendor>();
  const [tags, setTags] = useState<string[]>([]);

  async function onSaveClick() {
    const input = await taggedSchema.parse({ entity_id: vendor.id, type: 'vendor', tags });
    await taggedService.upsertEntityTags(input)
  }

  return (
    <React.Fragment>
      <ActionBar>
        <LoadingButton sx={{ minWidth: 100 }} loading={backendAPI.isWorking} variant='contained' onClick={onSaveClick}>Save</LoadingButton>
      </ActionBar>
      <Tagged entityId={vendor.id} type='vendor' onChange={tags => setTags(tags)} />
    </React.Fragment>
  );
}