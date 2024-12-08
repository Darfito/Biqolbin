import { CardStatsHorizontalWithBorderProps } from "../../utilities/type";
import { IconUser, IconCreditCard,IconReceipt } from "@tabler/icons-react";


export const scoreCardKeuangan: CardStatsHorizontalWithBorderProps[] = [
  {
    title: 'Total Jamaah',
    total: 1280,
    color: '#3E74FF',
    icon: IconUser,
  },
  {
    title: 'Belum Proses',
    total: 1280,
    color: '#F54F63',
    icon: IconCreditCard,
  },
  {
    title: 'Sedang Proses',
    total: 1280,
    color: '#F5BD4F',
    icon: IconReceipt,
  },
]


