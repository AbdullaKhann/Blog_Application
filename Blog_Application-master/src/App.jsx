import React, { useState } from 'react';
import {Routes,Route} from 'react-router-dom'
import './App.css';
import axios from 'axios'
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Home from './components/Home'
import Postcard from './components/Postcard';
import Editor from './pages/Editor'
import Profile from './pages/Profile'
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import EditPost from './components/EditPost';
axios.defaults.baseURL='http://localhost:5000/user'
function App() {
return (
    <>
    <Routes>
      <Route path="/" element={<Navbar/>}/>
      <Route path='/login' element={<LoginForm/>}/>
      <Route path="/register" element={<RegisterForm/>}/>
      <Route path="/blog.com" element={<Home/>}/>
      <Route path="/editor" element={<Editor />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/dashboard" element={<Dashboard/>}/>
      <Route path="/posts/:id" element={<Postcard/>} />
      <Route path="/posts/:id/edit" element={<EditPost />} />
    </Routes>
    </>
  );
}

export default App;
