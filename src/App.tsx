import { useEffect, useState } from 'react';
import './App.css';
import Mapa from './Mapa';

interface Pedido {
  id: number;
  Cliente: string;
  estado: string;
  entrega: string;
  retraso: boolean;
}

function App() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://rastreo-envios-api.onrender.com/pedidos')
      .then((res) => res.json())
      .then((data) => {
        setPedidos(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al traer pedidos:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container">
      <h1 className="titulo">📦 Rastreo de Envíos</h1>
      {loading ? (
        <p>Cargando pedidos...</p>
      ) : (
        pedidos.map((pedido) => (
          <div className="tarjeta" key={pedido.id}>
            <h2>Pedido #{pedido.id}</h2>
            <p><strong>Cliente:</strong> {pedido.Cliente}</p>
            <p><strong>Estado:</strong> {pedido.estado}</p>
            <p><strong>Entrega programada:</strong> {pedido.entrega}</p>
            <p>
              <strong>¿Retraso?:</strong> {pedido.retraso ? '⚠️ Sí' : '✅ No'}
            </p>
          </div>
        ))
      )}

      {/* Aquí va el componente de mapa */}
      <Mapa pedidos={pedidos} />
    </div>
  );
}

export default App;
