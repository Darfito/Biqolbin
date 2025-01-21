// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import { IconUpload } from '@tabler/icons-react'

// ** Third Party Imports
import { useDropzone } from 'react-dropzone'

interface FileProp {
  name: string
  type: string
  size: number
}

interface FileUploaderSingleProps {
  onFileUpload: (file: File) => void;
}

const FileUploaderSingle = ({onFileUpload}: FileUploaderSingleProps) => {
  // ** State
  const [files, setFiles] = useState<File[]>([])

  // ** Hooks
  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'application/pdf': ['.pdf'] 
    },
    onDrop: (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      setFiles([file]); // Save file locally for preview
      onFileUpload(file); // Trigger callback
    }
  })

  const img = files.map((file: FileProp) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img key={file.name} alt={file.name} className='single-file-image' src={URL.createObjectURL(file as any)} />
  ))

  return (
    <Box
      {...getRootProps({
        className: 'dropzone',
        sx: {
          border: '2px dashed grey',
          borderRadius: '8px',
          p: 2,
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: files.length ? 'transparent' : 'grey.100', // background changes when a file is uploaded
          height: files.length ? 'auto' : 200, // dynamic height adjustment
          minWidth: files.length ? 'auto' : 300, // dynamic width adjustment
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }
      })}
    >
      <input {...getInputProps()} />
      {files.length ? (
        img
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box
            sx={{
              mb: 2.5,
              width: 64, // Adjusted the size of the icon
              height: 64, // Adjusted the size of the icon
              display: 'flex',
              borderRadius: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <IconUpload size={40} /> {/* Fixed the size of the icon */}
          </Box>
          <Typography variant='h6' sx={{ mb: 2 }}>
            Drop files here or click to upload.
          </Typography>
        </Box>
      )}
    </Box>
  )
}

export default FileUploaderSingle
