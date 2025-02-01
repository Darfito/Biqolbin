"use client";

import React, { useState } from "react";
import { Select, MenuItem } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import dynamic from "next/dynamic";
import { JamaahInterface, KeuanganInterface } from "../../utilities/type";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface GapKeberangkatanProps {
  keuanganData: KeuanganInterface[];
}

const GapKeberangkatan = ({ keuanganData }: GapKeberangkatanProps) => {
  const [month, setMonth] = useState("all");
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;
  const tertiary = theme.palette.success.main;
  const error = theme.palette.error.main;

  console.log("keuanganData:", keuanganData);

  const handleChange = (event: any) => {
    setMonth(event.target.value);
  };

  const filteredData =
    month === "all"
      ? keuanganData
      : keuanganData.filter((item) => {
          const createdAt = new Date(item.created_at ?? "");
          return createdAt.getMonth() + 1 === parseInt(month);
        });

  const categories =
    month === "all"
      ? Array.from(new Set(
          filteredData.map(
            (item) =>
              item.created_at &&
              new Date(item.created_at).toLocaleString("default", {
                month: "long",
                year: "numeric",
              })
          )
        ))
      : ["W1", "W2", "W3", "W4"];

  const statusCounts: Record<string, number[]> = {
    'Belum Dijadwalkan': Array(categories.length).fill(0),
    Dijadwalkan: Array(categories.length).fill(0),
    Berangkat: Array(categories.length).fill(0),
    Selesai: Array(categories.length).fill(0),
  };

  filteredData.forEach((item) => {
    if (!item.created_at || !item.statusPenjadwalan) return;
    const createdAt = new Date(item.created_at);
    const categoryIndex =
      month === "all"
        ? categories.indexOf(
            createdAt.toLocaleString("default", {
              month: "long",
              year: "numeric",
            })
          )
        : Math.min(Math.ceil(createdAt.getDate() / 7) - 1, 3);

    if (categoryIndex !== -1 && statusCounts[item.statusPenjadwalan] !== undefined) {
      statusCounts[item.statusPenjadwalan][categoryIndex]++;
    }
  });

  const seriescolumnchart = [
    { name: "Belum Dijadwalkan", data: statusCounts["Belum Dijadwalkan"], color: error },
    { name: "Dijadwalkan", data: statusCounts.Dijadwalkan, color: primary },
    { name: "Berangkat", data: statusCounts.Berangkat, color: secondary },
    { name: "Selesai", data: statusCounts.Selesai, color: tertiary },
  ];

  const optionscolumnchart: any = {
    chart: { type: "bar", toolbar: { show: true }, height: 370 },
    plotOptions: {
      bar: { horizontal: false, columnWidth: "42%", borderRadius: [6] },
    },
    stroke: { show: true, width: 5, colors: ["transparent"] },
    dataLabels: { enabled: true },
    legend: { show: true },
    xaxis: { categories },
    yaxis: { tickAmount: 4 },
    tooltip: { theme: "dark" },
  };

  return (
    <DashboardCard
      title="Statistik Keberangkatan"
      action={
        <Select value={month} size="small" onChange={handleChange}>
          <MenuItem value="all">All Months</MenuItem>
          {[...Array(12)].map((_, i) => (
            <MenuItem key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString("default", { month: "long" })}
            </MenuItem>
          ))}
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

export default GapKeberangkatan;
