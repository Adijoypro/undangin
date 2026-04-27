"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

// Dynamic import Leaflet components for the simulation (read-only)
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });

interface MapSimulationProps {
  lat: number;
  lng: number;
  locationName: string;
}

export default function MapSimulation({ lat, lng, locationName }: MapSimulationProps) {
  const [isClient, setIsClient] = useState(false);
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    setIsClient(true);
    import("leaflet").then((mod) => {
      setL(mod.default);
    });
  }, []);

  if (!isClient || !L) return <div className="h-64 bg-gray-100 rounded-3xl animate-pulse flex items-center justify-center text-xs text-gray-400">Memuat Simulasi Peta...</div>;

  const customIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  return (
    <div className="h-64 w-full rounded-3xl overflow-hidden border-4 border-white shadow-xl relative z-10">
      <MapContainer 
        center={[lat, lng]} 
        zoom={16} 
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
        dragging={true}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <Marker position={[lat, lng]} icon={customIcon}>
          <Popup>{locationName}</Popup>
        </Marker>
      </MapContainer>
      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-gray-800 z-[1000] shadow-sm">
        📍 Titik Lokasi Acara
      </div>
    </div>
  );
}
