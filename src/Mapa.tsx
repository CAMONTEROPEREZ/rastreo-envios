import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px'
};

// Coordenadas simuladas (Bogotá)
const center = {
  lat: 4.6482837,
  lng: -74.247894
};

function Mapa() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={14}
    >
      <Marker position={center} />
    </GoogleMap>
  ) : <p>Cargando mapa...</p>;
}

export default Mapa;
