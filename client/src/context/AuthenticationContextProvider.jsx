import React, { createContext, useState } from 'react';
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

export const AuthenticationContext = createContext();

const AuthenticationContextProvider = ({children}) => {

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const profilePic = 'https://images.unsplash.com/photo-1593085512500-5d55148d6f0d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=580&q=80';

  const inputs = {username: username, email: email, password: password, profilePic: profilePic};

  const navigate = useNavigate();

  const storeUserSession = (res) => {
    localStorage.setItem('userToken', res.data.token);
    localStorage.setItem('userId', res.data.user._id);
    localStorage.setItem('username', res.data.user.username);
    localStorage.setItem('email', res.data.user.email);
    localStorage.setItem('profilePic', res.data.user.profilePic);
    localStorage.setItem('posts', res.data.user.posts);
    localStorage.setItem('followers', res.data.user.followers);
    localStorage.setItem('following', res.data.user.following);
    navigate('/');
  };

  const login = async () => {
    try {
      const loginInputs = { email, password };
      const res = await axios.post('/login', loginInputs);
      storeUserSession(res);
    } catch (err) {
      console.error('Login failed');
    }
  };

  const register = async () => {
    try {
      const res = await axios.post('/register', inputs);
      storeUserSession(res);
    } catch (err) {
      console.error('Registration failed');
    }
  };

  const logout = async () => {
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        localStorage.removeItem(key);
      }
    }
    navigate('/landing');
  };

  return (
    <AuthenticationContext.Provider value={{login, register, logout, username, setUsername, email, setEmail, password, setPassword }} >{children}</AuthenticationContext.Provider>
  );
};

export default AuthenticationContextProvider;
