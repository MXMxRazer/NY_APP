import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AdminApp from './AdminApp';
import PublicApp from './PublicApp';

type AppSection = 'public' | 'admin';

export default function App() {
  const [section, setSection] = useState<AppSection>('public');

  return (
    <SafeAreaProvider>
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      {section === 'admin' ? (
        <AdminApp onLogoutFromAdmin={() => setSection('public')} />
      ) : (
        <PublicApp onAdminAccess={() => setSection('admin')} />
      )}
    </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
