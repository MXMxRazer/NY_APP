import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface SectionProps {
  title?: string;
  subtitle?: string;
  noOfDays?: number; 
  onViewAllPress?: () => void;
  showViewAll?: boolean;
}

const Section: React.FC<SectionProps> = ({
  title = 'title',
  subtitle = 'subtitle',
  noOfDays = 0,  
  onViewAllPress,
  showViewAll = true,
}) => {
  return (
    <LinearGradient
      colors={['#001f45', '#1e4c85ff']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* Main Content Container */}
      <View style={styles.contentContainer}>
        {/* Left Section - Title */}
        <View style={styles.leftSection}>
          <View style={styles.leftSectionBorder}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>
        </View>

        {/* Right Section - View All Button */}
        {showViewAll && (
          <View style={styles.rightSection}>
            <View style={styles.rightSectionBorder}>
              <TouchableOpacity
                style={styles.viewAllButton}
                onPress={onViewAllPress}
                activeOpacity={0.7}
              >
                <View style={styles.viewAllContent}>
                  <Text style={styles.viewAllText}>{noOfDays}</Text>
                  <Text style={styles.viewAllSubtext}>{noOfDays < 2 ? 'Day Left' : 'Days Left'}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 128,
    borderWidth: 0,
    borderColor: '#E5E7EB',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    padding: 16,
  },
  leftSection: {
    flex: 1,
    marginRight: 8,
  },
  leftSectionBorder: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
    letterSpacing: 1.5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: 'white',
    letterSpacing: 1,
  },
  rightSection: {   
    width: 85,
    marginLeft: 8,
    height: 70, 
  },
  rightSectionBorder: {
    flex: 1,
    borderWidth: 0,
    borderRadius: 8,
    overflow: 'hidden',
  },
  viewAllButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewAllContent: {
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 28,
    fontWeight: '600',
    color: 'white',
  },
  viewAllSubtext: {
    fontSize: 12,
    fontWeight: '400',
    color: '#DCFCE7',
    paddingBottom: 6, 
  },
});

export default Section;
