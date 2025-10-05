'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Button from './Button';
import logo from '../assets/icons/logo-ong.svg';
import { apiService } from '../services/api';
import { authService } from '../services/auth';

interface AdminDashboardProps {
  user: any;
}

export default function AdminDashboard({ user }: AdminDashboardProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const token = authService.getToken();
      if (token) {
        await apiService.logout(token);
      }
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      authService.clearAuth();
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Image
                src={logo}
                alt="Logo Casa Los Lobos e Los Gatos"
                width={140}
                height={70}
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">Administrador</p>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold mb-2 text-[var(--ong-purple)]">
            Bem-vindo, {user?.name}! 👋
          </h2>
          <p className="text-gray-600">
            Painel de Administração - Gerencie os animais, padrinhos e doações da ONG.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Animais Totais</h3>
              <span className="text-3xl">🐕</span>
            </div>
            <p className="text-3xl font-bold text-[var(--ong-purple)]">45</p>
            <p className="text-sm text-gray-500 mt-1">Sob cuidado da ONG</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Padrinhos</h3>
              <span className="text-3xl">💜</span>
            </div>
            <p className="text-3xl font-bold text-[var(--ong-orange)]">28</p>
            <p className="text-sm text-gray-500 mt-1">Contribuindo ativamente</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Adoções</h3>
              <span className="text-3xl">🎉</span>
            </div>
            <p className="text-3xl font-bold text-[var(--ong-purple)]">12</p>
            <p className="text-sm text-gray-500 mt-1">Este mês</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Doações</h3>
              <span className="text-3xl">💰</span>
            </div>
            <p className="text-3xl font-bold text-[var(--ong-orange)]">R$ 12.5k</p>
            <p className="text-sm text-gray-500 mt-1">Arrecadado este mês</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-xl font-bold mb-4 text-[var(--ong-purple)]">
            Ações Rápidas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-[var(--ong-purple)] hover:bg-[var(--ong-purple-50)] transition-all">
              <div className="text-3xl mb-2">🐕</div>
              <p className="font-semibold text-gray-700">Gerenciar Animais</p>
            </button>
            <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-[var(--ong-purple)] hover:bg-[var(--ong-purple-50)] transition-all">
              <div className="text-3xl mb-2">👥</div>
              <p className="font-semibold text-gray-700">Gerenciar Padrinhos</p>
            </button>
            <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-[var(--ong-purple)] hover:bg-[var(--ong-purple-50)] transition-all">
              <div className="text-3xl mb-2">💰</div>
              <p className="font-semibold text-gray-700">Controlar Doações</p>
            </button>
            <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-[var(--ong-purple)] hover:bg-[var(--ong-purple-50)] transition-all">
              <div className="text-3xl mb-2">📊</div>
              <p className="font-semibold text-gray-700">Relatórios</p>
            </button>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold mb-4 text-[var(--ong-purple)]">
            Atividades Recentes
          </h3>
          <div className="space-y-4">
            <div className="flex items-start p-3 border-l-4 border-[var(--ong-purple)] bg-purple-50">
              <span className="text-2xl mr-3">🐕</span>
              <div>
                <p className="font-semibold text-gray-800">Novo animal resgatado</p>
                <p className="text-sm text-gray-600">Max, um labrador de 2 anos, foi resgatado hoje.</p>
                <p className="text-xs text-gray-500 mt-1">Há 2 horas</p>
              </div>
            </div>
            <div className="flex items-start p-3 border-l-4 border-[var(--ong-orange)] bg-orange-50">
              <span className="text-2xl mr-3">💜</span>
              <div>
                <p className="font-semibold text-gray-800">Novo padrinho cadastrado</p>
                <p className="text-sm text-gray-600">Maria Silva se tornou madrinha do Rex.</p>
                <p className="text-xs text-gray-500 mt-1">Há 5 horas</p>
              </div>
            </div>
            <div className="flex items-start p-3 border-l-4 border-[var(--ong-purple)] bg-purple-50">
              <span className="text-2xl mr-3">🎉</span>
              <div>
                <p className="font-semibold text-gray-800">Animal adotado</p>
                <p className="text-sm text-gray-600">Bella foi adotada pela família Santos.</p>
                <p className="text-xs text-gray-500 mt-1">Ontem</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
