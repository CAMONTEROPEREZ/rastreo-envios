import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  useJsApiLoader
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

const darkMapStyle: google.maps.MapTypeStyle[] = [
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
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#3d3d3d' }] }
];

function Mapa({ pedidos, pedidoSeleccionado }: MapaProps) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ['places']
  });

  const [directions, setDirections] = useState<{ [id: number]: google.maps.DirectionsResult }>({});
  const [posicionesCamiones, setPosicionesCamiones] = useState<{ [id: number]: google.maps.LatLngLiteral }>({});

  const pedidosAMostrar = pedidoSeleccionado ? [pedidoSeleccionado] : pedidos;

  useEffect(() => {
    if (!isLoaded) return;

    const service = new window.google.maps.DirectionsService();

    pedidosAMostrar.forEach((pedido) => {
      service.route(
        {
          origin: ubicacionCaracas,
          destination: pedido.ubicacion,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === 'OK' && result) {
            setDirections((prev) => ({ ...prev, [pedido.id]: result }));
            const start = result.routes[0].legs[0].start_location;
            setPosicionesCamiones((prev) => ({
              ...prev,
              [pedido.id]: { lat: start.lat(), lng: start.lng() },
            }));
          }
        }
      );
    });
  }, [isLoaded, pedidosAMostrar]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isLoaded) return;

      pedidosAMostrar.forEach((pedido) => {
        const dir = directions[pedido.id];
        if (!dir) return;

        const steps = dir.routes[0].legs[0].steps;
        const current = posicionesCamiones[pedido.id];

        let nextStep = steps.find(
          (step) =>
            Math.abs(current.lat - step.start_location.lat()) < 0.001 &&
            Math.abs(current.lng - step.start_location.lng()) < 0.001
        );

        if (!nextStep) nextStep = steps[0];

        const end = nextStep.end_location;
        setPosicionesCamiones((prev) => ({
          ...prev,
          [pedido.id]: { lat: end.lat(), lng: end.lng() },
        }));
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isLoaded, directions, posicionesCamiones]);

  if (!isLoaded) return <p style={{ color: '#fff' }}>Cargando mapa...</p>;

  return (
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
  );
}

export default Mapa;
