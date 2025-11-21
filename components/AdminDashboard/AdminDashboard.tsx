import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import axios from 'axios';

export interface TeamInfo {
  id: string;
  name: string;
  logo: string;
  nickname: string;
}

export interface Fixture {
  id: string;
  teamAId?: string | null;
  teamBId?: string | null;
  date: string;
  time: string;
  stadium: string;
}

interface AdminDashboardProps {
  onCreateTeam?: () => void;
  onPlanFixtures?: () => void;
  onLogout?: () => void;
  teams?: TeamInfo[];
  fixtures?: Fixture[];
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onCreateTeam,
  onPlanFixtures,
  onLogout,
}) => {

  const [teams, setTeams] = React.useState<TeamInfo[]>([]);
  const [fixtures, setFixtures] = React.useState<Fixture[]>([]);

  useEffect(() => {
    handleCalls(setTeams, true); 
    handleCalls(setFixtures, false); 
  }, []);


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.topRow}>
        <View style={{ flex: 1 }} />
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={onCreateTeam}>
            <Text style={styles.actionButtonText}>Create Teams</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.secondary]} onPress={onPlanFixtures}>
            <Text style={[styles.actionButtonText, styles.secondaryText]}>Plan Fixtures</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Dashboard Snapshot:</Text>
        <View style={styles.todoList}>
          {['Modification of Teams', 'Modification of Fixtures', 'Detailed Preview of Data Flow'].map(
            (item) => (
              <View key={item} style={styles.todoItem}>
                <View style={styles.todoDot} />
                <Text style={styles.todoText}>{item}</Text>
              </View>
            ),
          )}
        </View>
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Overview</Text>
        <Text style={styles.panelSubtitle}>
          Bishal's Admin Dashboard: Current Preview
        </Text>
        <View style={styles.metricsRow}>
          <MetricCard label="Teams" value={teams.length.toString()} />
          <MetricCard label="Fixtures" value={fixtures.length.toString()} />
          <MetricCard label="Tasks" value="0" />
        </View>
      </View>

      {teams.length > 0 && (
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Registered Teams</Text>
          <View style={styles.teamList}>
            {teams.map((team) => (
              <View key={`${team.name}-${team.nickname}`} style={styles.teamCard}>
                <View style={styles.teamLogo}>
                  <Text style={styles.teamLogoText}>
                    {team.nickname.slice(0, 3).toUpperCase()}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.teamName}>{team.name}</Text>
                  <Text style={styles.teamNickname}>{team.nickname}</Text>
                  {/* <Text style={styles.teamLogoUrl}>{team.logo}</Text> */}
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {fixtures && fixtures.length > 0 && (
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Planned Fixtures</Text>
          <View style={{ marginTop: 12, gap: 12, overflow: 'hidden' }}>
            {fixtures.map((fx) => {
              const teamA = fx.teamAId != null ? teams.find((t) => t.id === fx.teamAId) : null;
              const teamB = fx.teamBId != null ? teams.find((t) => t.id === fx.teamBId) : null;
              return (
                <View key={fx.id} style={styles.fixtureCard}>
                  <View style={styles.fixtureTeams}>
                    <Text style={styles.fixtureTeamName}>{teamA ? teamA.name : 'TBD'}</Text>
                    <Text style={styles.vs}>vs</Text>
                    <Text style={styles.fixtureTeamName}>{teamB ? teamB.name : 'TBD'}</Text>
                  </View>
                  <Text style={styles.fixtureMeta}>{fx.date} • {fx.time}</Text>
                  <Text style={styles.fixtureMeta}>{fx.stadium}</Text>
                </View>
              );
            })}
          </View>
        </View>
      )}

      {onLogout && (
        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const handleCalls = async (setter: React.Dispatch<any>, isTeam: Boolean) => {
  const API_URL = `https://ny-backend-xbdk.onrender.com/api/${isTeam ? 'teams' : 'fixtures'}`;
  try {
    const response = await axios.get(API_URL);
    const data = JSON.parse(JSON.stringify(response.data));
    return setter(data.data);
  } catch (error: any) {
    console.error('GET API Error:', error.message);
  }
};

const MetricCard = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.metricCard}>
    <Text style={styles.metricValue}>{value}</Text>
    <Text style={styles.metricLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 24,
    gap: 24,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    backgroundColor: '#001f45',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 999,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  secondary: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#001f45',
  },
  secondaryText: {
    color: '#001f45',
  },
  panel: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  panelTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  panelSubtitle: {
    marginTop: 6,
    color: '#6B7280',
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  metricCard: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
  },
  metricLabel: {
    marginTop: 4,
    color: '#6B7280',
    textTransform: 'uppercase',
    fontSize: 12,
    letterSpacing: 1,
  },
  todoList: {
    marginTop: 16,
    gap: 12,
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  todoDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#001f45',
  },
  todoText: {
    color: '#374151',
    fontSize: 15,
  },
  teamList: {
    marginTop: 16,
    gap: 12,
  },
  teamCard: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    gap: 16,
    alignItems: 'center',
  },
  teamLogo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamLogoText: {
    color: '#1963c4ff',
    fontWeight: '800',
  },
  teamName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  teamNickname: {
    color: '#001f45',
    fontWeight: '600',
  },
  teamLogoUrl: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  logoutButton: {
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  logoutText: {
    color: '#EF4444',
    fontWeight: '600',
  },
  fixtureCard: {
    backgroundColor: '#FAFAFB',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    width: '100%', 
    borderColor: '#E5E7EB',
    marginBottom: 8,
  },
  fixtureTeams: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 0,
    marginBottom: 6,
  },
  fixtureTeamName: {
    fontWeight: '700',
    color: '#001f45',
  },
  vs: {
    color: '#6B7280',
    fontWeight: '600',
  },
  fixtureMeta: {
    color: '#6B7280',
    fontSize: 13,
    textAlign: 'center',
  },
});

export default AdminDashboard;

