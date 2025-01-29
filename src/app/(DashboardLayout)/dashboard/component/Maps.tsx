"use client";

import "leaflet/dist/leaflet.css";
import dynamic from "next/dynamic"; // Dynamic import
import { Icon } from "leaflet";
import { CabangInterface } from "../../utilities/type";
import DashboardCard from "../../components/shared/DashboardCard";
import { useEffect, useState } from "react";

interface MapProps {
  cabangData: CabangInterface[];
}

// Lazy-load MapContainer and child components
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

const Map = ({ cabangData }: MapProps) => {
  const position: [number, number] = [-6.4779817163125175, 106.87439266483295]; // Koordinat dari Google Maps
  const [isClient, setIsClient] = useState(false);
  
  const customIcon = new Icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png", // URL marker icon
    iconSize: [25, 41], // size of the icon
    iconAnchor: [12, 41], // position of the icon
    popupAnchor: [1, -34], // position of the popup
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png", // shadow URL (optional)
    shadowSize: [41, 41], // shadow size
  });
  
  useEffect(() => {
    // Ensure this component is running on the client side
    setIsClient(true);
  }, []);

  if (!isClient) return null; // Prevent rendering on the server
  return (
    <DashboardCard title="Lokasi Cabang">
      <MapContainer
        center={position}
        zoom={15}
        scrollWheelZoom={true}
        style={{ height: "400px", width: "100%", borderRadius: "12px" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* Menggunakan map untuk iterasi cabangData */}
        {cabangData.map((cabang) => (
          <Marker
            key={cabang.id} // Menambahkan key unik untuk setiap marker
            position={[cabang.cabang_lat ?? 0, cabang.cabang_long ?? 0]} // Koordinat cabang
            icon={customIcon}
          >
            <Popup>
              {cabang.nama} - {cabang.alamatCabang} <br />
              Latitude: {cabang.cabang_lat},<br /> Longitude: {cabang.cabang_long}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </DashboardCard>
  );
};

export default Map;
