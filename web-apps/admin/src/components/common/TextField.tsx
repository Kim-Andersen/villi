import MuiTextField, { TextFieldProps } from '@mui/material/TextField';

export default function TextField(props: TextFieldProps): JSX.Element {
  return (
    <MuiTextField variant="filled" fullWidth size='small' margin="dense" {...props} />
  );
}

