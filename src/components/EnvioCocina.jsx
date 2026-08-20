import React from 'react';

export default function KitchenView({ orders, onCompleteOrder }) {
  const pendingRequests = orders.filter(o => o.status === 'Pendiente');

  return (
    <div style={styles.card}>
      <h3>📦 Panel de Abastecimiento ({pendingRequests.length} alertas activas)</h3>
      {pendingRequests.length === 0 ? (
        <p style={{ color: '#28a745', fontWeight: '500', textAlign: 'center', padding: '20px' }}>
          ✅ Todas las estaciones están completamente abastecidas.
        </p>
      ) : (
        <div style={styles.grid}>
          {pendingRequests.map(request => (
            <div key={request.id} style={styles.alertCard}>
              <div style={styles.alertHeader}>
                <span style={styles.estacionBadge}>{request.table}</span>
                <span style={styles.time}>{request.time}</span>
              </div>
              <ul style={styles.list}>
                {request.items.map((item, idx) => (
                  <li key={idx} style={styles.listItem}>⚠️ {item}</li>
                ))}
              </ul>
              <button 
                onClick={() => onCompleteOrder(request.id)} 
                style={styles.btnDeliver}
              >
                🚚 Enviar Suministro / Completado
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
  alertCard: { border: '2px solid #ffc107', padding: '15px', borderRadius: '8px', backgroundColor: '#fffdf6' },
  alertHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px dashed #ffc107', paddingBottom: '8px' },
  estacionBadge: { backgroundColor: '#fff0c2', color: '#856404', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold', fontSize: '14px' },
  time: { color: '#666', fontSize: '14px', fontWeight: '500' },
  list: { padding: '0', margin: '0 0 15px 0', listStyle: 'none' },
  listItem: { fontSize: '16px', fontWeight: '600', color: '#333', marginBottom: '6px' },
  btnDeliver: { width: '100%', padding: '12px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '15px', fontWeight: 'bold' }
};