
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { AuthProvider } from './components/AuthContext';
import StartupExperience from './components/StartupExperience';

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <StartupExperience>
      <App />
    </StartupExperience>
  </AuthProvider>
);