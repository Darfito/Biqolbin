"use client";

import React, { useState } from "react";
import { useTheme } from "@mui/material/styles";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import dynamic from "next/dynamic";
import { JamaahInterface } from "../../utilities/type";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface UmurCategoryChartProps {
  filteredJamaahData: JamaahInterface[]; // Data jamaah dari luar
}

const UmurCategoryChart = ({filteredJamaahData}: UmurCategoryChartProps) => {
  const formatTanggalLahir = (tanggalLahir: string | Date): string => {
    return typeof tanggalLahir === "string"
      ? tanggalLahir // Jika sudah string, langsung gunakan
      : tanggalLahir.toISOString().split("T")[0]; // Jika Date, konversi ke YYYY-MM-DD
  };

  // Fungsi untuk menghitung umur dari tanggal lahir
  const hitungUmur = (tanggalLahir: string | Date): number => {
    const birthDate = new Date(formatTanggalLahir(tanggalLahir));
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--; // Jika belum melewati hari ulang tahun tahun ini, kurangi 1
    }
    return age;
  };

  // Kategorikan umur jamaah
  const categorizeAge = (age: number) => {
    if (age < 25) return "Dibawah 25";
    if (age >= 25 && age <= 40) return "25-40";
    return "Diatas 40";
  };

  // Hitung jumlah jamaah berdasarkan kategori umur
  const ageCategories = ["Dibawah 25", "25-40", "Diatas 40"];

  const ageCounts = ageCategories.map((category) => {
    return filteredJamaahData.filter(
      (item) => categorizeAge(hitungUmur(item.tanggalLahir)) === category
    ).length;
  });


  // Chart color
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;

  // Chart configuration
  const optionsBarChart: any = {
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
        columnWidth: "50%",
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
      enabled: true,
      formatter: (val: number) => {
        return `${val} Jamaah`; // Format label dengan jumlah jamaah
      },
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
      categories: ageCategories,
      axisBorder: {
        show: false,
      },
    },
    tooltip: {
      theme: "dark",
      fillSeriesColor: false,
      y: {
        formatter: (val: number) => {
          return `${val} Jamaah`; // Tooltip dengan jumlah jamaah
        },
      },
    },
  };

  const seriesBarChart: any = [
    {
      name: "Jumlah Jamaah",
      data: ageCounts,
    },
  ];

  return (
    <DashboardCard title="Kategori Umur Jamaah">
      <Chart
        options={optionsBarChart}
        series={seriesBarChart}
        type="bar"
        height={386}
        width={"100%"}
      />
    </DashboardCard>
  );
};

export default UmurCategoryChart;
