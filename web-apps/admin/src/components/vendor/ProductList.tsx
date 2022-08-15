
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import cc from 'currency-codes';
import React from 'react';
import { Product, ProductId } from '../../shared';

type Props = {
  products: Product[];
  onItemClick: (productId: ProductId) => void;
};

export default function ProductList({ products, onItemClick }: Props): React.ReactElement {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Offer id</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Sale price</TableCell>
            <TableCell>Channel</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map(({ id, offer_id, title, price, sale_price, currency, channel }) => (
            <TableRow
              key={id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              hover
              onClick={() => onItemClick(id as ProductId)}
            >
              <TableCell><strong>{title}</strong></TableCell>
              <TableCell>{offer_id}</TableCell>
              <TableCell>{price} {cc.number(String(currency))?.code}</TableCell>
              <TableCell>{sale_price} {sale_price && cc.number(String(currency))?.code}</TableCell>
              <TableCell>{channel}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}