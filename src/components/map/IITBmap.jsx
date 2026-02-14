import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet-polylinedecorator";
import Select from "react-select";
import axios from "axios";
import { campusLocations } from "../../data/campusLocations";

// Marker colors
const iconColors = { hostel: "blue", academic: "red", food: "green", facility: "orange" };
const createIcon = (color) =>
  new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

const campusBounds = [
  [19.125, 72.905],
  [19.142, 72.922],
];

export default function IITBCampusMap() {
  const mapRef = useRef();
  const [source, setSource] = useState(campusLocations[0].position);
  const [destination, setDestination] = useState(campusLocations[1].position);
  const [routeCoords, setRouteCoords] = useState([]);

  // Map campusLocations to React-Select options
  const options = campusLocations.map((loc) => ({
    value: loc.position,
    label: loc.name,
  }));

  useEffect(() => {
    if (!source || !destination) return;

    const fetchRoute = async () => {
      try {
        const apiKey = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImY2ZjQyMTUxZjRiOTQxZDg5MjQxM2Q1ZjUxY2M5ODU5IiwiaCI6Im11cm11cjY0In0="; // replace with your ORS key
        const url = "https://api.openrouteservice.org/v2/directions/driving-car/geojson";

        const body = {
          coordinates: [
            [source[1], source[0]], // [lon, lat]
            [destination[1], destination[0]],
          ],
        };

        const res = await axios.post(url, body, {
          headers: {
            Authorization: apiKey,
            "Content-Type": "application/json",
          },
        });

        const coords = res.data.features[0].geometry.coordinates.map(
          ([lon, lat]) => [lat, lon]
        );
        setRouteCoords(coords);

        if (mapRef.current) {
          const bounds = L.latLngBounds(coords);
          mapRef.current.fitBounds(bounds, { padding: [50, 50] });
        }
      } catch (err) {
        console.warn("ORS route failed, using demo route", err);

        // Demo fallback route
        const demoRoute = [
          source,
          [(source[0] + destination[0]) / 2, (source[1] + destination[1]) / 2],
          destination,
        ];
        setRouteCoords(demoRoute);

        if (mapRef.current) {
          const bounds = L.latLngBounds(demoRoute);
          mapRef.current.fitBounds(bounds, { padding: [50, 50] });
        }
      }
    };

    fetchRoute();
  }, [source, destination]);

  // Arrows along route
  useEffect(() => {
    if (!routeCoords.length || !mapRef.current) return;
    const map = mapRef.current;

    map.eachLayer((layer) => {
      if (layer.options && layer.options.patterns) map.removeLayer(layer);
    });

    const polyline = L.polyline(routeCoords, { color: "blue", weight: 5 }).addTo(map);

    L.polylineDecorator(polyline, {
      patterns: [
        {
          offset: "5%",
          repeat: "10%",
          symbol: L.Symbol.arrowHead({ pixelSize: 8, pathOptions: { color: "blue", fillOpacity: 1 } }),
        },
      ],
    }).addTo(map);
  }, [routeCoords]);

  return (
    <div className="flex flex-col gap-4">
      {/* Searchable Dropdowns */}
      <div className="flex flex-col md:flex-row gap-4 z-10 bg-white p-2 rounded shadow">
        <div className="flex-1">
          <label className="block mb-1 font-semibold">Source</label>
          <Select
            options={options}
            defaultValue={options[0]}
            onChange={(selected) => setSource(selected.value)}
            menuPlacement="auto"
            menuPosition="fixed"
            isSearchable={true} // <-- Enables typing search
            placeholder="Type to search source..."
          />
        </div>
        <div className="flex-1">
          <label className="block mb-1 font-semibold">Destination</label>
          <Select
            options={options}
            defaultValue={options[1]}
            onChange={(selected) => setDestination(selected.value)}
            menuPlacement="auto"
            menuPosition="fixed"
            isSearchable={true} // <-- Enables typing search
            placeholder="Type to search destination..."
          />
        </div>
      </div>

      {/* Map */}
      <div style={{ height: "80vh", width: "100%" }}>
        <MapContainer
          center={source}
          zoom={16}
          maxBounds={campusBounds}
          minZoom={15}
          style={{ height: "100%", width: "100%" }}
          whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {campusLocations.map((loc, idx) => (
            <Marker
              key={idx}
              position={loc.position}
              icon={createIcon(iconColors[loc.category])}
            >
              <Popup>{loc.name}</Popup>
            </Marker>
          ))}

          <Marker position={source}>
            <Popup>Source</Popup>
          </Marker>
          <Marker position={destination}>
            <Popup>Destination</Popup>
          </Marker>

          {routeCoords.length > 0 && <Polyline positions={routeCoords} color="blue" />}
        </MapContainer>
      </div>
    </div>
  );
}
