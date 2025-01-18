/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias.canvas = false;

    return config;
  },
  reactStrictMode: true,

  async redirects() {
    return [
      {
        source: "/", // Halaman root
        destination: "/dashboard", // Ganti dengan halaman tujuan
        permanent: false, // Ubah ke true jika redirect permanen
      },
    ];
  },
};

module.exports = nextConfig;
