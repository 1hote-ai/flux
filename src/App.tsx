import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { MainLayout } from './layouts/MainLayout/MainLayout';
import { ModalRoot } from './components/modals/ModalRoot';
import { ProtectedRoute } from './components/ProtectedRoute';

const ServerPage = React.lazy(() => import('./pages/ServerPage').then(m => ({ default: m.ServerPage })));
const DMsPage = React.lazy(() => import('./pages/DMsPage').then(m => ({ default: m.DMsPage })));
const LoginPage = React.lazy(() => import('./pages/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage = React.lazy(() => import('./pages/RegisterPage').then(m => ({ default: m.RegisterPage })));

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<div className="flex h-screen items-center justify-center bg-gray-900 text-white">Loading...</div>}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Navigate to="/channels/@me" replace />} />
          
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/channels/@me" element={<DMsPage />} />
              <Route path="/channels/:serverId" element={<ServerPage />} />
              <Route path="/channels/:serverId/:channelId" element={<ServerPage />} />
              <Route path="/channels/:serverId/voice/:voiceId" element={<ServerPage />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

function App() {
  return (
    <>
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
      <ModalRoot />
    </>
  );
}

export default App;
