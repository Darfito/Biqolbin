import { CardStatsHorizontalWithBorderProps } from "../../utilities/type";
import { IconUser, IconCreditCard,IconReceipt } from "@tabler/icons-react";


export const scoreCardKeuangan: CardStatsHorizontalWithBorderProps[] = [
  {
    title: 'Sudah Lunas',
    total: 1280,
    color: '#3E74FF',
    icon: IconUser,
  },
  {
    title: 'Sedang Menyicil',
    total: 1280,
    color: '#F54F63',
    icon: IconCreditCard,
  },
  {
    title: 'Belum Bayar',
    total: 1280,
    color: '#F5BD4F',
    icon: IconReceipt,
  },
]


