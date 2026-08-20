import React, { useState } from 'react';
import { db } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

// Lista de ejemplo
const INSUMOS_COMUNES = [
  { id: 'carne', name: '🥩 Carne Hamburguesa' },
  { id: 'papas', name: '🍟 Papas Fritas (Bolsa)' },
  { id: 'queso', name: '🧀 Queso Cheddar' },
  { id: 'pan', name: '🍞 Pan de la Casa' },
  { id: 'salsa', name: '🥫 Salsa Especial' },
  { id: 'lechuga', name: '🥬 Lechuga Limpia' }
];


export default function ClientOrder({ onAddOrder }) {
  const [estacion, setEstacion] = useState('Línea Principal');
  const [pedidoItems, setPedidoItems] = useState({}); // Almacena { 'carne': 2, 'papas': 1 }
  const [loading, setLoading] = useState(false);

  // Modificar la cantidad de un insumo en la lista actual
  const cambiarCantidad = (id, cambio) => {
    setPedidoItems(prev => {
      const cantidadActual = prev[id] || 0;
      const nuevaCantidad = Math.max(0, cantidadActual + cambio);
      
      const copia = { ...prev };
      if (nuevaCantidad === 0) {
        delete copia[id];
      } else {
        copia[id] = nuevaCantidad;
      }
      return copia;
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validar si el pedido está vacío
    if (Object.keys(pedidoItems).length === 0) {
      return alert('Por favor, selecciona al menos un insumo para recargar.');
    }

    setLoading(true);
    // Formatear los ítems seleccionados en un array legible: ["2x 🥩 Carne Hamburguesa", "1x 🧀 Queso Cheddar"]
    const listaFormateada = Object.keys(pedidoItems).map(id => {
      const insumo = INSUMOS_COMUNES.find(i => i.id === id);
      return `${pedidoItems[id]}x ${insumo.name}`;
    });
    
 try {
      // Guardar el documento en la colección "pedidos" de Firestore
    await addDoc(collection(db, 'pedidos'), {
        table_number: `Estación: ${estacion}`, // Reutilizamos el campo para la zona de la cocina
        items: listaFormateada,
        status: 'Pendiente',
        created_at: new Date().toISOString()
      });

     // Limpiar el formulario tras el envío con éxito
      setPedidoItems({});
    } catch (error) {
      alert('Error al enviar el pedido: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.card}>
      <h3>🔄 Solicitar Recarga de Alimentos</h3>
      
      <div style={styles.inputGroup}>
        <label style={styles.label}>¿Qué zona de la cocina necesita el suministro?</label>
        <select 
          value={estacion} 
          onChange={(e) => setEstacion(e.target.value)} 
          style={styles.select}
          disabled={loading}
        >
          <option value="Línea Principal">Línea Principal (Plancha)</option>
          <option value="Zona de Freidoras">Zona de Freidoras</option>
          <option value="Ensaladas / Fríos">Ensaladas / Fríos</option>
          <option value="Repostería / Postres">Repostería / Postres</option>
        </select>
      </div>

      <div style={styles.gridInsumos}>
        {INSUMOS_COMUNES.map(insumo => {
          const cantidad = pedidoItems[insumo.id] || 0;
          return (
            <div key={insumo.id} style={styles.insumoCard}>
              <span style={styles.insumoName}>{insumo.name}</span>
              <div style={styles.counterGroup}>
                <button onClick={() => cambiarCantidad(insumo.id, -1)} style={styles.btnMinus} disabled={loading}>-</button>
                <span style={styles.counterValue}>{cantidad}</span>
                <button onClick={() => cambiarCantidad(insumo.id, 1)} style={styles.btnPlus} disabled={loading}>+</button>
              </div>
            </div>
          );
        })}
      </div>

      <button onClick={handleSubmit} style={styles.btnSuccess} disabled={loading}>
        {loading ? 'Enviando Alerta...' : '⚠️ Enviar Alerta de Recarga'}
      </button>
    </div>
  );
}

const styles = {
  card: { background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '20px' },
  label: { fontSize: '14px', fontWeight: 500, color: '#444' },
  select: { padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#fff' },
  gridInsumos: { display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' },
  insumoCard: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', border: '1px solid #eee', borderRadius: '6px', backgroundColor: '#fafafa' },
  insumoName: { fontSize: '16px', fontWeight: '500' },
  counterGroup: { display: 'flex', alignItems: 'center', gap: '12px' },
  btnMinus: { width: '32px', height: '32px', background: '#e0e0e0', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' },
  btnPlus: { width: '32px', height: '32px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' },
  counterValue: { fontSize: '18px', fontWeight: '600', minWidth: '20px', textAlign: 'center' },
  btnSuccess: { width: '100%', padding: '14px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }
};