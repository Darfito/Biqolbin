import { toast } from 'react-toastify'
import { Box, IconButton, Typography } from '@mui/material'
import { IconCheck, IconX, IconAlertTriangle, IconBan } from '@tabler/icons-react'



const toastTypes: {
  [key: string]: {
    icon: React.ComponentType<any>
    textColor: string
    iconColor: string
    bgClass: string
    iconXColor?: string
    isBold: boolean
    isInformational: boolean
  }
} = {
  success: {
    icon: IconCheck,
    textColor: 'text-[#97BF4F]',
    iconColor: 'text-[#97BF4F]',
    bgClass: 'bg-[#EFF9DF]',
    isBold: true,
    isInformational: false
  },
  'minor-success': {
    icon: IconCheck,
    textColor: 'text-[#4893DA]',
    iconColor: 'text-[#4893DA]',
    bgClass: 'bg-[#D8E8F7]',
    isBold: true,
    isInformational: false
  },
  warning: {
    icon: IconAlertTriangle,
    textColor: 'text-[#FF9F43]',
    iconColor: 'text-[#FF9F43]',
    bgClass: 'bg-[#FFECD9]',
    isBold: true,
    isInformational: false
  },
  error: {
    icon: IconBan,
    textColor: 'text-[#EA5455]',
    iconColor: 'text-[#EA5455]',
    bgClass: 'bg-[#FBDDDD]',
    isBold: true,
    isInformational: false
  },
  'informational-danger': {
    icon: IconBan,
    textColor: 'text-[#817D8D]',
    iconColor: 'text-[#EA5455]',
    iconXColor: 'text-[#817D8D]',
    bgClass: 'bg-white',
    isBold: false,
    isInformational: true
  },
  'informational-warning': {
    icon: IconAlertTriangle,
    textColor: 'text-[#817D8D]',
    iconColor: 'text-[#FF9F43]',
    iconXColor: 'text-[#817D8D]',
    bgClass: 'bg-white',
    isBold: false,
    isInformational: true
  }
}

const ToastLayout = ({ message, type }: { message: string; type: keyof typeof toastTypes }) => {
  const { icon: IconComponent, textColor, iconColor, iconXColor, isBold } = toastTypes[type] || {}
  const closeIconColor = iconXColor || iconColor
  const bold = isBold ? 'font-bold' : ''

  return (
    <Box className='flex items-center w-full'>
      <Box className='flex-shrink-0 mr-2 w-6 h-6'>
        <IconComponent className={`${iconColor} w-full h-full`} />
      </Box>

      <Typography variant='body2' className={`flex-grow min-w-0 break-words ${bold} ${textColor}`}>
        {message}
      </Typography>

      <IconButton className='p-0 m-0 flex-shrink-0' onClick={() => toast.dismiss()} aria-label='Close'>
        <IconX className={`w-5 h-5 ${closeIconColor}`} />
      </IconButton>
    </Box>
  )
}

export const showToast = (message: string, type: keyof typeof toastTypes) => {
  const { bgClass } = toastTypes[type] || {}

  toast(<ToastLayout message={message} type={type} />, {
    icon: false,
    className: `px-4 py-2 rounded-lg shadow-md ${bgClass}`,
    closeButton: false,
    autoClose: 2000
  })
}
