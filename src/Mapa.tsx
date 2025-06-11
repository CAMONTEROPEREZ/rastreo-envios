// Mapa.tsx
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

interface Pedido {
  id: number;
  cliente: string;
  estado: string;
  entrega: string;
  retraso: boolean;
  camion: string;
  ubicacion: {
    lat: number;
    lng: number;
  };
  ultimaActualizacion: string;
}

const containerStyle = {
  width: '100%',
  height: '500px'
};

const center = {
  lat: 10.4696,
  lng: -66.8035
};

function Mapa({ pedidos }: { pedidos: Pedido[] }) {
  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={8}
      >
        {pedidos.map((pedido) => (
          <Marker
            key={pedido.id}
            position={pedido.ubicacion}
            label={`${pedido.id}`}
            title={`Pedido #${pedido.id} - ${pedido.estado}`}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
}

export default Mapa;
