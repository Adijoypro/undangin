"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

interface MapPickerProps {
  initialLat?: number;
  initialLng?: number;
  onLocationChange: (lat: number, lng: number) => void;
}

// BUNGKUS SEMUA LEAFLET DI SINI BIAR GAK ERROR SSR
const LeafletWrapper = dynamic(
  async () => {
    const { MapContainer, TileLayer, Marker, useMap, useMapEvents } = await import("react-leaflet");
    const L = (await import("leaflet")).default;

    const customIcon = L.icon({
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    });

    // Komponen buat geser kamera peta otomatis
    function ChangeView({ center }: { center: [number, number] }) {
      const map = useMap();
      useEffect(() => {
        if (center && center[0] !== 0) {
          map.flyTo(center, 15, { animate: true, duration: 1.5 });
        }
      }, [center, map]);
      return null;
    }

    function LocationMarker({ position, setPosition, onLocationChange }: any) {
      const markerRef = React.useRef<any>(null);

      useMapEvents({
        click(e) {
          const { lat, lng } = e.latlng;
          setPosition([lat, lng]);
          onLocationChange(lat, lng);
        },
      });

      const eventHandlers = React.useMemo(
        () => ({
          dragend() {
            const marker = markerRef.current;
            if (marker != null) {
              const { lat, lng } = marker.getLatLng();
              setPosition([lat, lng]);
              onLocationChange(lat, lng);
            }
          },
        }),
        [setPosition, onLocationChange],
      );

      return position ? (
        <Marker 
          draggable={true} 
          eventHandlers={eventHandlers} 
          position={position} 
          ref={markerRef} 
          icon={customIcon} 
        />
      ) : null;
    }

    return function Map({ initialLat, initialLng, onLocationChange }: any) {
      const [position, setPosition] = useState<[number, number]>([initialLat || -6.2088, initialLng || 106.8456]);

      useEffect(() => {
        if (initialLat !== undefined && initialLng !== undefined) {
          setPosition([initialLat, initialLng]);
        }
      }, [initialLat, initialLng]);

      return (
        <MapContainer center={position} zoom={16} style={{ height: "100%", width: "100%" }} scrollWheelZoom={false}>
          <ChangeView center={position} />
          <TileLayer 
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
          <LocationMarker position={position} setPosition={setPosition} onLocationChange={onLocationChange} />
        </MapContainer>
      );
    };
  },
  { 
    ssr: false,
    loading: () => <div className="h-64 bg-gray-100 rounded-2xl animate-pulse flex items-center justify-center text-xs text-gray-400">Memuat Peta...</div>
  }
);

export default function MapPicker({ initialLat = -6.2088, initialLng = 106.8456, onLocationChange }: MapPickerProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return <div className="h-64 bg-gray-100 rounded-2xl animate-pulse flex items-center justify-center text-xs text-gray-400">Memuat Peta...</div>;

  return (
    <div className="h-64 w-full rounded-2xl overflow-hidden border-2 border-wedding-gold/10 relative z-10">
      <LeafletWrapper initialLat={initialLat} initialLng={initialLng} onLocationChange={onLocationChange} />
      <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur-sm p-2 rounded-lg text-[10px] text-wedding-gold font-bold z-[1000] text-center shadow-sm pointer-events-none border border-wedding-gold/20">
        📍 Seret (drag) jarum merah atau klik pada peta untuk memindahkan lokasi
      </div>
    </div>
  );
}
