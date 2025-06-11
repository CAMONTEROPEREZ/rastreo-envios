import { useState } from 'react';
import './App.css';
import Mapa from './Mapa';

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

const pedidosEjemplo: Pedido[] = [
  {
    id: 1,
    cliente: 'Carlos Pérez',
    estado: 'En camino',
    entrega: '2025-06-11T13:00:00',
    retraso: false,
    camion: 'Camión Alfa',
    ubicacion: { lat: 10.4696, lng: -66.8035 }, // Caracas
    ultimaActualizacion: '2025-06-11T11:30:00'
  },
  {
    id: 2,
    cliente: 'Lucía Ramírez',
    estado: 'Entregado',
    entrega: '2025-06-10T16:00:00',
    retraso: false,
    camion: 'Camión Beta',
    ubicacion: { lat: 10.2264, lng: -67.4735 }, // Maracay
    ultimaActualizacion: '2025-06-10T15:45:00'
  },
  {
    id: 3,
    cliente: 'Pedro Gutiérrez',
    estado: 'Con demoras',
    entrega: '2025-06-11T12:00:00',
    retraso: true,
    camion: 'Camión Gamma',
    ubicacion: { lat: 10.162, lng: -67.9999 }, // Valencia
    ultimaActualizacion: '2025-06-11T10:15:00'
  },
  {
    id: 4,
    cliente: 'Mariana Díaz',
    estado: 'Esperando recogida',
    entrega: '2025-06-11T14:00:00',
    retraso: false,
    camion: 'Camión Delta',
    ubicacion: { lat: 10.503, lng: -66.916 }, // Caracas (centro)
    ultimaActualizacion: '2025-06-11T09:00:00'
  },
  {
    id: 5,
    cliente: 'Andrés León',
    estado: 'En revisión logística',
    entrega: '2025-06-12T11:00:00',
    retraso: false,
    camion: 'Camión Épsilon',
    ubicacion: { lat: 10.24, lng: -67.6 },
    ultimaActualizacion: '2025-06-11T08:00:00'
  }
];

function App() {
  const [pedidos] = useState<Pedido[]>(pedidosEjemplo);

  const calcularTiempoRestante = (entrega: string): string => {
    const entregaTime = new Date(entrega).getTime();
    const ahora = new Date().getTime();
    const diffMs = entregaTime - ahora;
    const diffHrs = Math.floor(diffMs / 3600000);
    const diffMin = Math.floor((diffMs % 3600000) / 60000);
    return `${diffHrs}h ${diffMin}min`;
  };
  return (
  <div className="app-container dark-mode">
    <h1 className="titulo">📦 Rastreo de Envíos</h1>

    <div className="contenido">
      <div className="tarjetas">
        {pedidos.map((pedido: Pedido) => (
          <div className="tarjeta" key={pedido.id}>
            {/* ...contenido del pedido... */}
          </div>
        ))}
      </div>

      <div className="mapa-container">
        <Mapa pedidos={pedidos} />
      </div>
    </div>
  </div>
);




export default App;
