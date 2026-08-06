import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { MainLayout } from './layouts/MainLayout/MainLayout';
import { ServerPage } from './pages/ServerPage';
import { DMsPage } from './pages/DMsPage';
import { ModalRoot } from './components/modals/ModalRoot';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProtectedRoute } from './components/ProtectedRoute';

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
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
