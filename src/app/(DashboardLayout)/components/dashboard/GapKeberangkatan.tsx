"use client";

import React, { useState } from "react";
import { Select, MenuItem } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import dynamic from "next/dynamic";
import { JamaahInterface, KeuanganInterface, StatusType } from "../../utilities/type";

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
      ? Array.from(
          new Set(
            filteredData
              .map((item) => {
                if (!item.created_at) return null;
                return new Date(item.created_at).toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                });
              })
              .filter((val): val is string => val !== null)
          )
        ).sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
      : ["W1", "W2", "W3", "W4"];

  // Definisikan groupedData di sini:
  const groupedData: { [key: string]: KeuanganInterface[] } = categories.reduce(
    (acc, category) => {
      acc[category] = filteredData.filter((item) => {
        if (!item.created_at) return false;
        if (month === "all") {
          const itemCategory = new Date(item.created_at).toLocaleString("default", {
            month: "long",
            year: "numeric",
          });
          return itemCategory === category;
        } else {
          const weekNumber = Math.min(Math.ceil(new Date(item.created_at).getDate() / 7), 4);
          return category === `W${weekNumber}`;
        }
      });
      return acc;
    },
    {} as { [key: string]: KeuanganInterface[] }
  );

  const statusCounts: Record<string, number[]> = {
    "Belum Dijadwalkan": Array(categories.length).fill(0),
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

    if (
      categoryIndex !== -1 &&
      statusCounts[item.statusPenjadwalan] !== undefined
    ) {
      statusCounts[item.statusPenjadwalan][categoryIndex]++;
    }
  });

  const seriescolumnchart = [
    {
      name: "Belum Dijadwalkan",
      data: statusCounts["Belum Dijadwalkan"],
      color: error,
    },
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
    tooltip: {
      theme: "dark",
      fillSeriesColor: false,
      custom: function({ series, seriesIndex, dataPointIndex, w }: any) {
        const categoryLabel = w.globals.labels[dataPointIndex];
        const dataForCategory = groupedData[categoryLabel] || [];
    
        // Kelompokkan data berdasarkan kombinasi status dan metode pembayaran
        const groupedCombo: Record<string, number> = dataForCategory.reduce((acc, item) => {
          const key = `${item.status}|${item.metodePembayaran}`;
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
    
        // Buat baris tabel untuk masing-masing kombinasi
        const tableRows = Object.entries(groupedCombo)
          .map(([key, count]) => {
            const [status, metode] = key.split("|");
            return `
              <tr>
                <td style="border: 1px solid #ccc; padding: 4px; text-align: center;">${status}</td>
                <td style="border: 1px solid #ccc; padding: 4px; text-align: center;">${metode}</td>
                <td style="border: 1px solid #ccc; padding: 4px; text-align: center;">${count}</td>
              </tr>
            `;
          })
          .join("");
    
        return `
          <div style="padding:10px; font-size:0.85rem;">
            <strong>${categoryLabel}</strong><br/>
            <table style="width:100%; border-collapse: collapse; margin-top:5px;">
              <thead>
                <tr>
                  <th style="border: 1px solid #ccc; padding: 4px;">Status</th>
                  <th style="border: 1px solid #ccc; padding: 4px;">Metode Pembayaran</th>
                  <th style="border: 1px solid #ccc; padding: 4px;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${tableRows}
              </tbody>
            </table>
          </div>
        `;
      },
      y: {
        formatter: (val: number) => `Rp. ${val.toLocaleString("id-ID")}`,
      },
    },
    
    
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
