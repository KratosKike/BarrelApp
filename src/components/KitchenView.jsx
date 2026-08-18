import React from 'react';

export default function KitchenView({ orders, onCompleteOrder }) {
  const pendingOrders = orders.filter(o => o.status === 'Pendiente');

  return (
    <div style={styles.card}>
      <h3>🍳 Panel de Cocina ({pendingOrders.length} pendientes)</h3>
      {pendingOrders.length === 0 ? (
        <p style={{ color: '#666' }}>No hay pedidos en espera.</p>
      ) : (
        <div style={styles.grid}>
          {pendingOrders.map(order => (
            <div key={order.id} style={styles.orderCard}>
              <div style={styles.orderHeader}>
                <strong>Mesa #{order.table}</strong>
                <span style={styles.time}>{order.time}</span>
              </div>
              <ul style={styles.list}>
                {order.items.map((item, idx) => <li key={idx}>• {item}</li>)}
              </ul>
              <button 
                onClick={() => onCompleteOrder(order.id)} 
                style={styles.btnDanger}
              >
                Despachar / Enviar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  card: { background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
  grid: { display: 'flex', flexDirection: 'column', gap: '15px' },
  orderCard: { border: '1px solid #e0e0e0', padding: '15px', borderRadius: '6px', backgroundColor: '#fff9e6' },
  orderHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px', borderBottom: '1px dashed #ccc', paddingBottom: '5px' },
  time: { color: '#666', fontSize: '14px' },
  list: { paddingLeft: '20px', margin: '0 0 15px 0' },
  btnDanger: { width: '100%', padding: '10px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }
};