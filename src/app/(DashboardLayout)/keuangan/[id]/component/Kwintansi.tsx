"use client";
import { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  BiayaTambahanType,
  CicilanType,
  KeuanganInterface,
} from "@/app/(DashboardLayout)/utilities/type";

const getCurrentDate = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

type KwitansiProps = {
  data: KeuanganInterface;
};

const Kwitansi = ({ data }: KwitansiProps) => {
  const kwitansiRef = useRef<HTMLDivElement>(null);

  const totalTagihanFinal =
    data.totalTagihanBaru && data.totalTagihanBaru !== 0
      ? data.totalTagihanBaru.toLocaleString()
      : data.totalTagihan.toLocaleString();

  return (
    <div>
      {/* Elemen yang akan dikonversi ke PDF */}
      <div
        ref={kwitansiRef}
        className="border border-gray-300 w-[600px] mx-auto text-sm bg-white"
      >
        <div className="p-6">
          <div className="flex justify-around items-center mb-4">
            <img
              src="/images/logos/Biqolbin-Logo.png"
              alt="Logo"
              className="w-60"
            />
            <h1 className="text-center text-xl font-bold mb-4">Kwitansi</h1>
          </div>
          <div className="flex justify-between">
            <div className="flex flex-col w-1/2">
              <p>
                Kepada: <strong>{data.Jamaah.nama}</strong>
              </p>
              <p>
                Alamat: {data.Jamaah.alamat} - {data.Jamaah.provinsi}
              </p>
            </div>
            <div className="flex flex-col">
              <p>
                No. Kwitansi: <strong>{data.id}</strong>
              </p>
              <p>Tanggal: {getCurrentDate()}</p>
            </div>
          </div>

          <hr className="my-2" />
          <h2 className="text-lg font-semibold mt-4">Rincian Item</h2>
          <table className="w-full text-left border-collapse border border-gray-300 mt-2">
            <thead>
              <tr className="border-b bg-gray-200">
                <th className="p-2 border text-center">Item</th>
                <th className="p-2 border text-center">Harga</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-2 border text-center">{data.Paket.nama}</td>
                <td className="p-2 border text-center">
                  {" "}
                  Rp {data.totalTagihan.toLocaleString()}
                </td>
              </tr>
              {data.BiayaTambahan && data.BiayaTambahan.length > 0 ? (
                data.BiayaTambahan.map(
                  (tambahan: BiayaTambahanType, index: number) => (
                    <tr key={index} className="border-b">
                      <td className="p-2 border text-center">
                        {tambahan.nama}
                      </td>
                      <td className="p-2 border text-center">
                        Rp {tambahan.biaya.toLocaleString()}
                      </td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td colSpan={3} className="text-center p-2">
                    Tidak ada tambahan biaya
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <p className="text-right font-bold mt-4">
            Total: Rp{totalTagihanFinal}
          </p>
          {/* Tabel Cicilan */}

          {/* <h2 className="text-lg font-semibold mt-4">Rincian Pembayaran</h2>
          <table className="w-full text-left border-collapse border border-gray-300 mt-2">
            <thead>
              <tr className="border-b bg-gray-200">
                <th className="p-2 border text-center">Pembayaran Ke</th>
                <th className="p-2 border text-center">Tanggal Pembayaran</th>
                <th className="p-2 border text-center">Nominal Pembayaran</th>
              </tr>
            </thead>
            <tbody>
              {data.Cicilan && data.Cicilan.length > 0 ? (
                data.Cicilan.map((cicilan: CicilanType, index: number) => (
                  <tr key={index} className="border-b">
                    <td className="p-2 border text-center">
                      {cicilan.cicilanKe}
                    </td>
                    <td className="p-2 border text-center">
                      {cicilan.tanggalPembayaran}
                    </td>
                    <td className="p-2 border text-center">
                      Rp {cicilan.nominalCicilan.toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center p-2">
                    Tidak ada cicilan
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <p className="text-right font-bold mt-4">
            Total Lunas: Rp {totalTagihanFinal}
          </p> */}

          {/* Tanda Tangan */}
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
              <div className="border-t-2 border-[#f18b04]">
                <p className="text-center font-bold">Ahmad Fatih Masyuhdi</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-around border border-[#00366d] w-full h-[90px] bg-[#00366d] text-white">
          {/* alamat kantor */}
          <div className=" gap-2 flex justify-center items-center">
            <img
              src="/images/kwintansi/map-pin.svg"
              alt="Logo"
              className="w-8"
            />
            <div>
              <div>
                <strong>Kantor Pusat</strong>
              </div>
              <div>Taman Kenari Jagorawi Blok</div>
              <div>IX.A No.10</div>
            </div>
          </div>
          {/* nomor telepon */}
          <div className="gap-2 flex justify-center items-center">
            <img src="/images/kwintansi/phone.svg" alt="Logo" className="w-8" />
            <div>
              <div>
                <div>
                  <strong>Telepon</strong>
                </div>
                <div className="flex gap-2">
                  <div>
                    <div>081319060658</div>
                    <div>(Reti Dewi)</div>
                  </div>
                  <div>
                    <div>081398824346</div>
                    <div>(Ustad Fatih)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Kwitansi;
