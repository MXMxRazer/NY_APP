import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  FlatList,
  ActivityIndicator,
} from 'react-native';

import axios from 'axios';

import type { TeamInfo } from '../AdminDashboard';

interface SingleFixture {
  teamAId: string | null;
  teamBId: string | null;
  date: string;
  time: string;
  stadium: string;
  city: string;
}

interface PlanFixturesProps {
  onCancel: () => void;
  teams?: TeamInfo[];
}

const emptyFixture = (idSeed = ''): SingleFixture => ({
  // id: `${Date.now()}-${idSeed}`,
  teamAId: null,
  teamBId: null,
  date: '',
  time: '',
  stadium: '',
  city: '',
});

const PlanFixturesScreen: React.FC<PlanFixturesProps> = ({ onCancel, teams = [] }) => {
  const [fixtures, setFixtures] = useState<SingleFixture[]>([emptyFixture('0')]);
  const [pickerModalVisible, setPickerModalVisible] = useState(false);
  const [pickerTarget, setPickerTarget] = useState<{ fixtureIndex: number; side: 'A' | 'B' } | null>(
    null,
  );
  const [mergedTeams, setMergedTeams] = useState<TeamInfo[]>(teams);
  const [fetchingTeams, setFetchingTeams] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setMergedTeams(teams);
  }, [teams]);

  const openTeamPicker = (fixtureIndex: number, side: 'A' | 'B') => {
    // Fetch teams from host then open the picker with retrieved options
    setFetchingTeams(true);
    setFetchError(null);
    axios
      .get<TeamInfo[]>('https://ny-backend-xbdk.onrender.com/api/teams')
      .then((res) => {
        const FetchedData = JSON.parse(JSON.stringify(res.data));
        const data = FetchedData.data;
        if (Array.isArray(data)) {
          setMergedTeams(data);
        } else {
          // empty response: fallback to provided teams
          setMergedTeams(teams);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch teams', err);
        setFetchError('Failed to load teams');
        setMergedTeams(teams);
      })
      .finally(() => {
        setFetchingTeams(false);
        setPickerTarget({ fixtureIndex, side });
        setPickerModalVisible(true);
      });
  };

  const chooseTeam = (teamId: string) => {
    if (!pickerTarget) return;
    setFixtures((prev) => {
      const copy = [...prev];
      if (pickerTarget.side === 'A') copy[pickerTarget.fixtureIndex].teamAId = teamId;
      else copy[pickerTarget.fixtureIndex].teamBId = teamId;
      return copy;
    });
    setPickerModalVisible(false);
    setPickerTarget(null);
  };

  const updateFixtureField = (index: number, field: keyof SingleFixture, value: any) => {
    setFixtures((prev) => {
      const copy = [...prev];
      // @ts-ignore
      copy[index][field] = value;
      return copy;
    });
  };

  const addFixture = () => setFixtures((p) => [...p, emptyFixture(String(p.length))]);

  const removeFixture = (index: number) => setFixtures((p) => p.filter((_, i) => i !== index));

  const handleSaveAll = async () => {
    setSaving(true);
    setSaved(false);
    try {
      for (const fixture of fixtures) {
        const response = await axios.post('https://ny-backend-xbdk.onrender.com/api/fixtures', fixture);
        setSaved(true);
        setTimeout(() => {
          setSaving(false);
          onCancel();
        }, 700);
      }
    } catch (error) {
      console.error('Failed to save fixtures', error);
      setSaved(false);
      setSaving(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Plan Fixtures</Text>

        {fixtures.map((f, idx) => (
          <View key={idx} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Fixture {idx + 1}</Text>
              <TouchableOpacity onPress={() => removeFixture(idx)}>
                <Text style={styles.removeText}>Remove</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.rowSmall}>
              <TouchableOpacity style={styles.teamSelect} onPress={() => openTeamPicker(idx, 'A')}>
                <Text style={styles.teamLabel}>Team A</Text>
                <Text style={styles.teamValue}>
                  {f.teamAId !== null ? (mergedTeams.find((t) => t.id === f.teamAId)?.name ?? '—') : 'Select team'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.teamSelect} onPress={() => openTeamPicker(idx, 'B')}>
                <Text style={styles.teamLabel}>Team B</Text>
                <Text style={styles.teamValue}>
                  {f.teamBId !== null ? (mergedTeams.find((t) => t.id === f.teamBId)?.name ?? '—') : 'Select team'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.fieldGroup}>
              <View style={styles.fieldInline}>
                <Text style={styles.label}>Date</Text>
                <TextInput
                  placeholder="YYYY-MM-DD"
                  value={f.date}
                  onChangeText={(v) => updateFixtureField(idx, 'date', v)}
                  style={styles.input}
                />
              </View>

              <View style={styles.fieldInline}>
                <Text style={styles.label}>Time</Text>
                <TextInput
                  placeholder="HH:MM"
                  value={f.time}
                  onChangeText={(v) => updateFixtureField(idx, 'time', v)}
                  style={styles.input}
                />
              </View>
            </View>

            <View style={{ marginTop: 8 }}>
              <Text style={styles.label}>Stadium</Text>
              <TextInput
                placeholder="Stadium name"
                value={f.stadium}
                onChangeText={(v) => updateFixtureField(idx, 'stadium', v)}
                style={styles.input}
              />
            </View>

            <View style={{ marginTop: 8 }}>
              <Text style={styles.label}>City</Text>
              <TextInput
                placeholder="City name"
                value={f.city}
                onChangeText={(v) => updateFixtureField(idx, 'city', v)}
                style={styles.input}
              />
            </View>
          </View>
        ))}

        <View style={styles.actionsRowTop}>
          <TouchableOpacity style={styles.addButton} onPress={addFixture}>
            <Text style={styles.addButtonText}>+ Add Fixture</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onCancel}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSaveAll}>
            <Text style={styles.saveText}>Save All</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal visible={pickerModalVisible} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Choose Team</Text>
            {fetchingTeams ? (
              <View style={{ paddingVertical: 20 }}>
                <ActivityIndicator size="large" color="#4F46E5" />
              </View>
            ) : fetchError ? (
              <Text style={{ textAlign: 'center', color: '#EF4444' }}>{fetchError}</Text>
            ) : (
              <FlatList
                data={mergedTeams}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => chooseTeam(item.id)} style={styles.teamRow}>
                    <Text style={styles.teamRowText}>{item.name}</Text>
                    <Text style={styles.teamRowSub}>{item.nickname}</Text>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={<Text style={{ textAlign: 'center' }}>No teams available</Text>}
              />
            )}
            <TouchableOpacity onPress={() => setPickerModalVisible(false)} style={styles.modalClose}>
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={saving || saved} transparent animationType="fade">
        <View style={styles.savingBackdrop}>
          <View style={styles.savingCard}>
            {!saved ? (
              <>
                <ActivityIndicator size="large" color="#10B981" />
                <Text style={{ marginTop: 12 }}>Saving fixtures…</Text>
              </>
            ) : (
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#10B981' }}>Saved ✓</Text>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 6,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E6E6E6',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: { fontWeight: '700', color: '#111827' },
  removeText: { color: '#EF4444', fontWeight: '600' },
  rowSmall: { flexDirection: 'row', gap: 8 },
  teamSelect: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#FAFAFB',
  },
  teamLabel: { fontSize: 12, color: '#6B7280' },
  teamValue: { marginTop: 6, fontWeight: '700', color: '#111827' },
  fieldGroup: { flexDirection: 'row', gap: 8, marginTop: 12 },
  fieldInline: { flex: 1 },
  label: { fontSize: 12, color: '#6B7280', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 8,
    height: 44,
    backgroundColor: '#FFF',
  },
  actionsRowTop: { flexDirection: 'row', justifyContent: 'flex-start', marginTop: 6 },
  addButton: { paddingVertical: 8, paddingHorizontal: 12, backgroundColor: '#EEF2FF', borderRadius: 8 },
  addButtonText: { color: '#4F46E5', fontWeight: '700' },
  actionsRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 8 },
  button: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8 },
  cancelButton: { backgroundColor: '#F3F4F6' },
  saveButton: { backgroundColor: '#001f45' },
  cancelText: { color: '#374151', fontWeight: '600' },
  saveText: { color: '#FFF', fontWeight: '700' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'center', padding: 20 },
  modalCard: { backgroundColor: '#FFF', borderRadius: 12, padding: 12, maxHeight: '80%' },
  modalTitle: { fontWeight: '700', marginBottom: 8 },
  teamRow: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  teamRowText: { fontWeight: '700' },
  teamRowSub: { color: '#6B7280', fontSize: 12 },
  modalClose: { marginTop: 8, alignItems: 'flex-end' },
  modalCloseText: { color: '#111827', fontWeight: '700' },
  savingBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.25)', justifyContent: 'center', alignItems: 'center' },
  savingCard: { backgroundColor: '#FFF', padding: 20, borderRadius: 12, alignItems: 'center' },
});

export default PlanFixturesScreen;
