"use client";

import { Box, Card } from "@mui/material";
import PageContainer from "../../components/container/PageContainer";
import FormCMS from "./FormCMS";
import CMSTable from "../../utilities/component/table/CMS/CMSTable";
import { PaketInterface } from "../../utilities/type";
import { useState, useEffect } from "react";
import CustomHeader from "../../layout/header/CustomHeader";

export type CMSPageProps = {
  data: PaketInterface[];
  roleUser: string;
};

const CMS = ({ data, roleUser }: CMSPageProps) => {
  const [selectedYear, setSelectedYear] = useState<string | null>(
    new Date().getFullYear().toString()
  );
  const [selectedStatus, setSelectedStatus] = useState<boolean>(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Menunda render hingga komponen di-mount di klien
  }

  console.log("paket data sebelum di filter", data);
  console.log("selected year:", selectedYear);
  console.log("selected status:", selectedStatus);

  const filteredPaketData = data.filter((paket) => {
    if (!paket.created_at) return false;

    // Ambil tahun dari `created_at`
    const year = new Date(paket.created_at).getFullYear().toString();

    // Filter berdasarkan tahun dan statusAktif
    return year === selectedYear && paket.statusAktif === selectedStatus;
  });

  console.log("Paket data setelah difilter:", filteredPaketData);

  return (
    <>
      <CustomHeader
        titleModule="CMS"
        selectedFilter={selectedYear || ""}
        handleFilterChange={(year: string) => setSelectedYear(year)}
        selectedStatus={selectedStatus}
        handleStatusChange={() => setSelectedStatus((prev) => !prev)} // Toggle status
      />

      <Box sx={{ width: "100%" }}></Box>

      <PageContainer title="CMS">
        <Box sx={{ margin: "20px", display: "flex", justifyContent: "end" }}>
          <FormCMS mode="create" />
        </Box>
        <Card sx={{ mt: 3 }}>
          <CMSTable data={filteredPaketData} roleUser={roleUser} />
        </Card>
      </PageContainer>
    </>
  );
};

export default CMS;
