import React, { useState } from 'react';
import Header from './components/Header/Header';
import AdminLogin from './components/AdminLogin/AdminLogin';
import AdminDashboard, { TeamInfo } from './components/AdminDashboard/AdminDashboard';
import CreateTeamScreen from './components/AdminDashboard/CreateTeamScreen/CreateTeamScreen';
import PlanFixturesScreen from './components/AdminDashboard/PlanFixturesScreen/PlanFixturesScreen';

type AdminScreen = 'login' | 'dashboard' | 'createTeam' | 'planFixtures';

interface AdminAppProps {
  onLogoutFromAdmin: () => void;
}

export default function AdminApp({ onLogoutFromAdmin }: AdminAppProps) {
  const [screen, setScreen] = useState<AdminScreen>('login');
  const [teams, setTeams] = useState<TeamInfo[]>([]);

  const renderAdminContent = () => {
    if (screen === 'login') {
      return (
        <AdminLogin
          onClose={() => onLogoutFromAdmin()}
          onLoginSuccess={() => setScreen('dashboard')}
        />
      );
    }

    if (screen === 'dashboard') {
      return (
        <>
          <Header onNotificationLongPress={() => {}} showNotification={false} />
          <AdminDashboard
            onLogout={() => onLogoutFromAdmin()}
            onCreateTeam={() => setScreen('createTeam')}
            onPlanFixtures={() => setScreen('planFixtures')}
          />
        </>
      );
    }

    if (screen === 'planFixtures') {
      return (
        <>
          <Header onNotificationLongPress={() => {}} showNotification={false} />
          <PlanFixturesScreen
            onCancel={() => setScreen('dashboard')}
            teams={teams}
          />
        </>
      );
    }

    if (screen === 'createTeam') {
      return (
        <>
          <Header onNotificationLongPress={() => {}} showNotification={false} />
          <CreateTeamScreen
            onCancel={() => setScreen('dashboard')}
            onFinish={() => setScreen('dashboard')}
          />
        </>
      );
    }
  };

  return renderAdminContent();
}
