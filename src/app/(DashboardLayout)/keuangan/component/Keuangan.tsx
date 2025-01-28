"use client";

import { Box, Card, Grid, Typography } from "@mui/material";
import PageContainer from "../../components/container/PageContainer";
import ScoreCard from "../../utilities/component/card/ScoreCard";
import FormKeuangan from "./FormKeuangan";

import KeuanganTable from "../../utilities/component/table/KeuanganTable";
import {
  CardStatsProps,
  JamaahInterface,
  KeuanganInterface,
  PaketInterface,
} from "../../utilities/type";
import { IconUser, IconProgress, IconReceipt } from "@tabler/icons-react";
import CustomHeader from "../../layout/header/CustomHeader";

export type KeuanganProps = {
  paketData: PaketInterface[];
  jamaahData: JamaahInterface[];
  keuanganData: KeuanganInterface[];
  scoreCardData: CardStatsProps[];
};

const iconMap: Record<string, React.ElementType> = {
  IconUser: IconUser,
  IconProgress: IconProgress,
  IconReceipt: IconReceipt,
};

const Keuangan = ({
  paketData,
  jamaahData,
  keuanganData,
  scoreCardData,
}: KeuanganProps) => {
  return (
    <>
      <CustomHeader
        titleModule={"Keuangan"}
        filters={[]}
        selectedFilter={""}
        handleFilterChange={function (filterName: string): void {
          throw new Error("Function not implemented.");
        }}
        cabangText={""}
      />
      <Box
        sx={{
          width: "100%",
        }}
      >
      </Box>
      <Grid
        sx={{
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
        container
        spacing={3}
      >
        {scoreCardData.map((data, index) => {
          const IconComponent = iconMap[data.icon] || null; // Pastikan null jika tidak valid
          return (
            <Grid item sm={12} md={5} lg={3} key={index}>
              <ScoreCard
                title={data.title}
                total={data.total}
                color={data.color}
                icon={IconComponent} // Kirim null jika tidak valid
              />
            </Grid>
          );
        })}
      </Grid>

      <PageContainer title="Keuangan">
        <Box sx={{ margin: "20px", display: "flex", justifyContent: "end" }}>
          <FormKeuangan paketData={paketData} jamaahData={jamaahData} />
        </Box>
        <Card sx={{ mt: 2 }}>
          <KeuanganTable data={keuanganData} />
        </Card>
      </PageContainer>
    </>
  );
};
export default Keuangan;
