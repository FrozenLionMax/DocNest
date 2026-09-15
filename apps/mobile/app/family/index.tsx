import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Users, Plus, ChevronLeft, Trash2, Heart, RefreshCw } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { supabase } from '../../lib/supabase';

interface MemberItem {
  id: string;
  name: string;
  relation: string;
  age: string;
  gender: string;
}

export default function FamilyScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<MemberItem[]>([
    { id: 'fam-1', name: 'Sita Devi (माता जी)', relation: 'Mother', age: '58', gender: 'Female' },
    { id: 'fam-2', name: 'Ramesh Sharma (पिता जी)', relation: 'Father', age: '62', gender: 'Male' },
    { id: 'fam-3', name: 'Aarav Sharma (बेटा)', relation: 'Son', age: '8', gender: 'Male' },
  ]);

  const [newName, setNewName] = useState('');
  const [newRelation, setNewRelation] = useState('');
  const [newAge, setNewAge] = useState('');
  const [newGender, setNewGender] = useState('Male');
  const [showAddForm, setShowAddForm] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchFamilyMembers();
  }, []);

  const fetchFamilyMembers = async () => {
    setLoading(true);
    try {
      const { data } = await supabase.from('family_members').select('*');
      if (data && data.length > 0) {
        setMembers(
          data.map((m: any) => ({
            id: m.id,
            name: m.full_name,
            relation: m.relation || 'Member',
            age: m.age ? String(m.age) : '30',
            gender: m.gender || 'Other',
          }))
        );
      }
    } catch (e) {
      console.log('Family members loaded fallback');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async () => {
    if (!newName) return;
    setSaving(true);
    const newMemberItem: MemberItem = {
      id: `fam-${Date.now()}`,
      name: newName,
      relation: newRelation || 'Family Member',
      age: newAge || '30',
      gender: newGender,
    };

    setMembers((prev) => [...prev, newMemberItem]);
    setNewName('');
    setNewRelation('');
    setNewAge('');
    setShowAddForm(false);

    try {
      await supabase.from('family_members').insert([
        {
          full_name: newName,
          relation: newRelation || 'Family Member',
          age: parseInt(newAge) || 30,
          gender: newGender,
        },
      ]);
    } catch (e) {
      console.log('Saved family member locally');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMember = async (id: string) => {
    setMembers((prev) => prev.filter((item) => item.id !== id));
    try {
      await supabase.from('family_members').delete().eq('id', id);
    } catch (e) {
      console.log('Deleted locally');
    }
  };

  return (
    <View style={styles.container}>
      {/* Navbar */}
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ChevronLeft size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>परिवार के सदस्य (Family Members)</Text>
      </View>

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
        {/* Subtitle */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md }}>
          <Text style={styles.subtitle}>
            एक ही अकाउंट से पूरे परिवार की अपॉइंटमेंट बुक करें एवं रिकॉर्ड संभालें
          </Text>
          <TouchableOpacity onPress={fetchFamilyMembers}>
            <RefreshCw size={16} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Members List */}
        {loading ? (
          <ActivityIndicator color={COLORS.primary} size="large" style={{ marginVertical: 20 }} />
        ) : (
          members.map((m) => (
            <View key={m.id} style={styles.memberCard}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{m.name[0]}</Text>
              </View>

              <View style={styles.memberInfo}>
                <Text style={styles.memberName}>{m.name}</Text>
                <Text style={styles.memberMeta}>
                  {m.relation} • {m.age} वर्ष • {m.gender}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => handleDeleteMember(m.id)}
                style={styles.deleteBtn}
              >
                <Trash2 size={18} color={COLORS.error} />
              </TouchableOpacity>
            </View>
          ))
        )}

        {/* Add Member Toggle */}
        {!showAddForm ? (
          <TouchableOpacity
            style={styles.addMemberBtn}
            onPress={() => setShowAddForm(true)}
          >
            <Plus size={20} color={COLORS.primary} />
            <Text style={styles.addMemberBtnText}>+ परिवार का नया सदस्य जोड़ें</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>नए सदस्य की जानकारी</Text>

            <TextInput
              placeholder="मरीज का नाम (उदा. माता जी)"
              value={newName}
              onChangeText={setNewName}
              style={styles.input}
            />

            <TextInput
              placeholder="रिश्ता (उदा. Mother / Father / Wife / Son)"
              value={newRelation}
              onChangeText={setNewRelation}
              style={styles.input}
            />

            <TextInput
              placeholder="उम्र (Age in years)"
              value={newAge}
              onChangeText={setNewAge}
              keyboardType="numeric"
              style={styles.input}
            />

            <View style={styles.formActionRow}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setShowAddForm(false)}
              >
                <Text style={styles.cancelText}>रद्द करें</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.saveBtn} onPress={handleAddMember} disabled={saving}>
                <Text style={styles.saveText}>{saving ? 'सहेज रहे हैं...' : 'सहेजें (Save)'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundSecondary,
  },
  navbar: {
    backgroundColor: COLORS.white,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.md,
    paddingHorizontal: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: SPACING.sm,
  },
  backBtn: {
    padding: 4,
  },
  navTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  body: {
    flex: 1,
    padding: SPACING.lg,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    flex: 1,
    marginRight: 8,
  },
  memberCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.card,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.tealLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primary,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  memberMeta: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  deleteBtn: {
    padding: 8,
  },
  addMemberBtn: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: SPACING.md,
  },
  addMemberBtnText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  formCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginTop: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.card,
  },
  formTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  input: {
    backgroundColor: COLORS.backgroundSecondary,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: 14,
    marginBottom: SPACING.md,
  },
  formActionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: SPACING.md,
    marginTop: SPACING.xs,
  },
  cancelBtn: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  cancelText: {
    color: COLORS.textMuted,
    fontSize: 14,
    fontWeight: '600',
  },
  saveBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.md,
  },
  saveText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
  },
});
