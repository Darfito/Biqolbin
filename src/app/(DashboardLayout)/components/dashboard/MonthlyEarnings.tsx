import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useTheme } from '@mui/material/styles';
import { Stack, Typography, Avatar } from '@mui/material';
import { IconArrowDownRight } from '@tabler/icons-react';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';

const MonthlyEarnings = () => {
  // chart color
  const theme = useTheme();
  const progressBarColor = '#f18B04'; // Warna progress bar
  const trackColor = '#274371'; // Warna background/track

  // chart
  const optionsRadialBar: any = {
    chart: {
      type: 'radialBar',
      height: 200,
      sparkline: {
        enabled: true, // Menghilangkan elemen chart lainnya
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        track: {
          background: trackColor,
          strokeWidth: '100%',
        },
        hollow: {
          margin: 10,
          size: '60%',
        },
        dataLabels: {
          name: {
            show: false, // Menyembunyikan label nama
          },
          value: {
            fontSize: '18px',
            fontWeight: '700',
            color: theme.palette.text.primary,
            offsetY: 5,
            formatter: (val: number) => `${val}%`,
          },
        },
      },
    },
    fill: {
      colors: [progressBarColor], // Warna progress bar
    },
    stroke: {
      lineCap: 'round',
    },
    labels: ['Progress'], // Label untuk chart
  };
  
  const seriesRadialBar: any = [75]; // Nilai progress (75%)

  return (
    <DashboardCard
      title="Realisasi Pendapatan"
    >
      <>
        <Typography variant="h4" fontWeight="700" mt="-20px">
          Rp. 4.500.000
        </Typography>
        <Stack direction="row" spacing={1} my={1} alignItems="center">
          <Avatar sx={{ bgcolor: '#FDDFD9', width: 27, height: 27 }}>
            <IconArrowDownRight width={20} color="#FA896B" />
          </Avatar>
          <Typography variant="subtitle2" fontWeight="600">
            +9%
          </Typography>
          <Typography variant="subtitle2" color="textSecondary">
            last year
          </Typography>
        </Stack>
        <Chart options={optionsRadialBar} series={seriesRadialBar} type="radialBar" height={200} width={"100%"} />
      </>
    </DashboardCard>
  );
};

export default MonthlyEarnings;
