'use client'

import MuiCard from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { Box, useMediaQuery } from '@mui/material';
import type { CardProps } from '@mui/material/Card';
import { CardStatsHorizontalWithBorderProps } from '../../type';

// Tipe Props untuk Card, termasuk `color` dan `icon`
type Props = CardProps & {
  color: string; // Mengubah menjadi menerima warna CSS yang valid
  icon?: React.ElementType | null; // Menetapkan `icon` sebagai komponen React
};

const Card = styled(MuiCard)<Props>(({ color }) => ({
  transition: 'border 0.3s ease-in-out, box-shadow 0.3s ease-in-out, margin 0.3s ease-in-out',
  borderBottomWidth: '2px',
  borderBottomColor: color,
  '[data-skin="bordered"] &:hover': {
    boxShadow: 'none',
  },
  '&:hover': {
    borderBottomWidth: '3px',
    borderBottomColor: `${color} !important`,
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    marginBlockEnd: '-1px',
  },
}));

const ScoreCard = (props: CardStatsHorizontalWithBorderProps) => {
  // Props
  const { title, total, color, icon: Icon } = props; // Ambil icon sebagai komponen

  const isLgUp = useMediaQuery((theme: any) => theme.breakpoints.up('lg'));

  return (
    <Card className="w-full h-full" color={color || '#3E8DD8'} icon={'symbol'}>
      <CardContent>
        <Box sx={
          {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }
        }>
          <Box>
            <Typography variant="h5">{title}</Typography>
            <Typography variant="h2" color={color}>
              {total}
            </Typography>
          </Box>
          {isLgUp && (
            <Box>
              {/* Render ikon sebagai komponen */}
              {Icon && <Icon size={40} stroke={1.5} />}
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ScoreCard;
