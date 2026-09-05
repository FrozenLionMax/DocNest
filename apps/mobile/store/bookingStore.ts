import { create } from 'zustand';

interface BookingState {
  selectedDoctorId: string | null;
  selectedDate: string | null;       // "2026-09-15"
  selectedTime: string | null;       // "10:00"
  selectedFamilyMemberId: string | null;
  bookingForSelf: boolean;
  paymentMethod: 'online' | 'at_clinic';

  setDoctor: (doctorId: string) => void;
  setDate: (date: string) => void;
  setTime: (time: string) => void;
  setFamilyMember: (memberId: string | null) => void;
  setPaymentMethod: (method: 'online' | 'at_clinic') => void;
  resetBooking: () => void;
}

const initialState = {
  selectedDoctorId: null,
  selectedDate: null,
  selectedTime: null,
  selectedFamilyMemberId: null,
  bookingForSelf: true,
  paymentMethod: 'online' as const,
};

export const useBookingStore = create<BookingState>((set) => ({
  ...initialState,

  setDoctor: (doctorId) => set({ selectedDoctorId: doctorId }),
  setDate: (date) => set({ selectedDate: date, selectedTime: null }), // Reset time on date change
  setTime: (time) => set({ selectedTime: time }),
  setFamilyMember: (memberId) =>
    set({
      selectedFamilyMemberId: memberId,
      bookingForSelf: memberId === null,
    }),
  setPaymentMethod: (method) => set({ paymentMethod: method }),
  resetBooking: () => set(initialState),
}));
