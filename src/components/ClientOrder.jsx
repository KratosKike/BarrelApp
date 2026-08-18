import React, { useState } from 'react';
import { db } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

export default function ClientOrder({ onAddOrder }) {
  const [table, setTable] = useState('');
  const [items, setItems] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!table || !items) return alert('Por favor, llena todos los campos');

    setLoading(true);
    const itemsArray = items.split(',').map(item => item.trim());
    
 try {
      // Guardar el documento en la colección "pedidos" de Firestore
      await addDoc(collection(db, 'pedidos'), {
        table_number: table,
        items: itemsArray,
        status: 'Pendiente',
        created_at: new Date().toISOString() // Guardamos la fecha en formato ISO
      });

      setTable('');
      setItems('');
    } catch (error) {
      alert('Error al enviar el pedido: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.card}>
      <h3>📋 Nuevo Pedido (Mesero)</h3>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input 
          type="number" 
          placeholder="Número de Mesa" 
          value={table} 
          onChange={(e) => setTable(e.target.value)} 
          style={styles.input}
        />
        <textarea 
          placeholder="Platillos (separados por comas. Ej: 2 Hamburguesas, 1 CocaCola)" 
          value={items} 
          onChange={(e) => setItems(e.target.value)} 
          style={styles.textarea}
        />
        <button type="submit" style={styles.btnSuccess}>Enviar a Cocina</button>
      </form>
    </div>
  );
}

const styles = {
  card: { background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
  form: { display: 'flex', flexDirection: 'column', gap: '10px' },
  input: { padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' },
  textarea: { padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc', minHeight: '60px' },
  btnSuccess: { padding: '12px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' }
};