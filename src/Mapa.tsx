import { GoogleMap, LoadScript, Marker, DirectionsRenderer } from '@react-google-maps/api';
import { useEffect, useState } from 'react';

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

interface MapaProps {
  pedidos: Pedido[];
  pedidoSeleccionado: Pedido | null;
  setDistancia: (val: string) => void;
  setDuracion: (val: string) => void;
}

const containerStyle = {
  width: '100%',
  height: '500px',
  borderRadius: '20px',
};

const ubicacionCentral = {
  lat: 10.25,
  lng: -67.2,
};

function Mapa({ pedidos, pedidoSeleccionado, setDistancia, setDuracion }: MapaProps) {
  const center = pedidoSeleccionado?.ubicacion || ubicacionCentral;
  const zoom = pedidoSeleccionado ? 13 : 8;

  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);

  useEffect(() => {
    if (pedidoSeleccionado && pedidoSeleccionado.estado === 'En camino') {
      const directionsService = new google.maps.DirectionsService();

      directionsService.route(
        {
          origin: { lat: 10.5, lng: -66.9 }, // Punto ficticio de salida
          destination: pedidoSeleccionado.ubicacion,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === 'OK' && result) {
            setDirections(result);

            // Extraer distancia y duración
            const leg = result.routes[0].legs[0];
            setDistancia(leg.distance?.text || '');
            setDuracion(leg.duration?.text || '');
          } else {
            console.error('Error al obtener la ruta:', status);
            setDirections(null);
            setDistancia('');
            setDuracion('');
          }
        }
      );
    } else {
      setDirections(null);
      setDistancia('');
      setDuracion('');
    }
  }, [pedidoSeleccionado]);

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={zoom}
        options={{
          styles: darkMapStyle,
          disableDefaultUI: false,
        }}
      >
        {(!pedidoSeleccionado ? pedidos : [pedidoSeleccionado]).map((pedido) => (
          <Marker
            key={pedido.id}
            position={pedido.ubicacion}
            label={`#${pedido.id}`}
            title={`Camión: ${pedido.camion}`}
          />
        ))}

        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              suppressMarkers: false,
              polylineOptions: {
                strokeColor: '#00FFFF',
                strokeOpacity: 0.7,
                strokeWeight: 5,
              },
            }}
          />
        )}
      </GoogleMap>
    </LoadScript>
  );
}

export default Mapa;

// Estilo oscuro del mapa
const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#212121' }] },
  { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#212121' }] },
  { featureType: 'administrative', elementType: 'geometry', stylers: [{ color: '#757575' }] },
  { featureType: 'landscape', elementType: 'geometry', stylers: [{ color: '#121212' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#38414e' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#212a37' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#746855' }] },
  { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#1f2835' }] },
  { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#2f3948' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#000000' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#3d3d3d' }] },
];
