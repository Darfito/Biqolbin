"use client";

import React, { useState } from "react";
import { useTheme } from "@mui/material/styles";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import dynamic from "next/dynamic";

// Menambahkan data dummy untuk jamaah
const dummyJamaahData = [
  { age: 22 },
  { age: 30 },
  { age: 28 },
  { age: 45 },
  { age: 23 },
  { age: 35 },
  { age: 50 },
  { age: 20 },
  { age: 38 },
  { age: 55 },
];

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const UmurCategoryChart = () => {
  // Kategorikan umur jamaah
  const categorizeAge = (age: number) => {
    if (age < 25) return "Under 25";
    if (age >= 25 && age <= 40) return "25-40";
    return "Above 40";
  };

  // Hitung jumlah jamaah berdasarkan kategori umur
  const ageCategories = ["Under 25", "25-40", "Above 40"];

  const ageCounts = ageCategories.map((category) => {
    return dummyJamaahData.filter(
      (item) => categorizeAge(item.age) === category
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
        height={370}
        width={"100%"}
      />
    </DashboardCard>
  );
};

export default UmurCategoryChart;
