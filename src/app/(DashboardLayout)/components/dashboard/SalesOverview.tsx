import React, { useState } from "react";
import { Select, MenuItem } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import dynamic from "next/dynamic";
import { KeuanganInterface } from "../../utilities/type";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface SalesOverviewProps {
  keuanganData: KeuanganInterface[];
}

const SalesOverview = ({ keuanganData }: SalesOverviewProps) => {
  const [month, setMonth] = useState("all"); // Default: 'all'

  const handleChange = (event: any) => {
    setMonth(event.target.value);
  };

  // Filter data keuangan berdasarkan bulan (jika bulan tertentu dipilih)
  const filteredKeuanganData =
    month === "all"
      ? keuanganData // Jika "all", tampilkan semua data
      : keuanganData.filter((item) => {
          const createdAt = new Date(item.created_at);
          return createdAt.getMonth() + 1 === parseInt(month); // Filter berdasarkan bulan
        });

  // Kategori untuk chart
  const categories =
  month === "all"
    ? Array.from(new Set(filteredKeuanganData.map((item) => 
        new Date(item.created_at).toLocaleString("default", { month: "long", year: "numeric" })
      ))) // Kategori: Bulan/Tahun
    : ["W1", "W2", "W3", "W4"]; // Kategori: Mingguan


  // Hitung total tagihan dan sisa tagihan
  const totalEarnings = categories.map((_, index) => {
    if (month === "all") {
      const filteredByMonth = filteredKeuanganData.filter(
        (item) =>
          new Date(item.created_at).getMonth() === index // Sesuai bulan dalam loop
      );
      return filteredByMonth.reduce((total, item) => total + item.totalTagihan, 0);
    } else {
      const filteredByWeek = filteredKeuanganData.filter((item) => {
        const createdAt = new Date(item.created_at);
        const weekNumber = Math.ceil(createdAt.getDate() / 7); // Tentukan minggu keberapa
        return weekNumber === index + 1; // Sesuaikan minggu dalam loop
      });
      return filteredByWeek.reduce((total, item) => total + item.totalTagihan, 0);
    }
  });

  const totalExpenses = categories.map((_, index) => {
    if (month === "all") {
      const filteredByMonth = filteredKeuanganData.filter(
        (item) =>
          new Date(item.created_at).getMonth() === index // Sesuai bulan dalam loop
      );
      return filteredByMonth.reduce((total, item) => total + (item.sisaTagihan || 0), 0);
    } else {
      const filteredByWeek = filteredKeuanganData.filter((item) => {
        const createdAt = new Date(item.created_at);
        const weekNumber = Math.ceil(createdAt.getDate() / 7); // Tentukan minggu keberapa
        return weekNumber === index + 1; // Sesuaikan minggu dalam loop
      });
      return filteredByWeek.reduce((total, item) => total + (item.sisaTagihan || 0), 0);
    }
  });

  // Chart color
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;

  // Chart configuration
  const optionscolumnchart: any = {
    chart: {
      type: "bar",
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: "#adb0bb",
      toolbar: {
        show: true,
      },
      height: 370,
    },
    colors: [primary, secondary],
    plotOptions: {
      bar: {
        horizontal: false,
        barHeight: "60%",
        columnWidth: "42%",
        borderRadius: [6],
        borderRadiusApplication: "end",
        borderRadiusWhenStacked: "all",
      },
    },
    stroke: {
      show: true,
      width: 5,
      lineCap: "butt",
      colors: ["transparent"],
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    grid: {
      borderColor: "rgba(0,0,0,0.1)",
      strokeDashArray: 3,
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
    yaxis: {
      tickAmount: 4,
    },
    xaxis: {
      categories, // Kategori yang dinamis
      axisBorder: {
        show: false,
      },
    },
    tooltip: {
      theme: "dark",
      fillSeriesColor: false,
    },
  };

  const seriescolumnchart: any = [
    {
      name: "Total Tagihan",
      data: totalEarnings,
    },
    {
      name: "Sisa Tagihan",
      data: totalExpenses,
    },
  ];

  return (
    <DashboardCard
      title="Performa Keuangan"
      action={
        <Select
          labelId="month-dd"
          id="month-dd"
          value={month}
          size="small"
          onChange={handleChange}
        >
          <MenuItem value="all">All Months</MenuItem>
          <MenuItem value="1">January</MenuItem>
          <MenuItem value="2">February</MenuItem>
          <MenuItem value="3">March</MenuItem>
          <MenuItem value="4">April</MenuItem>
          <MenuItem value="5">May</MenuItem>
          <MenuItem value="6">June</MenuItem>
          <MenuItem value="7">July</MenuItem>
          <MenuItem value="8">August</MenuItem>
          <MenuItem value="9">September</MenuItem>
          <MenuItem value="10">October</MenuItem>
          <MenuItem value="11">November</MenuItem>
          <MenuItem value="12">December</MenuItem>
        </Select>
      }
    >
      <Chart
        options={optionscolumnchart}
        series={seriescolumnchart}
        type="bar"
        height={370}
        width={"100%"}
      />
    </DashboardCard>
  );
};

export default SalesOverview;
