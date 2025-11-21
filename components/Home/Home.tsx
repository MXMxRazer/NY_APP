import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, ScrollView } from 'react-native';
import axios from 'axios';
import Section from '../Section/Section';
import MatchPreview from '../MatchPreview/MatchPreview';

export interface ResultantSingleFixture {
  id: string;
  teamAId: string | null;
  teamBId: string | null;
  teamA: {
    id: string;
    name: string | null;
    logo: string | null;
    nickname?: string;
  } | null;
  teamB: {
    id: string;
    name: string | null;
    logo: string | null;
    nickname?: string;
  } | null;
  date: string;
  time: string;
  stadium: string;
  city: string;
  matchId: string;
  daysRemaining: string;
}

export const emptyResultantSingleFixture = (): ResultantSingleFixture => ({
  id: '',
  teamAId: null,
  teamBId: null,
  teamA: { id: '', name: null, logo: null },
  teamB: { id: '', name: null, logo: null },
  date: '',
  time: '',
  stadium: '',
  city: '',
  matchId: '',
  daysRemaining: '0',
});

const Home: React.FC = () => {
  const [fixture, setFixtures] = useState<ResultantSingleFixture>(emptyResultantSingleFixture);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFixtures = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://ny-backend-xbdk.onrender.com/api/fixtures/next');
        setFixtures(response.data.data);
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

  return (
    <ScrollView>
      <Section
        title={`Match ${ fixture.matchId || "Upcoming Matches" }`}
        subtitle="Upcoming Match"
        noOfDays={parseInt(fixture.daysRemaining, 10) || 0}
        onViewAllPress={() => console.log('View All pressed')}
      />
      {loading && <Text style={{ padding: 20, textAlign: 'center' }}>Loading fixtures...</Text>}
      {error && <Text style={{ padding: 20, textAlign: 'center', color: '#EF4444' }}>{error}</Text>}
        {!loading && (
          <MatchPreview key={fixture.id} fixture={fixture} onTicketPress={() => console.log('Ticket pressed')} />
        )}
      {!loading && error && (
          <Text style={{ padding: 20, textAlign: 'center', fontSize: 28, fontWeight: 'bold' }}>No fixtures available</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default Home;
