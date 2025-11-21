import React from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { ResultantSingleFixture } from '../Home/Home';

export interface TeamInfo {
  name: string;
  shortName: string;
  primaryColor: string;
  secondaryColor: string;
}

interface MatchPreviewProps {
  fixture: ResultantSingleFixture;
  onTicketPress?: () => void;
}

const MatchPreview: React.FC<MatchPreviewProps> = ({ fixture, onTicketPress }) => {
  const stadium = fixture?.stadium ?? 'MetLife Stadium';
  const city = fixture?.city ?? 'New York City';
  const date = fixture?.date ?? 'TBD';
  const time = fixture?.time ?? 'TBD';

  // Convert API team objects into local TeamInfo for rendering (derive shortName and colors)
  const makeTeamInfo = (teamObj: ResultantSingleFixture['teamA'] | ResultantSingleFixture['teamB'], isHome = false): TeamInfo => {
      const nameFromApi = teamObj?.name ?? null;
      const nicknameFromApi = (teamObj as any)?.nickname ?? (teamObj as any)?.shortName ?? null;
      const name = nameFromApi ?? nicknameFromApi ?? (isHome ? 'Home' : 'Away');
      const shortSource = nicknameFromApi ?? name;
      const shortName = (shortSource || '').toString().replace(/\s+/g, '').slice(0, 3).toUpperCase() || (isHome ? 'HME' : 'AWY');
    const primaryColor = isHome ? '#2563EB' : '#DC2626';
    const secondaryColor = isHome ? '#1E3A8A' : '#991B1B';
    return { name, shortName, primaryColor, secondaryColor };
  };

  const homeTeam: TeamInfo = makeTeamInfo(fixture.teamA, true);
  const awayTeam: TeamInfo = makeTeamInfo(fixture.teamB, false);
  return (
    <View style={styles.card}>
          {/* Top match meta bar: gradient from home->away */}
          <View style={[styles.metaHeader]}>
            <Text style={[styles.metaHeading]}>Next Match</Text>
            <View style={[styles.metaBar] }>
              <Text style={styles.metaText}>{date}</Text>
              <Text style={styles.metaText}>{time}</Text>
            </View>
            
          </View>

      {/* Match body */}
      <View style={styles.body}>
        <View style={styles.teamSection}>
          {renderTeamBadge(homeTeam)}
          <Text style={styles.teamName}>{homeTeam.name}</Text>
          <Text style={[styles.teamTag, { backgroundColor: homeTeam.primaryColor }]}>Home</Text>
        </View>

        <View style={styles.vsSection}>
          <Text style={styles.vsText}>VS</Text>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Matchup</Text>
            <Text style={styles.statValue}>{homeTeam.shortName} vs {awayTeam.shortName}</Text>
            <Text style={[styles.statValue]} numberOfLines={0}>{stadium}</Text>
            <Text style={[styles.statLabel]}>{city}</Text>
          </View>
        </View>

        <View style={styles.teamSection}>
          {renderTeamBadge(awayTeam)}
          <Text style={styles.teamName}>{awayTeam.name}</Text>
          <Text style={[styles.teamTag, { backgroundColor: awayTeam.primaryColor }]}>Away</Text>
        </View>
      </View>

      {/* CTA */}
      {/* <TouchableOpacity style={styles.cta} activeOpacity={0.85} onPress={onTicketPress}>
        <Text style={styles.ctaText}>{'Tickets'}</Text>
      </TouchableOpacity> */}
    </View>
  );
};

export function renderTeamBadge(team: TeamInfo) {
  return (
    <LinearGradient
      colors={[team.primaryColor, team.secondaryColor]}
      style={styles.badge}
      start={{ x: 10, y: 0 }}
      end={{ x: 0.9, y: 0.9 }}
    >
      <Text style={styles.badgeText}>{team.shortName}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderWidth: 0,
    borderColor: '#E5E7EB',
    padding: 18,
    marginTop: 0,
    ...Platform.select({
      ios: {
        shadowColor: '#101828',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  metaHeader: {
    // borderWidth: 4, 
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  }, 
  metaHeading: {
    fontSize: 26,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'Roboto',
    color: '#111827',
  }, 
  metaBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12, 
    paddingVertical: 2,
    borderRadius: 8,
    width: '40%',
    alignContent: 'center',
    alignItems: 'center',
    bottom: 2,  
  },
  metaText: {
    fontSize: 12,
    color: '#1F2937',
    fontWeight: '900',
    paddingTop: 8, 
  },
  metaDivider: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '900',
    paddingTop: 8, 
  },
  metaTextOnGradient: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  body: {
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamSection: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
    justifyContent: 'center',
    textAlign: 'center',
  },
  badge: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 0,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: '800',
    letterSpacing: 1,
    textAlign: 'center'
  },
  teamName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
  },
  vsSection: {
    width: 160,
    alignItems: 'center',
    gap: 10,
  },
  vsText: {
    marginTop: 16, 
    fontSize: 26,
    fontWeight: '900',
    color: '#111827',
  },
  statBox: { 
    width: '100%',
    borderWidth: 0,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
    elevation: 0,
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
  metaLeft: { flex: 1, alignItems: 'flex-start', paddingLeft: 12 },
  metaCenter: { flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  metaRight: { flex: 1, alignItems: 'flex-end', paddingRight: 12 },
  metaTextSmall: { fontSize: 12 },
  metaDividerSmall: { fontSize: 12, marginHorizontal: 6 },
  cta: {
    marginTop: 20,
    backgroundColor: '#001f45',
    borderRadius: 12,
    borderWidth: 0,
    borderColor: '#E5E7EB',
    paddingVertical: 14,
    alignItems: 'center',
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default MatchPreview;
