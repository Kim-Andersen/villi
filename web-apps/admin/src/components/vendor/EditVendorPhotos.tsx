import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Vendor } from '../../shared';
import EntityPhotos from '../common/EntityPhotos';

export default function EditVendorPhotos(): React.ReactElement {  
  const vendor = useOutletContext<Vendor>();

  return (
    <React.Fragment>
      <EntityPhotos entityType='vendor' entityId={vendor.id} upload={{ sizes: ['sm', 'md'] }} />
    </React.Fragment>
  );
}
