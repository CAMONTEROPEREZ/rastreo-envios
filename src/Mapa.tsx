import {
  GoogleMap,
  LoadScript,
  Marker,
  DirectionsRenderer,
} from '@react-google-maps/api';
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
}

const containerStyle = {
  width: '100%',
  height: '500px',
  borderRadius: '20px',
};

const ubicacionCaracas = {
  lat: 10.4806,
  lng: -66.9036,
};

function Mapa({ pedidos, pedidoSeleccionado }: MapaProps) {
  const [directions, setDirections] = useState<{
    [pedidoId: number]: google.maps.DirectionsResult;
  }>({});
  const [posicionesCamiones, setPosicionesCamiones] = useState<{
    [pedidoId: number]: google.maps.LatLngLiteral;
  }>({});

  const pedidosAMostrar = pedidoSeleccionado
    ? [pedidoSeleccionado]
    : pedidos;

  // Calcular rutas desde Caracas para cada pedido
  useEffect(() => {
    const service = new google.maps.DirectionsService();

    pedidosAMostrar.forEach((pedido) => {
      service.route(
        {
          origin: ubicacionCaracas,
          destination: pedido.ubicacion,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === 'OK' && result) {
            setDirections((prev) => ({
              ...prev,
              [pedido.id]: result,
            }));
            // Inicializa posición del camión en el inicio de la ruta
            const start = result.routes[0].legs[0].start_location;
            setPosicionesCamiones((prev) => ({
              ...prev,
              [pedido.id]: {
                lat: start.lat(),
                lng: start.lng(),
              },
            }));
          }
        }
      );
    });
  }, [pedidosAMostrar]);

  // Simular movimiento de los camiones
  useEffect(() => {
    const interval = setInterval(() => {
      pedidosAMostrar.forEach((pedido) => {
        const dir = directions[pedido.id];
        if (!dir) return;

        const steps = dir.routes[0].legs[0].steps;
        const current = posicionesCamiones[pedido.id];
        let nextStep = steps.find((step) =>
          Math.abs(current.lat - step.start_location.lat()) < 0.001 &&
          Math.abs(current.lng - step.start_location.lng()) < 0.001
        );

        if (!nextStep) {
          nextStep = steps[0];
        }

        const end = nextStep.end_location;
        setPosicionesCamiones((prev) => ({
          ...prev,
          [pedido.id]: {
            lat: end.lat(),
            lng: end.lng(),
          },
        }));
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [directions, posicionesCamiones]);

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={pedidoSeleccionado?.ubicacion || ubicacionCaracas}
        zoom={pedidoSeleccionado ? 13 : 8}
        options={{
          styles: darkMapStyle,
          disableDefaultUI: false,
        }}
      >
        {pedidosAMostrar.map((pedido) => (
          <div key={pedido.id}>
            {directions[pedido.id] && (
              <DirectionsRenderer
                directions={directions[pedido.id]}
                options={{
                  polylineOptions: {
                    strokeColor: '#00ffff',
                    strokeWeight: 4,
                  },
                  suppressMarkers: true,
                }}
              />
            )}
            <Marker
              position={pedido.ubicacion}
              label={`#${pedido.id}`}
              title={`Destino de ${pedido.camion}`}
            />
            {posicionesCamiones[pedido.id] && (
              <Marker
                position={posicionesCamiones[pedido.id]}
                icon={{
                  url: 'https://img.icons8.com/fluency/48/truck.png',
                  scaledSize: new google.maps.Size(32, 32),
                }}
                title={`Camión ${pedido.camion}`}
              />
            )}
          </div>
        ))}
      </GoogleMap>
    </LoadScript>
  );
}

export default Mapa;

// Estilo oscuro para el mapa
const darkMapStyle = [
  {
    elementType: 'geometry',
    stylers: [{ color: '#212121' }],
  },
  {
    elementType: 'labels.icon',
    stylers: [{ visibility: 'off' }],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [{ color: '#757575' }],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#212121' }],
  },
  {
    featureType: 'administrative',
    elementType: 'geometry',
    stylers: [{ color: '#757575' }],
  },
  {
    featureType: 'landscape',
    elementType: 'geometry',
    stylers: [{ color: '#121212' }],
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [{ color: '#242f3e' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#38414e' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#212a37' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#746855' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#1f2835' }],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#2f3948' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#000000' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#3d3d3d' }],
  },
];
