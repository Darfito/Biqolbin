
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useTheme } from '@mui/material/styles';
import { Grid, Stack, Typography, Avatar } from '@mui/material';
import { IconArrowUpLeft } from '@tabler/icons-react';

import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import { KeuanganInterface } from "../../utilities/type";

interface YearlyBreakupProps {
  keuanganData: KeuanganInterface[];
}

const YearlyBreakup = ({ keuanganData }: YearlyBreakupProps) => {
  // chart color
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const primarylight = '#ecf2ff';
  const successlight = theme.palette.success.light;

  // Helper function to calculate total keuntungan
  const calculateTotalKeuntungan = (data: any[]) => {
    return data.reduce((total: number, item: { totalTagihan: number; sisaTagihan: number; }) => {
      const keuntungan = item.totalTagihan - item.sisaTagihan;
      return total + keuntungan;
    }, 0);
  };

  // Filter data by year
  const currentYear = new Date().getFullYear();
  const lastYear = currentYear - 1;

  const currentYearData = keuanganData.filter(item => new Date(item.created_at).getFullYear() === currentYear);
  const lastYearData = keuanganData.filter(item => new Date(item.created_at).getFullYear() === lastYear);

  const totalKeuntunganCurrentYear = calculateTotalKeuntungan(currentYearData);
  const totalKeuntunganLastYear = calculateTotalKeuntungan(lastYearData);

  // Calculate the percentage change
  const percentageChange = totalKeuntunganLastYear > 0
    ? ((totalKeuntunganCurrentYear - totalKeuntunganLastYear) / totalKeuntunganLastYear) * 100
    : 0;

  // Chart data
  const optionscolumnchart: any = {
    chart: {
      type: 'donut',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: {
        show: false,
      },
      height: 155,
    },
    colors: [primary, primarylight, '#F9F9FD'],
    plotOptions: {
      pie: {
        startAngle: 0,
        endAngle: 360,
        donut: {
          size: '75%',
          background: 'transparent',
        },
      },
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
      fillSeriesColor: false,
    },
    stroke: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    responsive: [
      {
        breakpoint: 991,
        options: {
          chart: {
            width: 120,
          },
        },
      },
    ],
  };
  const seriescolumnchart: any = [
    totalKeuntunganCurrentYear, 
    totalKeuntunganLastYear, 
    totalKeuntunganCurrentYear + totalKeuntunganLastYear
  ];

  return (
    <DashboardCard title="Performa Tahunan">
      <Grid container spacing={3}>
        {/* column */}
        <Grid item xs={7} sm={7}>
          <Typography variant="h4" fontWeight="700">
            Rp. {totalKeuntunganCurrentYear.toLocaleString()}
          </Typography>
          <Stack direction="row" spacing={1} mt={1} alignItems="center">
            <Avatar sx={{ bgcolor: successlight, width: 27, height: 27 }}>
              <IconArrowUpLeft width={20} color="#39B69A" />
            </Avatar>
            <Typography variant="subtitle2" fontWeight="600">
              {percentageChange > 0 ? `+${percentageChange.toFixed(2)}%` : `${percentageChange.toFixed(2)}%`}
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              compared to last year
            </Typography>
          </Stack>
          <Stack spacing={3} mt={5} direction="row">
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar
                sx={{ width: 9, height: 9, bgcolor: primary, svg: { display: 'none' } }}
              ></Avatar>
              <Typography variant="subtitle2" color="textSecondary">
                {lastYear}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar
                sx={{ width: 9, height: 9, bgcolor: primarylight, svg: { display: 'none' } }}
              ></Avatar>
              <Typography variant="subtitle2" color="textSecondary">
                {currentYear}
              </Typography>
            </Stack>
          </Stack>
        </Grid>
        {/* column */}
        <Grid item xs={5} sm={5}>
          <Chart
            options={optionscolumnchart}
            series={seriescolumnchart}
            type="donut"
            height={150} width={"100%"}
          />
        </Grid>
      </Grid>
    </DashboardCard>
  );
};

export default YearlyBreakup;