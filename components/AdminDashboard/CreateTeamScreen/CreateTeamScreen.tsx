import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import type { TeamInfo } from '../AdminDashboard';
import axios from 'axios';

interface CreateTeamScreenProps {
  onCancel?: () => void;
  onFinish?: (teams: TeamInfo[]) => void;
}

const CreateTeamScreen: React.FC<CreateTeamScreenProps> = ({ onCancel, onFinish }) => {
  const [teamName, setTeamName] = useState('');
  const [teamLogo, setTeamLogo] = useState('');
  const [nickname, setNickname] = useState('');
  const [teams, setTeams] = useState<TeamInfo[]>([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const resetFields = () => {
    setTeamName('');
    setTeamLogo('');
    setNickname('');
  };

  const handleAddTeam = () => {
    if (!teamName || !teamLogo || !nickname) {
      setError('Please fill out all fields before adding a team.');
      return;
    }

    setTeams((prev) => [
      ...prev,
      {
        id: ``,  
        name: teamName.trim(),
        logo: teamLogo.trim(),
        nickname: nickname.trim().toUpperCase(),
      },
    ]);

    resetFields();
    setError('');
  };

  const handleFinish = async () => {
    if (teams.length === 0) {
      setError('Add at least one team before finishing.');
      return;
    }
    setError('');
    // log collected teams before saving
    console.log('Collected teams to save:', teams);

    setSaving(true);
    const API_URL = 'https://ny-backend-xbdk.onrender.com/api/teams';

    try {
      for (const team of teams) {
        const response = await axios.post(API_URL, team);
        console.log('POST API Response for team', team.name, ':', response.data);
      }
    } catch (error: any) {
      console.error('POST API Error:', error.message);
    }

    setTimeout(() => {
      setSaving(false);
      onFinish?.(teams);
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Create Teams</Text>
        <Text style={styles.subheading}>
          Add team name, logo URL, and nickname. You can add multiple teams before saving.
        </Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Team Name</Text>
          <TextInput
            value={teamName}
            onChangeText={setTeamName}
            placeholder="New York Football Club"
            style={styles.input}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Team Logo URL</Text>
          <TextInput
            value={teamLogo}
            onChangeText={setTeamLogo}
            placeholder="https://example.com/logo.png"
            style={styles.input}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Nickname / Suffix</Text>
          <TextInput
            value={nickname}
            onChangeText={setNickname}
            placeholder="NYFC"
            style={styles.input}
            autoCapitalize="characters"
            maxLength={6}
          />
        </View>

        {!!error && <Text style={styles.error}>{error}</Text>}

        <TouchableOpacity style={styles.addButton} onPress={handleAddTeam}>
          <Text style={styles.addButtonText}>Add Team</Text>
        </TouchableOpacity>

        {teams.length > 0 && (
          <View style={styles.preview}>
            <Text style={styles.previewTitle}>Teams to be added</Text>
            {teams.map((team, index) => (
              <View key={`${team.logo + index}`} style={styles.previewItem}>
                <View style={styles.previewBadge}>
                  <Text style={styles.previewBadgeText}>{team.nickname.slice(0, 3)}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.previewName}>{team.name}</Text>
                  <Text style={styles.previewNickname}>{team.nickname}</Text>
                  <Text style={styles.previewLogo}>{team.logo}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <View style={styles.footerButtons}>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.finishButton} onPress={handleFinish}>
          <Text style={styles.finishText}>Finish</Text>
        </TouchableOpacity>
      </View>

      {saving && (
        <View style={styles.overlay}>
          <View style={styles.overlayCard}>
            <ActivityIndicator size="large" color="#001f45" />
            <Text style={styles.overlayText}>Saving teams...</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    padding: 24,
    paddingBottom: 120,
    gap: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  subheading: {
    color: '#6B7280',
    marginBottom: 12,
  },
  formGroup: {
    gap: 6,
  },
  label: {
    textTransform: 'uppercase',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.6,
    color: '#4B5563',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    fontSize: 16,
  },
  addButton: {
    marginTop: 12,
    backgroundColor: '#053a7aff',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  preview: {
    marginTop: 12,
    gap: 12,
  },
  previewTitle: {
    fontWeight: '700',
    color: '#111827',
  },
  previewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 12,
  },
  previewBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewBadgeText: {
    color: '#047857',
    fontWeight: '700',
  },
  previewName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  previewNickname: {
    color: '#001f45',
    fontWeight: '600',
  },
  previewLogo: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  footerButtons: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelText: {
    color: '#6B7280',
    fontWeight: '600',
  },
  finishButton: {
    flex: 1,
    backgroundColor: '#001f45',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  finishText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  error: {
    color: '#DC2626',
    fontWeight: '500',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayCard: {
    width: 200,
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    alignItems: 'center',
    gap: 12,
  },
  overlayText: {
    fontWeight: '600',
    color: '#111827',
  },
});

export default CreateTeamScreen;

