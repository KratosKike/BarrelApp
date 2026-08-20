import React, { useState } from 'react';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';


export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validación de campos vacíos
    if (!username || !password) {
      setError('Por favor, introduce tus credenciales.');
      return;
    }

    setLoading(true);

    try {
      // Iniciar sesión real en Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userEmail = userCredential.user.email;

      // Determinar el rol según el correo electrónico
      if (userEmail.includes('repartidor@barriles.es')) {
        onLoginSuccess('waiter');
      } else if (userEmail.includes('pedir')) {
        onLoginSuccess('kitchen');
      } else {
        setError('Usuario no autorizado para este sistema.');
      }
    } catch (err) {
      // Traducir errores comunes de Firebase
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Correo o contraseña incorrectos.');
      } else {
        setError('Error al iniciar sesión: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.loginContainer}>
      <div style={styles.loginCard}>
        <div style={styles.avatarContainer}>
          <span style={styles.avatarIcon}>🍽️</span>
        </div>
        <h2 style={styles.title}>Barriles Staff</h2>
        <p style={styles.subtitle}>Inicia sesión con tu cuenta de empleado</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Correo Electrónico</label>
            <input 
              type="email" 
              placeholder="ej: mesero@restoflow.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              disabled={loading}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Contraseña</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              disabled={loading}
            />
          </div>

          {error && <p style={styles.errorText}>{error}</p>}

          <button type="submit" style={styles.submitBtn} disabled={loading}>
            {loading ? 'Verificando...' : 'Ingresar al Sistema'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  loginContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f4f6f8' },
  loginCard: { background: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', width: '100%', maxWidth: '400px', textAlign: 'center' },
  avatarContainer: { width: '60px', height: '60px', backgroundColor: '#007bff', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 15px auto' },
  avatarIcon: { fontSize: '28px' },
  title: { margin: '0 0 5px 0', fontSize: '24px', color: '#333', fontWeight: 600 },
  subtitle: { margin: '0 0 25px 0', fontSize: '14px', color: '#666' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '14px', fontWeight: 500, color: '#444' },
  input: { padding: '12px', fontSize: '16px', borderRadius: '6px', border: '1px solid #ccc', outline: 'none' },
  errorText: { color: '#dc3545', fontSize: '13px', margin: '0', fontWeight: 500 },
  submitBtn: { padding: '14px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px', fontWeight: 600, marginTop: '5px' }
};