import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import React, { useState } from 'react';

export default function DownloadWebPhoto({ onDownload } : { onDownload: (url: string) => void }): React.ReactElement {
  const [url, setUrl] = useState<string>('');
  
  async function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    setUrl(event.target.value);
  }

  async function handleDownloadClick() {
    onDownload(url);
  }

  return (
    <Box>
      <TextField
        label="Photo web URL"
        value={url}
        onChange={onChange}
        variant="filled"
        fullWidth
        helperText='Paste in the web url of the photo.'
      />
      <Button variant='outlined' disabled={url.length === 0} onClick={handleDownloadClick}>Download</Button>
    </Box>
  );
}