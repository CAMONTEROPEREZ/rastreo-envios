import { GoogleMap, LoadScript } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: 4.60971,  // Bogotá por ejemplo
  lng: -74.08175
};

function Mapa() {
  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={12}
      >
        {/* Aquí puedes agregar marcadores si deseas */}
      </GoogleMap>
    </LoadScript>
  );
}

export default Mapa;
