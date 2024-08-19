import React, { useState } from 'react';
import { Icon } from 'react-icons-kit';
import { user } from 'react-icons-kit/icomoon/user';
import { lock } from 'react-icons-kit/icomoon/lock';
import { eye } from 'react-icons-kit/icomoon/eye';
import { eyeBlocked } from 'react-icons-kit/icomoon/eyeBlocked';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Importar el hook de navegación
import './login.css';
import prueba from './logoastro.jpg';

const API_BASE_URL = 'http://localhost:5005/api/trainers';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();  // Inicializar el hook de navegación

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log('Intentando iniciar sesión con:', { email, password });

    try {
      const response = await axios.post(`${API_BASE_URL}/login`, {
        correoElectronico: email,
        contraseña: password,
      });
      console.log('Respuesta de inicio de sesión:', response.data);

      localStorage.setItem('trainerId', response.data.trainerId);
      alert('Inicio de sesión exitoso');
      navigate('/economia');  // Redirigir al usuario a la página de economía
    } catch (error) {
      console.error('Error al iniciar sesión:', error.response ? error.response.data : error);
      alert('Error al iniciar sesión');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    console.log('Intentando registrar con:', { name, email, password });

    try {
      const response = await axios.post(`${API_BASE_URL}/register`, {
        nombre: name,
        correoElectronico: email,
        contraseña: password,
      });
      console.log('Respuesta de registro:', response.data);

      alert('Registro exitoso');
      setIsRegister(false);
    } catch (error) {
      console.error('Error al registrar:', error.response ? error.response.data : error);
      alert('Error al registrar');
    }
  };

  return (
    <div className="login-container">
      <div className="login-title">
        <img src={prueba} alt="Astrofit Logo" className="login-logo" />
      </div>
      <form className="login-form" onSubmit={isRegister ? handleRegister : handleLogin}>
        {isRegister && (
          <div className="login-field">
            <Icon icon={user} className="login-icon" />
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="NOMBRE"
            />
          </div>
        )}
        <div className="login-field">
          <Icon icon={user} className="login-icon" />
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="USUARIO O CORREO"
          />
        </div>
        <div className="login-field">
          <Icon icon={lock} className="login-icon" />
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="CONTRASEÑA"
          />
          <span
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            <Icon icon={showPassword ? eyeBlocked : eye} />
          </span>
        </div>
        <button type="submit" className="login-submit-button">
          {isRegister ? 'REGISTRARSE' : 'INICIAR SESIÓN'}
        </button>
      </form>
      <div className="toggle-container">
        {isRegister ? (
          <p>
            ¿Ya tienes una cuenta?{' '}
            <span onClick={() => setIsRegister(false)}>Inicia sesión</span>
          </p>
        ) : (
          <p>
            ¿No tienes una cuenta?{' '}
            <span onClick={() => setIsRegister(true)}>Regístrate</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
