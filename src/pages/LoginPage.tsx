import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GlassPanel } from '../components/GlassPanel/GlassPanel';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { api } from '../utils/api';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await api.post('/auth/login', { email, password });
      localStorage.setItem('is_logged_in', 'true');
      navigate('/channels/@me');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-900 p-4" style={{ backgroundImage: "url('/src-tauri/icons/Square284x284Logo.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <GlassPanel className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">С возвращением!</h1>
            <p className="text-gray-400">Мы так рады видеть вас снова.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
                {error}
              </div>
            )}
            
            <Input
              label="E-MAIL"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <Input
              label="ПАРОЛЬ"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button type="submit" variant="primary" fullWidth disabled={isLoading}>
              {isLoading ? 'Вход...' : 'Войти'}
            </Button>

            <div className="text-sm text-gray-400 mt-4">
              Нужна учетная запись?{' '}
              <Link to="/register" className="text-indigo-400 hover:underline">
                Зарегистрироваться
              </Link>
            </div>
          </form>
        </GlassPanel>
      </motion.div>
    </div>
  );
};
