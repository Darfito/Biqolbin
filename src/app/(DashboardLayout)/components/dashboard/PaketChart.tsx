"use client";

import React from "react";
import dynamic from "next/dynamic";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import { ApexOptions } from "apexcharts";
import { JamaahInterface, KeuanganInterface } from "../../utilities/type";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface PaketPieChartProps {
  filteredKeuanganData: KeuanganInterface[];
}

const PaketPieChart = ({ filteredKeuanganData }: PaketPieChartProps) => {
  // Hitung jumlah jamaah berdasarkan jenis paket
  const paketCounts: Record<string, number> = filteredKeuanganData.reduce(
    (counts, jamaah) => {
      counts[jamaah.Paket.nama] = (counts[jamaah.Paket.nama] || 0) + 1;
      return counts;
    },
    {} as Record<string, number>
  );

  // Data untuk chart
  const labels = Object.keys(paketCounts);
  const series = Object.values(paketCounts);

  // Fungsi untuk menghasilkan warna dinamis
  const generateColors = (count: number): string[] => {
    const startColor = "#f39c29"; // Warna awal
    const endColor = "#475f86";   // Warna akhir

    const colors = [];
    for (let i = 0; i < count; i++) {
      // Menghasilkan interpolasi warna antara startColor dan endColor
      const color = `#${Math.floor(
        parseInt(startColor.slice(1), 16) + (parseInt(endColor.slice(1), 16) - parseInt(startColor.slice(1), 16)) * (i / count)
      ).toString(16)}`;
      colors.push(color);
    }
    return colors;
  };

  // Menghasilkan warna berdasarkan jumlah paket
  const colors = generateColors(labels.length);

  // Konfigurasi chart
  const optionsPieChart: ApexOptions = {
    labels: labels,
    chart: {
      type: "donut", // Mengubah dari pie menjadi donut
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
    },
    colors: colors, // Menyesuaikan warna dinamis berdasarkan data
    legend: {
      position: "bottom",
      fontSize: "14px",
      horizontalAlign: 'left',
      itemMargin: {
        horizontal: 10,
        vertical: 5,
      },
      markers: {
        shape: "circle", // Bentuk marker harus "circle" atau "square"
      },
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val} Jamaah`,
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "65%", // Mengecilkan ukuran donut
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total",
              formatter: () => `${series.reduce((a, b) => a + b, 0)} Jamaah`,
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: "14px",
        fontWeight: "bold",
      },
    },
  };

  return (
    <DashboardCard title="Kategori Paket Umroh">
      <div className="flex justify-center">
        <Chart options={optionsPieChart} series={series} type="donut" width="90%" height={392} />
      </div>
    </DashboardCard>
  );
};

export default PaketPieChart;
