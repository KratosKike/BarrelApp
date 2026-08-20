import React, { useState, useEffect } from 'react';
import { db } from './firebaseConfig';
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { auth } from './firebaseConfig';
import { signOut } from 'firebase/auth';
import Login from './components/Login';
import ClientOrder from './components/PedidoCocina';
import KitchenView from './components/EnvioCocina';

export default function App() {
  const [orders, setOrders] = useState([]);
  const [userRole, setUserRole] = useState(() => {
    return localStorage.getItem('resto_user_role') || null;
  });

  // Escuchar la base de datos de Firebase en tiempo real
  useEffect(() => {
    if (!userRole) return;

    // Crear la consulta ordenada por fecha de creación
    const q = query(collection(db, 'pedidos'), orderBy('created_at', 'asc'));

    // onSnapshot se encarga de escuchar los cambios en tiempo real automáticamente
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const formattedOrders = snapshot.docs.map(docSnap => {
        const data = docSnap.data();
        return {
          id: docSnap.id, // ID autogenerado de Firebase
          table: data.table_number,
          items: data.items,
          status: data.status,
          time: data.created_at ? new Date(data.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''
        };
      });
      setOrders(formattedOrders);
    }, (error) => {
      console.error("Error al escuchar Firestore: ", error);
    });

    // Desconectar el escuchador en tiempo real si el componente se desmonta
    return () => unsubscribe();
  }, [userRole]);

  const handleLoginSuccess = (role) => {
    setUserRole(role);
    localStorage.setItem('resto_user_role', role);
  };

 const handleLogout = async () => {
  try {
    await signOut(auth); // Cierra sesión en Firebase
    setUserRole(null);
    localStorage.removeItem('resto_user_role');
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
};
  // Función para cambiar el estado del pedido en Firebase
  const handleCompleteOrder = async (id) => {
    try {
      const pedidoRef = doc(db, 'pedidos', id);
      await updateDoc(pedidoRef, { status: 'Completado' });
    } catch (error) {
      alert('Error al actualizar el pedido: ' + error.message);
    }
  };

  if (!userRole) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
          <h1>🍽️ RestoFlow Staff App (Firebase)</h1>
          <p style={{ margin: 0, color: '#666' }}>
            Panel activo: <strong>{userRole === 'waiter' ? 'Mesero' : 'Cocina'}</strong>
          </p>
        </div>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          Cerrar Sesión
        </button>
      </header>

      <main style={styles.mainLayout}>
        {userRole === 'waiter' && <ClientOrder />}
        {userRole === 'kitchen' && (
          <KitchenView orders={orders} onCompleteOrder={handleCompleteOrder} />
        )}
      </main>
    </div>
  );
}

const styles = {
  container: { fontFamily: 'Segoe UI, sans-serif', padding: '20px', backgroundColor: '#f4f6f8', minHeight: '100vh' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #ddd', paddingBottom: '10px', marginBottom: '20px' },
  logoutBtn: { padding: '8px 16px', background: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  mainLayout: { display: 'grid', gridTemplateColumns: '1fr', gap: '20px', maxWidth: '800px', margin: '0 auto' }
};







/*import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Get started</h1>
          <p>
            Edit <code>src/App.jsx</code> and save to test <code>HMR</code>
          </p>
        </div>
        <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank">
                <img className="logo" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank">
                <img className="button-icon" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
*/