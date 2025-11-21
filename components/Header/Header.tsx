import React from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface HeaderProps {
  // Optional props for customization
  showNotification?: boolean;
  onNotificationPress?: () => void;
  onNotificationLongPress?: () => void;
  showBadge?: boolean; // New prop to control badge visibility
}

const Header: React.FC<HeaderProps> = ({
  showNotification = true,
  onNotificationPress,
  onNotificationLongPress,
  showBadge = true, // Default to showing the badge
}) => {
  return (
    <View style={styles.container}>
      {/* Left: Logo with Badge */}
      <View style={styles.logoContainer}>
        <View style={styles.logoCircle}>
          <View style={styles.logoInner}>
            {/* <Ionicons name="shield" size={20} color="#10B981" /> */}
          </View>
        </View>
      </View>

      {/* Center: NY FC Text */}
      <View style={styles.centerContainer}>
        <Text style={styles.title}>NY FC</Text>
      </View>

      {/* Right: Notification Bell Button */}
      <View style={styles.rightContainer}>
        {showNotification && (
          <TouchableOpacity 
            style={styles.bellContainer}
            onPress={onNotificationPress}
            activeOpacity={0.7}
            onLongPress={onNotificationLongPress}
            delayLongPress={3000}
          >
            {/* <Ionicons 
              name="notifications-outline" 
              size={24} 
              color="white" 
            /> */}
            {showBadge && <View style={styles.badge} />}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 54,
    backgroundColor: '#001f45',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 0, // Remove status bar padding since we're hiding it
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  logoContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  logoCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  logoInner: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  centerContainer: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    letterSpacing: 0.5,
  },
  rightContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  bellContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 10,
    height: 10,
    borderRadius: 5,
    // backgroundColor: '#EF4444', // Red color
    borderWidth: 2,
    borderColor: 'transparent', // Match header background
  },
});

export default Header;
