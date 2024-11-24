export type DataType = {
    id: number;
    avatar: string;
    fullName: string;
    post: string;
    email: string;
    city: string;
    start_date: string;
    salary: number;
    age: number;
    experience: string;
    status: number;
  };
  
  export type KeuanganType = {
    id: number;
    nama: string;
    metodePembayaran: metodePembayaranType
    jumlahTagihan: number
    sisaTagihan: number
    tanggalPembayaran: Date
    status: StatusType
    action?: string; // Optional field for action
  }
  
  export type metodePembayaranType = 'Cicilan' | 'Tunai' | 'Tabungan'

  export type StatusType = 'Belum Bayar' | 'Sedang Menyicil' | 'Sedang Menabung' | 'Lunas';