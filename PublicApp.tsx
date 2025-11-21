import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './components/Home/Home';
import Fixtures from './components/Fixtures/Fixtures';
import Teams from './components/Teams/Teams';

interface PublicAppProps {
  onAdminAccess: () => void;
}

export default function PublicApp({ onAdminAccess }: PublicAppProps) {
  const [activeTab, setActiveTab] = useState<'home' | 'fixtures' | 'teams'>('home');

  const renderCurrentView = () => {
    switch (activeTab) {
      case 'home':
        return <Home />;
      case 'fixtures':
        return <Fixtures />;
      case 'teams':
        return <Teams />;
      default:
        return <Home />;
    }
  };

  return (
    <View style={styles.container}>
      <Header onNotificationLongPress={onAdminAccess} />
      <View style={styles.content}>
        {renderCurrentView()}
      </View>
      <Footer activeTab={activeTab} onTabPress={setActiveTab} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
});
