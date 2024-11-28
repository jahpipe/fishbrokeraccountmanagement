import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Coordinates for Baybay City Public Market
const marketLocation = {
  lat: 10.6744,  // Latitude for Baybay City Public Market
  lng: 124.7987  // Longitude for Baybay City Public Market
};

const Location = () => {
  return (
    <div id="location" className="p-6 bg-gray-100">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Baybay City Public Market</h1>
      <div className="bg-white shadow-md rounded-lg">
        <MapContainer center={[marketLocation.lat, marketLocation.lng]} zoom={13} style={{ height: '400px', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={[marketLocation.lat, marketLocation.lng]}>
            <Popup>
              Baybay City Public Market
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
};

export default Location;
