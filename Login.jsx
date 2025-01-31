import React from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      console.log('Google Response:', credentialResponse); // Debug log
      
      if (!credentialResponse.credential) {
        console.error('No credential received from Google');
        return;
      }

      const response = await api.post('/auth/google', {
        credential: credentialResponse.credential
      });

      console.log('Backend response:', response.data);
      
      if (response.data.token) {
        login(response.data.token);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={() => {
          console.log('Login Failed');
        }}
      />
    </div>
  );
};

export default Login; 