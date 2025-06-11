// src/Mapa.tsx
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '500px',
};

const center = {
  lat: 10.4674, // Caracas
  lng: -66.9036,
};

function Mapa({ pedidos }: { pedidos: any[] }) {
  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={7}>
        {pedidos.map((pedido) => (
          <Marker
            key={pedido.id}
            position={{ lat: pedido.lat, lng: pedido.lng }}
            title={`Pedido ${pedido.id} - ${pedido.estado}`}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
}

export default Mapa;
