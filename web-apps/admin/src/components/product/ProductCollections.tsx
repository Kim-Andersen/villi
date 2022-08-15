import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { includes, isEqual } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { productService } from '../../services';
import { ProductCollection, ProductCollectionId, ProductCollectionInput, productCollectionInputSchema, ProductId, VendorId } from '../../shared';
import AddProductCollectionDialog from './AddProductCollectionDialog';

type Props = {
  vendorId: VendorId;
  productId: ProductId;
};

export default function ProductCollections({ vendorId, productId }: Props): React.ReactElement {
  const [mode, setMode] = useState<'view' | 'edit'>('view');
  const [collections, setCollections] = useState<ProductCollection[] | null>(null);
  const [selected, setSelected] = useState<ProductCollectionId[] | null>(null);
  const [originallySelected, setOriginallySelected] = useState<ProductCollectionId[] | null>(null);

  const [showAddCollectionDialog, setShowAddCollectionDialog] = useState<boolean>(false);
  
  const fetchData = useCallback(async () => {
    const [collections, productInCollections] = await Promise.all([
      productService.getCollections(vendorId),
      productService.getProductCollections(productId)
    ]);
    setCollections(collections);
    const selected = productInCollections.map(x => x.collection_id as ProductCollectionId);
    setSelected(selected);
    setOriginallySelected(selected);
  }, [vendorId, productId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  async function handleCloseAddProductCollectionDialog(data?: Pick<ProductCollectionInput, 'name' | 'description'>) {
    if (data) {
      const input = productCollectionInputSchema.parse({...data, vendor_id: vendorId });
      const collection = await productService.createCollection(input);
      setCollections([...collections ?? [], collection]);
    }
    setShowAddCollectionDialog(false);
  }

  function handleToggle(collectionId: ProductCollectionId) {
    const updated = Array.from(selected ?? []);
    if (includes(updated, collectionId)) {
      updated.splice(updated.indexOf(collectionId), 1);
    } else {
      updated.push(collectionId);
    }
    setSelected(updated);
  }

  async function handleDeleteCollection(id: ProductCollectionId): Promise<void> {
    if (window.confirm('Delete this Collection?')) {
      await productService.deleteProductCollection(id);
      await fetchData();
    }
  }

  async function save() {
    if (selected) {
      await productService.setProductInCollections(productId, selected);
      setOriginallySelected(selected);
    }
    setMode('view');
  }

  return (
    <React.Fragment>
      <Grid item xs={12}>
        <Typography variant='h6' component='div'>Collections</Typography>
      </Grid>
      <Grid item xs={12}>
        <Stack direction='row' spacing={2}>
          {mode === 'view' && <Button variant='outlined' onClick={() => setMode('edit')}>Edit</Button>}
          {mode === 'edit' && <Button variant='contained' onClick={save} disabled={isEqual(selected, originallySelected)}>Save</Button>}
          {mode === 'edit' && <Button variant='text' onClick={() => setMode('view')}>Cancel</Button>}
          {mode === 'edit' && <Button variant='text' onClick={() => setShowAddCollectionDialog(true)}>Create new collection</Button>}
        </Stack>
        {collections && selected && (
          <List dense>
            {collections.filter(({ id }) => mode === 'edit' ? true : includes(selected, id)).map(collection => {
              const labelId = `product-collection-list-label-${collection.id}`;
              if (mode === 'view') {
                return (
                  <ListItem>
                    <ListItemIcon>
                      <CheckIcon />
                    </ListItemIcon>
                    <ListItemText primary={collection.name} />
                  </ListItem>
                );
              } else {
                return (
                  <ListItem 
                    key={collection.id} 
                    disablePadding
                    secondaryAction={
                      <IconButton edge="end" aria-label="comments" onClick={() => handleDeleteCollection(collection.id as ProductCollectionId)}>
                        <DeleteIcon />
                      </IconButton>
                    }>
                    <ListItemButton selected={mode === 'edit' && includes(selected, collection.id)} onClick={() => handleToggle(collection.id as ProductCollectionId)} dense>
                      <ListItemIcon>
                        <Checkbox
                          edge="start"
                          checked={includes(selected, collection.id)}
                          tabIndex={-1}
                          disableRipple
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </ListItemIcon>
                      <ListItemText id={labelId} primary={collection.name} />
                    </ListItemButton>
                  </ListItem>
                );
              }
            })}
          </List>
        )}
      </Grid>
      {showAddCollectionDialog && <AddProductCollectionDialog onClose={handleCloseAddProductCollectionDialog} />}
    </React.Fragment>
  );
}