import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useTheme } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import { KeuanganInterface } from "../../utilities/type";

interface MonthlyEarningsProps {
  keuanganData: KeuanganInterface[];
}

const MonthlyEarnings = ({ keuanganData }: MonthlyEarningsProps) => {
  // chart color
  const theme = useTheme();
  const progressBarColor = "#f18B04"; // Warna progress bar
  const trackColor = "#274371"; // Warna background/track

  // Helper function to calculate the percentage of remaining payment
  const calculateRemainingPaymentPercentage = (data: KeuanganInterface[]) => {
    const totalTagihan = data.reduce(
      (total, item) => total + item.totalTagihan,
      0
    );
    const sisaTagihan = data.reduce(
      (total, item) => total + (item.sisaTagihan || 0),
      0
    );
    const alreadyPaid = totalTagihan - sisaTagihan;
    const paymentPercentage = (alreadyPaid / totalTagihan) * 100;
    return 100 - paymentPercentage; // Return remaining percentage
  };

  // Calculate the remaining payment percentage
  const remainingPercentage = calculateRemainingPaymentPercentage(keuanganData);

  // Calculate the total tagihan and sisa tagihan
  const totalTagihan = keuanganData.reduce(
    (total, item) => total + item.totalTagihan,
    0
  );
  const sisaTagihan = keuanganData.reduce(
    (total, item) => total + (item.sisaTagihan || 0),
    0
  );

  // chart options
  const optionsRadialBar: any = {
    chart: {
      type: "radialBar",
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
          strokeWidth: "100%",
        },
        hollow: {
          margin: 10,
          size: "60%",
        },
        dataLabels: {
          name: {
            show: false, // Menyembunyikan label nama
          },
          value: {
            fontSize: "18px",
            fontWeight: "700",
            color: theme.palette.text.primary,
            offsetY: 5,
            formatter: (val: number) => `${val.toFixed(2)}%`, // Format to show percentage
          },
        },
      },
    },
    fill: {
      colors: [progressBarColor], // Warna progress bar
    },
    stroke: {
      lineCap: "round",
    },
    labels: ["Remaining Payment"], // Label untuk chart
  };

  const seriesRadialBar: any = [remainingPercentage]; // Nilai sisa pembayaran dalam persen

  return (
    <DashboardCard title="Realisasi Pendapatan">
      <>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography variant="subtitle2" color="textSecondary" >
              Sisa yang harus dibayar
            </Typography>
            <Typography variant="h6" fontWeight="700" sx={{ color: "#f18B04" }}>
              Rp. {sisaTagihan.toLocaleString()}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography variant="subtitle2" color="textSecondary">
              Target Total Tagihan
            </Typography>
            <Typography variant="h6" fontWeight="700" sx={{ color: "#274371" }}>
              Rp. {totalTagihan.toLocaleString()}
            </Typography>
          </Box>
        </Box>
        <Chart
          options={optionsRadialBar}
          series={seriesRadialBar}
          type="radialBar"
          height={200}
          width={"100%"}
        />
      </>
    </DashboardCard>
  );
};

export default MonthlyEarnings;

{
  /* <Stack direction="row" spacing={1} my={1} alignItems="center">
  <Avatar sx={{ bgcolor: '#FDDFD9', width: 27, height: 27 }}>
    <IconArrowDownRight width={20} color="#FA896B" />
  </Avatar>
  <Typography variant="subtitle2" fontWeight="600">
    +9%
  </Typography>
  <Typography variant="subtitle2" color="textSecondary">
    last year
  </Typography>
</Stack> */
}
