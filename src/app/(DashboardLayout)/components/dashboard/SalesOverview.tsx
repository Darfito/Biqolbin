"use client"

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

  const getWeekOfMonth = (date: Date): number => {
    const dayOfMonth = date.getDate(); // Tanggal hari ini
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1).getDay(); // Hari pertama bulan
    const adjustedDate = dayOfMonth + firstDayOfMonth; // Penyesuaian dengan hari pertama bulan
    const weekNumber = Math.ceil(adjustedDate / 7); // Hitung minggu keberapa

    // Batasi minggu ke-5 menjadi minggu ke-4
    return weekNumber > 4 ? 4 : weekNumber;
  };

  // Filter data keuangan berdasarkan bulan (jika bulan tertentu dipilih)
  const filteredKeuanganData =
    month === "all"
      ? keuanganData // Jika "all", tampilkan semua data
      : keuanganData.filter((item) => {
          const createdAt = new Date(item.created_at ?? "");
          return createdAt.getMonth() + 1 === parseInt(month); // Filter berdasarkan bulan
        });

  console.log("Month selected:", month);
  console.log("Filtered Keuangan Data:", filteredKeuanganData);

  // Kategori:
  // Jika mode "all", kategori adalah format "Month Year" (misalnya "February 2025").
  // Jika mode bulan tertentu, kategori adalah tetap ["W1", "W2", "W3", "W4"].
  const categories =
    month === "all"
      ? Array.from(
          new Set(
            filteredKeuanganData
              .map((item) => {
                if (!item.created_at) return null; // Abaikan item tanpa created_at
                return new Date(item.created_at).toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                });
              })
              .filter((val): val is string => val !== null) // Pastikan hanya string yang tersisa
          )
        ).sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
      : ["W1", "W2", "W3", "W4"];

  // Mengelompokkan data berdasarkan kategori
  const groupedData: { [key: string]: KeuanganInterface[] } = categories.reduce(
    (acc, category) => {
      acc[category] = filteredKeuanganData.filter((item) => {
        if (!item.created_at) return false;
        if (month === "all") {
          const itemCategory = new Date(item.created_at).toLocaleString("default", {
            month: "long",
            year: "numeric",
          });
          return itemCategory === category;
        } else {
          const weekNumber = getWeekOfMonth(new Date(item.created_at));
          return category === `W${weekNumber}`;
        }
      });
      return acc;
    },
    {} as { [key: string]: KeuanganInterface[] }
  );

  // Total Earnings (menggunakan totalTagihanBaru jika ada & bukan 0)
  const totalEarnings = categories.map((category) => {
    const filteredByCategory = filteredKeuanganData.filter((item) => {
      if (!item.created_at) return false;
      if (month === "all") {
        const itemCategory = new Date(item.created_at).toLocaleString("default", {
          month: "long",
          year: "numeric",
        });
        return itemCategory === category;
      } else {
        // Gunakan fungsi getWeekOfMonth untuk mendapatkan label "W1", "W2", dst.
        const weekNumber = getWeekOfMonth(new Date(item.created_at));
        return category === `W${weekNumber}`;
      }
    });

    return filteredByCategory.reduce((total, item) => {
      const tagihan =
        item.totalTagihanBaru && item.totalTagihanBaru !== 0
          ? item.totalTagihanBaru
          : item.totalTagihan;
      return total + tagihan;
    }, 0);
  });

  // Total Expenses (misalnya menggunakan sisaTagihan)
  const totalExpenses = categories.map((category) => {
    const filteredByCategory = filteredKeuanganData.filter((item) => {
      if (!item.created_at) return false;
      if (month === "all") {
        const itemCategory = new Date(item.created_at).toLocaleString("default", {
          month: "long",
          year: "numeric",
        });
        return itemCategory === category;
      } else {
        const weekNumber = getWeekOfMonth(new Date(item.created_at));
        return category === `W${weekNumber}`;
      }
    });

    return filteredByCategory.reduce((total, item) => total + (item.sisaTagihan || 0), 0);
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
      formatter: (val: number) => `Rp. ${val.toLocaleString("id-ID")}`,
    },
    legend: {
      show: true,
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
      custom: function({ series, seriesIndex, dataPointIndex, w }: any) {
        const categoryLabel = w.globals.labels[dataPointIndex];
        const dataForCategory = groupedData[categoryLabel] || [];
        
        const totalTagihan = dataForCategory.reduce((sum, item) => {
          const tagihan =
            item.totalTagihanBaru && item.totalTagihanBaru !== 0
              ? item.totalTagihanBaru
              : item.totalTagihan;
          return sum + tagihan;
        }, 0);
        
        const totalSisaTagihan = dataForCategory.reduce(
          (sum, item) => sum + (item.sisaTagihan || 0),
          0
        );
        
        const metodePembayaranUnik = Array.from(
          new Set(dataForCategory.map((item) => item.metodePembayaran))
        );
        
        return `
          <div style="padding:10px;">
            <strong>${categoryLabel}</strong><br/>
            Total Jamaah: ${dataForCategory.length}<br/>
            Total Tagihan: Rp. ${totalTagihan.toLocaleString("id-ID")}<br/>
            Sisa Tagihan: Rp. ${totalSisaTagihan.toLocaleString("id-ID")}<br/>
            Metode Pembayaran: ${metodePembayaranUnik.join(", ")}
          </div>
        `;
      },
      y: {
        formatter: (val: number) => `Rp. ${val.toLocaleString("id-ID")}`,
      },
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
        height={390}
        width={"100%"}
      />
    </DashboardCard>
  );
};

export default SalesOverview;
