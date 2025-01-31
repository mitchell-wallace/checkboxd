import React from 'react';
import { Container } from '@mui/material';
import './App.css'
import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';
import { TaskServiceProvider } from './contexts/TaskServiceContext';

function App() {
  return (
    <TaskServiceProvider>
        <Header />
        <Main />
        <Footer />
    </TaskServiceProvider>
  );
}

export default App;
