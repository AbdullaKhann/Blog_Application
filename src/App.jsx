import React, { useState } from 'react';
import './App.css';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';

function App() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="app-container">
      <div className="auth-wrapper">
        {isLogin ? (
          <LoginForm onSwitch={() => setIsLogin(false)} />
        ) : (
          <RegisterForm onSwitch={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  );
}

export default App;
