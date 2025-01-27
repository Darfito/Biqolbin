"use client";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { Icon } from "leaflet";
import { CabangInterface } from "../../utilities/type";

interface MapProps {
  cabangData: CabangInterface[];
}

const Map = ({ cabangData }: MapProps) => {
  console.log("cabangData di maps:", cabangData);
  const position: [number, number] = [-6.4779817163125175, 106.87439266483295]; // Koordinat dari Google Maps
  const position1: [number, number] = [-7.2636560024524375, 112.79715621175278];

  const customIcon = new Icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png", // URL marker icon
    iconSize: [25, 41], // size of the icon
    iconAnchor: [12, 41], // position of the icon
    popupAnchor: [1, -34], // position of the popup
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png", // shadow URL (optional)
    shadowSize: [41, 41], // shadow size
  });
  return (
    <MapContainer
      center={position}
      zoom={15}
      scrollWheelZoom={false}
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
            Latitude: {cabang.cabang_lat}, Longitude: {cabang.cabang_long}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;
