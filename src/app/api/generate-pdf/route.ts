import puppeteer from "puppeteer";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Render HTML ke PDF
  await page.setContent(`
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th, td { border: 1px solid black; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        <h1>Kwitansi Berkah Biqolbin Salim</h1>
        <p>No. Kwitansi: <strong>01250002</strong></p>
        <p>Tanggal: 30/01/2025</p>
        <p>Kepada: Ibu Winarni</p>
        <p>Alamat: Nirwana Estate - Cikaret</p>
        <hr/>
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Kuantitas</th>
              <th>Harga</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Paket Umroh 9 Hari</td>
              <td>1</td>
              <td>Rp. 28.900.000,-</td>
              <td>Rp. 28.900.000,-</td>
            </tr>
            <tr>
              <td>Kereta Cepat</td>
              <td>1</td>
              <td>Rp. 750.000,-</td>
              <td>Rp. 750.000,-</td>
            </tr>
          </tbody>
        </table>
        <p style="text-align: right; font-weight: bold;">Total: Rp. 29.650.000,-</p>
      </body>
    </html>
  `);

  const pdf = await page.pdf({ format: "A4" });
  await browser.close();

  return new NextResponse(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=kwitansi.pdf",
    },
  });
}
