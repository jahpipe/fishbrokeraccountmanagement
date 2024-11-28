import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Rootlayout from './RootLayout/Rootlayout';
import LoginForm from './Components/LoginForm'; 
import Home from './Components/Home';
import NotFoundPage from './Components/NotFoundPage';
import Dashboard from './Components/Dashboard';
import ClientDashboard from './Components/ClientDashboard'; 

function App() {
  return (
    <Routes>
      <Route path="/" element={<Rootlayout />}>
        <Route index element={<Home />} />
      </Route>
      <Route path="login" element={<LoginForm />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/clientdashboard" element={<ClientDashboard />} /> {/* Add the route for ClientDashboard */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
