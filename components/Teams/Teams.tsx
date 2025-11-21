import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, ScrollView, View } from 'react-native';
import axios from 'axios';

interface Team {
  id: string;
  name: string;
  logo: string;
  nickname: string;
}

const Teams: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://ny-backend-xbdk.onrender.com/api/teams');
        setTeams(response.data.data || []);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch teams:', err);
        setError('Failed to load teams');
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  if (loading) {
    return (
      <ScrollView>
        <Text style={{ padding: 20, textAlign: 'center' }}>Loading teams...</Text>
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

  if (teams.length === 0) {
    return (
      <ScrollView>
        <Text style={{ padding: 20, textAlign: 'center', fontSize: 28, fontWeight: 'bold' }}>No teams available</Text>
      </ScrollView>
    );
  }

  return (
    <ScrollView>
      <Text style={styles.title}>Teams</Text>
      {teams.map(team => (
        <View key={team.id} style={styles.teamContainer}>
          <Text style={styles.teamName}>{team.name}</Text>
          <Text style={styles.teamNickname}>({team.nickname})</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 20,
    color: '#2563EB',
  },
  teamContainer: {
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  teamName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  teamNickname: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
});

export default Teams;
