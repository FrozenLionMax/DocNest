import { create } from 'zustand';

interface BookingState {
  selectedDoctorId: string | null;
  doctorName: string | null;
  fee: number | null;
  selectedDate: string | null;       // "2026-09-15"
  selectedTime: string | null;       // "10:00 AM"
  selectedSlot: string | null;       // "10:00 AM"
  selectedFamilyMemberId: string | null;
  bookingForSelf: boolean;
  paymentMethod: 'online' | 'at_clinic';

  setDoctor: (doctorId: string, doctorName?: string, fee?: number) => void;
  setDate: (date: string) => void;
  setTime: (time: string) => void;
  setSlot: (slot: string) => void;
  setFamilyMember: (memberId: string | null) => void;
  setPaymentMethod: (method: 'online' | 'at_clinic') => void;
  resetBooking: () => void;
}

const initialState = {
  selectedDoctorId: null,
  doctorName: null,
  fee: null,
  selectedDate: null,
  selectedTime: null,
  selectedSlot: null,
  selectedFamilyMemberId: null,
  bookingForSelf: true,
  paymentMethod: 'at_clinic' as const,
};

export const useBookingStore = create<BookingState>((set) => ({
  ...initialState,

  setDoctor: (doctorId, doctorName, fee) =>
    set({
      selectedDoctorId: doctorId,
      doctorName: doctorName || null,
      fee: fee || null,
    }),
  setDate: (date) => set({ selectedDate: date, selectedTime: null, selectedSlot: null }),
  setTime: (time) => set({ selectedTime: time, selectedSlot: time }),
  setSlot: (slot) => set({ selectedSlot: slot, selectedTime: slot }),
  setFamilyMember: (memberId) =>
    set({
      selectedFamilyMemberId: memberId,
      bookingForSelf: memberId === null,
    }),
  setPaymentMethod: (method) => set({ paymentMethod: method }),
  resetBooking: () => set(initialState),
}));
