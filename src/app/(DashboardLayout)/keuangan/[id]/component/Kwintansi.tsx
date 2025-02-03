import {
  CicilanType,
  KeuanganInterface,
} from "@/app/(DashboardLayout)/utilities/type";

type KwitansiProps = {
  data: KeuanganInterface;
};

const Kwitansi = ({ data }: KwitansiProps) => {
  return (
    <div className="p-6 border border-gray-300 w-[600px] mx-auto text-sm">
      <div className="flex justify-around items-center mb-4 ">
        <img
          src="/images/logos/Biqolbin-Logo.png"
          alt="Logo"
          className="w-40"
        />
        <h1 className="text-center text-xl font-bold mb-4">
          Kwitansi Berkah Biqolbin Salim
        </h1>
      </div>
      <p>
        No. Kwitansi: <strong>{data.id}</strong>{" "}
        {/* Gunakan ID sebagai nomor kwitansi */}
      </p>
      <p>Tanggal: {data.created_at}</p>
      <p>Kepada: {data.Jamaah.nama}</p>
      <p>Alamat: {data.Jamaah.alamat}</p>
      <hr className="my-2" />

      {/* Tabel Cicilan */}
      <h2 className="text-lg font-semibold mt-4">Rincian Pembayaran</h2>
      <table className="w-full text-left border-collapse border border-gray-300 mt-2">
        <thead>
          <tr className="border-b bg-gray-200">
            <th className="p-2 border text-center">Cicilan Ke</th>
            <th className="p-2 border text-center">Tanggal Pembayaran</th>
            <th className="p-2 border text-center">Nominal Cicilan</th>
            {/* <th className="p-2 border">Lampiran</th> */}
          </tr>
        </thead>
        <tbody>
          {data.Cicilan && data.Cicilan.length > 0 ? (
            data.Cicilan.map((cicilan: CicilanType, index: number) => (
              <tr key={index} className="border-b">
                <td className="p-2 border text-center">{cicilan.cicilanKe}</td>
                <td className="p-2 border text-center">
                  {cicilan.tanggalPembayaran}
                </td>
                <td className="p-2 border text-center">
                  Rp {cicilan.nominalCicilan.toLocaleString()}
                </td>
                {/* <td className="p-2 border text-center">
                  {cicilan.lampiran ? (
                    <a
                      href={cicilan.lampiran}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      Lihat
                    </a>
                  ) : (
                    "-"
                  )}
                </td> */}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center p-2">
                Tidak ada cicilan
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Total Tagihan */}
      <p className="text-right font-bold mt-4">
        Total: Rp{" "}
        {data.totalTagihanBaru?.toLocaleString() ||
          data.totalTagihan.toLocaleString()}
      </p>
      <div className="w-full flex justify-end">
        <div className="w-[200px] h-[150px] mt-4">
          <div className="flex">
            <div className="relative">
              <img
                src="/images/kwintansi/ttdKwintansi.png"
                alt="tanda tangan"
                className="w-40"
              />
              <img
                src="/images/kwintansi/stamp-BBS.png"
                alt="stempel"
                className="w-[250px] absolute top-[-38px] left-[60px]"
              />
            </div>
          </div>
          <div className=" border-t-2 border-[#f18b04]">
            <p className="text-center font-bold">Ahmad Fatih Masyuhdi</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Kwitansi;
