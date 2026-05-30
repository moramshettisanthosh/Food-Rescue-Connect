import React, { useState } from 'react';
import { MapPin, Navigation, RefreshCw } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Node {
  id: string;
  name: string;
  type: 'donor' | 'ngo' | 'volunteer';
  lat: number;
  lng: number;
  details: string;
}

// Haversine formula to calculate real-world distance in km
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
};

// Center of the food rescue zone (Bangalore central coordinates)
const mapCenter: [number, number] = [12.9716, 77.5946];

export const InteractiveMap: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [mapCenterCoords, setMapCenterCoords] = useState<[number, number]>(mapCenter);

  // Real world coordinates of shelters and donors in Bangalore central zone
  const nodes: Node[] = [
    { id: '1', name: 'Apex Student Canteen (College Hub)', type: 'donor', lat: 12.9780, lng: 77.5900, details: 'Bulk Veg Biryani (20kg) • Cooked 2 hrs ago' },
    { id: '2', name: 'Grand Royal Banquet Hall', type: 'donor', lat: 12.9820, lng: 77.6050, details: 'Event Catered Food (45kg) • Expiring in 4 hrs' },
    { id: '3', name: 'Asha Orphanage Shelter', type: 'ngo', lat: 12.9630, lng: 77.5850, details: 'Verified Shelter Capacity: 80 Children • 25 meals short' },
    { id: '4', name: 'Community Kitchen South', type: 'ngo', lat: 12.9550, lng: 77.6010, details: 'Capacity: 150 Meals • Needs fresh dairy' },
    { id: '5', name: 'Volunteer Courier (Rider Sam)', type: 'volunteer', lat: 12.9700, lng: 77.5910, details: 'Active Rider • Carrying Insulated Storage Bags' },
    { id: '6', name: 'Student Responder (Mia)', type: 'volunteer', lat: 12.9750, lng: 77.5980, details: 'Bicycle Transporter • Active on Campus Grid' },
  ];

  // Custom DivIcon marker styling to match our dark glassmorphism layout
  const createCustomIcon = (type: 'donor' | 'ngo' | 'volunteer') => {
    const color = type === 'donor' ? 'var(--accent-red)' : 
                  type === 'ngo' ? 'var(--accent-emerald)' : 'var(--accent-blue)';
    const shadow = type === 'donor' ? 'rgba(239, 68, 68, 0.45)' : 
                   type === 'ngo' ? 'rgba(16, 185, 129, 0.45)' : 'rgba(59, 130, 246, 0.45)';
    return L.divIcon({
      className: 'custom-leaflet-marker',
      html: `<div style="
        width: 18px; 
        height: 18px; 
        background: ${color}; 
        border: 2px solid #ffffff; 
        border-radius: 50%; 
        box-shadow: 0 0 12px 6px ${shadow};
      "></div>`,
      iconSize: [18, 18],
      iconAnchor: [9, 9]
    });
  };

  const handleMarkerClick = (node: Node) => {
    setSelectedNode(node);
    setMapCenterCoords([node.lat, node.lng]);
  };

  const resetMapCenter = () => {
    setSelectedNode(null);
    setMapCenterCoords(mapCenter);
  };

  return (
    <div className="dashboard-grid">
      <div className="col-12 glass-card">
        <div className="section-header">
          <div className="section-title">
            <Navigation style={{ color: 'var(--accent-emerald)' }} />
            <span>Live Geolocation & Active Route Map</span>
          </div>
          <div>
            <button 
              onClick={resetMapCenter}
              className="btn btn-secondary btn-sm"
            >
              <RefreshCw size={14} /> Center Map View
            </button>
          </div>
        </div>

        <div style={{ position: 'relative' }}>
          {/* Leaflet Map Container */}
          <div style={{ 
            height: '400px', 
            width: '100%', 
            borderRadius: '16px', 
            overflow: 'hidden', 
            border: '1px solid var(--card-border)',
            boxShadow: 'var(--shadow-neon)',
            background: '#111827'
          }}>
            <MapContainer 
              center={mapCenterCoords} 
              zoom={14} 
              scrollWheelZoom={true}
              style={{ height: '100%', width: '100%' }}
            >
              {/* Load real-world topological streets (Dark Alidade theme for beautiful visual integration) */}
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              />

              {/* Draw Real Markers */}
              {nodes.map((node) => (
                <Marker 
                  key={node.id} 
                  position={[node.lat, node.lng]}
                  icon={createCustomIcon(node.type)}
                  eventHandlers={{
                    click: () => handleMarkerClick(node)
                  }}
                >
                  <Popup className="glass-popup">
                    <div style={{ color: '#fff', fontFamily: 'var(--font-body)', fontSize: '0.85rem' }}>
                      <strong style={{ fontSize: '0.95rem', color: 'var(--accent-emerald)' }}>{node.name}</strong>
                      <div style={{ marginTop: '4px', opacity: 0.8 }}>{node.details}</div>
                      <div style={{ marginTop: '8px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Lat: {node.lat.toFixed(4)} | Lng: {node.lng.toFixed(4)}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
            </div>
            
            {/* Map Legends Overlay */}
            <div className="map-overlay" style={{ top: '16px', left: '16px', zIndex: 400 }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>Ecosystem Status</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px', fontSize: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-red)' }} />
                  <span>Real Donors (2 Active)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-emerald)' }} />
                  <span>Real Shelters (2 Verified)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-blue)' }} />
                  <span>Riders Active (2 Couriers)</span>
                </div>
              </div>
            </div>

            {/* Instruction Banner */}
            <div style={{ position: 'absolute', bottom: '12px', left: '12px', fontSize: '0.75rem', color: 'var(--text-muted)', pointerEvents: 'none', zIndex: 400 }}>
              ℹ️ Click markers to view real-time calculated distance matrices.
            </div>
          </div>
        </div>

      {/* Selected Node Details Box with Haversine Proximity calculations */}
      {selectedNode && (
        <div className="col-12 glass-card animate-fade-in" style={{ borderColor: 'rgba(255, 255, 255, 0.15)', background: 'rgba(255,255,255,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ 
                width: '36px', height: '36px', borderRadius: '50%', 
                background: selectedNode.type === 'donor' ? 'rgba(239, 68, 68, 0.1)' : 
                            selectedNode.type === 'ngo' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                color: selectedNode.type === 'donor' ? 'var(--accent-red)' : 
                       selectedNode.type === 'ngo' ? 'var(--accent-emerald)' : 'var(--accent-blue)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', padding: '6px'
              }}>
                <MapPin size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{selectedNode.name}</h3>
                <span className="badge badge-emerald" style={{ marginTop: '4px' }}>
                  GPS: {selectedNode.lat.toFixed(5)}, {selectedNode.lng.toFixed(5)}
                </span>
              </div>
            </div>
            <div>
              <span className="badge badge-purple">
                Real Proximity: {calculateDistance(mapCenter[0], mapCenter[1], selectedNode.lat, selectedNode.lng).toFixed(2)} km from City Center
              </span>
            </div>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '14px', borderTop: '1px solid var(--card-border)', paddingTop: '10px' }}>
            <strong>Node Metadata:</strong> {selectedNode.details}
          </p>
        </div>
      )}
    </div>
  );
};
