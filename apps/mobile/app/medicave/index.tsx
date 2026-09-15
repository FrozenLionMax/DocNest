import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Pill, Plus, Minus, ShoppingBag, CheckCircle2, Phone, MapPin } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { supabase } from '../../lib/supabase';
import { openMedicaveOrder } from '../../lib/whatsapp';

interface MedicineItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  category: string;
}

export default function MedicaveStoreScreen() {
  const router = useRouter();
  const [patientName, setPatientName] = useState('Rahul Sharma');
  const [phone, setPhone] = useState('9876543210');
  const [address, setAddress] = useState('Civil Lines, Deoria Sadar');
  const [submitting, setSubmitting] = useState(false);
  const [orderedSuccess, setOrderedSuccess] = useState(false);

  const [catalog, setCatalog] = useState<MedicineItem[]>([
    { id: 'p-1', name: 'Tab Zerodol-SP (10 Tabs)', price: 110, qty: 1, category: 'Pain Relief' },
    { id: 'p-2', name: 'Tab Pan-40 (15 Tabs)', price: 140, qty: 1, category: 'Acidity' },
    { id: 'p-3', name: 'Tab Calpol 650 (15 Tabs)', price: 32, qty: 0, category: 'Fever' },
    { id: 'p-4', name: 'Volini Pain Relief Spray 100g', price: 240, qty: 0, category: 'Pain Relief' },
    { id: 'p-5', name: 'Sachet Cholecalciferol D3 60k', price: 180, qty: 0, category: 'Vitamins' },
  ]);

  const updateQty = (id: string, delta: number) => {
    setCatalog((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(0, item.qty + delta);
          return { ...item, qty: newQty };
        }
        return item;
      })
    );
  };

  const selectedItems = catalog.filter((item) => item.qty > 0);
  const totalAmount = selectedItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  const handlePlaceOrder = async () => {
    if (selectedItems.length === 0) {
      Alert.alert('कार्ट खाली है', 'कृपया कम से कम एक दवाई चुनें');
      return;
    }
    if (!patientName || !phone || !address) {
      Alert.alert('अधूरी जानकारी', 'कृपया नाम, फोन और पता दर्ज करें');
      return;
    }

    setSubmitting(true);
    const summaryStr = selectedItems.map((i) => `${i.name} (x${i.qty})`).join(', ');

    try {
      // Insert order into Supabase DB
      await supabase.from('medicave_orders').insert([
        {
          patient_name: patientName,
          phone: phone,
          delivery_address: address,
          items_summary: summaryStr,
          total_amount: totalAmount,
          status: 'pending',
        },
      ]);

      setOrderedSuccess(true);
      // Also open WhatsApp order
      openMedicaveOrder(`*Order:* ${summaryStr}\n*Address:* ${address}\n*Total:* ₹${totalAmount}`);
    } catch (e) {
      setOrderedSuccess(true);
      openMedicaveOrder(`*Order:* ${summaryStr}\n*Address:* ${address}\n*Total:* ₹${totalAmount}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Navbar */}
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ChevronLeft size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Medicave Pharmacy Store</Text>
      </View>

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
        {orderedSuccess && (
          <View style={styles.successBanner}>
            <CheckCircle2 size={24} color={COLORS.primary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.successTitle}>ऑर्डर सफलतापूर्वक प्राप्त हुआ! 🎉</Text>
              <Text style={styles.successSub}>Medicave देवरिया स्टोर द्वारा आपकी दवाइयां डिलीवरी के लिए निकल रही हैं।</Text>
            </View>
          </View>
        )}

        {/* Store Banner */}
        <View style={styles.storeBanner}>
          <View style={styles.storeIconCircle}>
            <Pill size={26} color={COLORS.white} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.storeTitle}>Medicave Healthcare Deoria</Text>
            <Text style={styles.storeSub}>100% असली दवाइयां • 2 घंटे में घर पर होम डिलीवरी</Text>
          </View>
        </View>

        {/* Medicines Catalog */}
        <Text style={styles.sectionTitle}>उपलब्ध आवश्यक दवाइयां (Medicines)</Text>

        {catalog.map((item) => (
          <View key={item.id} style={styles.productCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.categoryTag}>{item.category}</Text>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>₹{item.price}</Text>
            </View>

            <View style={styles.qtyRow}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => updateQty(item.id, -1)}
              >
                <Minus size={14} color={COLORS.textPrimary} />
              </TouchableOpacity>

              <Text style={styles.qtyVal}>{item.qty}</Text>

              <TouchableOpacity
                style={[styles.qtyBtn, styles.qtyBtnPlus]}
                onPress={() => updateQty(item.id, 1)}
              >
                <Plus size={14} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Delivery Details Form */}
        <Text style={styles.sectionTitle}>डिलीवरी का पता (Delivery Address)</Text>
        <View style={styles.formCard}>
          <TextInput
            placeholder="मरीज का नाम"
            value={patientName}
            onChangeText={setPatientName}
            style={styles.input}
          />
          <TextInput
            placeholder="मोबाइल नंबर"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            style={styles.input}
          />
          <TextInput
            placeholder="देवरिया में डिलीवरी का पूरा पता"
            value={address}
            onChangeText={setAddress}
            style={styles.input}
          />
        </View>
      </ScrollView>

      {/* Cart Bottom Bar */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.cartCountLabel}>कुल {selectedItems.length} दवाएं</Text>
          <Text style={styles.cartTotalVal}>कुल राशि: ₹{totalAmount}</Text>
        </View>

        <TouchableOpacity
          style={styles.orderBtn}
          onPress={handlePlaceOrder}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color={COLORS.white} size="small" />
          ) : (
            <Text style={styles.orderBtnText}>ऑर्डर करें (Order Now)</Text>
          )}
        </TouchableOpacity>
      </View>
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
    paddingBottom: 100,
  },
  successBanner: {
    backgroundColor: COLORS.tealLight,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.primaryMuted,
  },
  successTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primary,
  },
  successSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  storeBanner: {
    backgroundColor: COLORS.secondary,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: SPACING.lg,
    ...SHADOWS.card,
  },
  storeIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  storeTitle: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '800',
  },
  storeSub: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
    marginTop: SPACING.sm,
  },
  productCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.card,
  },
  categoryTag: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primary,
    backgroundColor: COLORS.tealLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  productName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  productPrice: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.secondary,
    marginTop: 2,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  qtyBtnPlus: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  qtyVal: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
    minWidth: 16,
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.card,
  },
  input: {
    backgroundColor: COLORS.backgroundSecondary,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: 14,
    marginBottom: SPACING.sm,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    ...SHADOWS.modal,
  },
  cartCountLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  cartTotalVal: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.secondary,
  },
  orderBtn: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: 12,
    borderRadius: RADIUS.lg,
    ...SHADOWS.card,
  },
  orderBtnText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
  },
});
