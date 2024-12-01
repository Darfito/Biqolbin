/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/', // Halaman root
        destination: '/dashboard', // Ganti dengan halaman tujuan
        permanent: false, // Ubah ke true jika redirect permanen
      },
    ];
  },
};

module.exports = nextConfig;
