import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FooterProps {
  activeTab?: 'home' | 'fixtures' | 'teams';
  onTabPress?: (tab: 'home' | 'fixtures' | 'teams') => void;
}

const Footer: React.FC<FooterProps> = ({ activeTab = 'home', onTabPress }) => {
  const tabs = [
    { key: 'home', label: 'Home', icon: 'home-outline', iconActive: 'home' },
    { key: 'fixtures', label: 'Fixtures', icon: 'calendar-outline', iconActive: 'calendar' },
    { key: 'teams', label: 'Teams', icon: 'people-outline', iconActive: 'people' },
  ];

  return (
    <View style={styles.container}>
      {tabs.map(t => {
        const selected = activeTab === (t.key as any);
        return (
          <TouchableOpacity
            key={t.key}
            style={styles.tab}
            onPress={() => onTabPress && onTabPress(t.key as any)}
            activeOpacity={0.75}
          >
            <Ionicons name={selected ? (t.iconActive as any) : (t.icon as any)} size={22} color={selected ? '#001f45' : '#6B7280'} />
            <Text style={[styles.label, selected && styles.labelActive]}>{t.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 64,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  tab: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  labelActive: {
    color: '#001f45',
    fontWeight: '600',
  },
});

export default Footer;
