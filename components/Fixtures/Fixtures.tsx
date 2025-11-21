import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, ScrollView, View, TouchableOpacity, Image } from 'react-native';
import axios from 'axios';
import type { ResultantSingleFixture } from '../Home/Home';
import { LinearGradient } from 'expo-linear-gradient';

const FixtureCard: React.FC<{ fixture: ResultantSingleFixture }> = ({ fixture }) => {
  const fixtureDate = new Date(fixture.date);

  return (
    // <View style={styles.card}>
    //   <View style={styles.matchRow}>
    //     {fixture.teamA ? (
    //       fixture.teamA.logo ? (
    //         <Image source={{ uri: fixture.teamA.logo }} style={styles.teamLogo} />
    //       ) : (
    //         <View style={styles.placeholderLogoHome}>
    //           <Text style={styles.placeholderText}>{fixture.teamA.name}</Text>
    //         </View>
    //       )
    //     ) : null}
    //     <Text style={styles.vsText}>VS</Text>
    //     {fixture.teamB ? (
    //       fixture.teamB.logo ? (
    //         <View style={styles.placeholderLogoAway}>
    //           <Text style={styles.placeholderText}>{fixture.teamB.name}</Text>
    //         </View>
    //       ) : (
    //         // <Image source={{ uri: fixture.teamB.logo }} style={styles.teamLogo} />
    //         0
    //       )
    //     ) : null}
    //   </View>
    //   <Text style={styles.stadiumText}>
    //     {fixture.stadium}, {fixture.city}
    //   </Text>
    //   <Text style={styles.dateText}>
    //     {fixtureDate.toLocaleDateString()} at {fixture.time}
    //   </Text>
    // </View>

    <View style={styles.body}>
            <View style={styles.teamSection}>
              <LinearGradient
                colors={["#2563EB", "#1E3A8A"]}
                style={styles.badge}
                start={{ x: 10, y: 0 }}
                end={{ x: 0.9, y: 0.9 }}
              >
                <Text style={styles.badgeText}>{fixture.teamA?.nickname}</Text>
              </LinearGradient>
            </View>

      
            <View style={styles.vsSection}>
              <Text style={styles.vsText}>VS</Text>
              <View style={styles.statBox}>
                <Text style={[styles.statValue]} numberOfLines={0}>{fixture.stadium}</Text>
                <Text style={[styles.statLabel]}>{fixture.city}</Text>
              </View>
            </View>

            
            <View style={styles.teamSection}>
              <LinearGradient
                colors={["#DC2626", "#991B1B"]}
                style={styles.badge}
                start={{ x: 10, y: 0 }}
                end={{ x: 0.9, y: 0.9 }}
              >
                <Text style={styles.badgeText}>{fixture.teamB?.nickname}</Text>
              </LinearGradient>
            </View>
    </View>
  );
};

const Fixtures: React.FC = () => {
  const [fixtures, setFixtures] = useState<ResultantSingleFixture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  useEffect(() => {
    const fetchFixtures = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://ny-backend-xbdk.onrender.com/api/fixtures');
        const fixturesData = response.data.data || [];
        const fixturesWithTeams = await Promise.all(
          fixturesData.map(async (fixture: ResultantSingleFixture) => {
            const [resTeamA, resTeamB] = await Promise.all([
              axios.get(`https://ny-backend-xbdk.onrender.com/api/teams/${fixture.teamAId}`),
              axios.get(`https://ny-backend-xbdk.onrender.com/api/teams/${fixture.teamBId}`)
            ]);
            return {
              ...fixture,
              teamA: resTeamA.data.data,
              teamB: resTeamB.data.data,
            };
          })
        );
        setFixtures(fixturesWithTeams);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch fixtures:', err);
        setError('Failed to load fixtures');
      } finally {
        setLoading(false);
      }
    };

    fetchFixtures();
  }, []);

  const getFilteredFixtures = () => {
    const now = new Date();
    return fixtures.filter((fixture) => {
      const fixtureDate = new Date(`${fixture.date}T${fixture.time}`);
      return activeTab === 'upcoming' ? fixtureDate > now : fixtureDate <= now;
    });
  };

  if (loading) {
    return (
      <ScrollView>
        <Text style={{ padding: 20, textAlign: 'center' }}>Loading fixtures...</Text>
      </ScrollView>
    );
  }

  if (error) {
    return (
      <ScrollView>
        <Text style={{ padding: 20, textAlign: 'center', color: '#EF4444' }}>{error}</Text>
      </ScrollView>
    );
  }

  const filteredFixtures = getFilteredFixtures();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Fixtures</Text>
        <View style={styles.tabs}>
          <TouchableOpacity onPress={() => setActiveTab('upcoming')} style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}>
            <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>Upcoming</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab('past')} style={[styles.tab, activeTab === 'past' && styles.activeTab]}>
            <Text style={[styles.tabText, activeTab === 'past' && styles.activeTabText]}>Past</Text>
          </TouchableOpacity>
        </View>
      </View>
      {fixtures.length === 0 ? (
        <Text style={{ padding: 20, textAlign: 'center', fontSize: 28, fontWeight: 'bold' }}>No fixtures available</Text>
      ) : (
        filteredFixtures.length === 0 ? (
          <Text style={{ padding: 20, textAlign: 'center', fontSize: 18 }}>No {activeTab} fixtures available</Text>
        ) : (
          filteredFixtures.map(fixture => (
            <FixtureCard key={fixture.id} fixture={fixture} />
          ))
        )
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
    marginHorizontal: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    backgroundColor: '#0d1f50ea',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  tabs: {
    flexDirection: 'row',
  },
  tab: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 5,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
  },
  activeTab: {
    backgroundColor: '#00052f',
  },
  tabText: {
    fontSize: 12,
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  /////////////////////////////////////////////////////

  body: {
    borderWidth: 3,
    borderRadius: 16,
    borderColor: '#E5E7EB', 
    elevation: 2,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginVertical: 10,
    paddingVertical: 4, 
    paddingHorizontal: 14, 
    alignSelf: 'center', 
    flexDirection: 'row',
    marginTop: 8,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  teamSection: {
    alignItems: 'center',
    gap: 2,
    justifyContent: 'center',
    textAlign: 'center',
  },
  badge: {
    width: 80,
    height: 80,
    borderRadius: 55,
    borderWidth: 0,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '800',
    letterSpacing: 1,
    textAlign: 'center'
  },
  vsSection: {
    width: 160,
    alignItems: 'center',
    top: 20, 
    // backgroundColor: 'red', 
  },
  vsText: {
    fontSize: 26,
    fontWeight: '900',
    color: '#111827',
    zIndex: 10, 
  },
  statBox: { 
    top: -20, 
    width: '100%',
    borderWidth: 0,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginTop: 12,
    overflow: 'scroll',
  },
  teamTag: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
    textAlign: 'center',
  },
});

export default Fixtures;
