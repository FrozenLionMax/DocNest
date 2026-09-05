import * as Linking from 'expo-linking';
import { CONFIG } from '../constants/config';

/**
 * WhatsApp Deep Link Utilities
 * Uses wa.me/ URLs to open WhatsApp with pre-filled messages.
 * Zero cost — no API needed.
 */

/** Open WhatsApp chat with a specific number and pre-filled message */
export async function openWhatsApp(phone: string, message: string): Promise<any> {
  const cleanPhone = phone.replace(/[\s\-\+]/g, '');
  const fullPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
  const encodedMessage = encodeURIComponent(message);
  const url = `https://wa.me/${fullPhone}?text=${encodedMessage}`;

  const supported = await Linking.canOpenURL(url);
  if (supported) {
    return Linking.openURL(url);
  } else {
    const intentUrl = `intent://send?phone=${fullPhone}&text=${encodedMessage}#Intent;scheme=whatsapp;package=com.whatsapp;end`;
    return Linking.openURL(intentUrl).catch(() => {
      console.warn('WhatsApp is not installed');
    });
  }
}

/** Share booking confirmation via WhatsApp */
export async function shareBookingOnWhatsApp(booking: {
  doctorName: string;
  date: string;
  time: string;
  clinicName: string;
  clinicAddress: string;
  bookingId: string;
}): Promise<any> {
  const message = `✅ अपॉइंटमेंट कन्फर्म!

👨‍⚕️ डॉक्टर: ${booking.doctorName}
📅 दिनांक: ${booking.date}
🕐 समय: ${booking.time}
🏥 क्लिनिक: ${booking.clinicName}, ${booking.clinicAddress}
🔖 बुकिंग ID: ${booking.bookingId}

📱 DocNest App से बुक किया गया
डाउनलोड करें: ${CONFIG.PLAY_STORE_URL}`;

  return Linking.openURL(`whatsapp://send?text=${encodeURIComponent(message)}`);
}

/** Order medicines from Medicave via WhatsApp */
export async function openMedicaveOrder(medicines?: string): Promise<any> {
  const message = medicines
    ? `🏪 Medicave दवाई ऑर्डर\n\nदवाइयाँ:\n${medicines}\n\nकृपया डिलीवर करें।\n📱 DocNest App से ऑर्डर`
    : `🏪 नमस्ते Medicave!\n\nमुझे दवाई चाहिए।\n📱 DocNest App से संपर्क`;

  return openWhatsApp(CONFIG.MEDICAVE_WHATSAPP, message);
}

/** Contact a doctor via WhatsApp */
export async function contactDoctorWhatsApp(doctorPhone: string, doctorName: string): Promise<any> {
  const message = `नमस्ते ${doctorName} जी,\n\nमैं DocNest App से संपर्क कर रहा/रही हूँ।`;
  return openWhatsApp(doctorPhone, message);
}

/** Share app download link via WhatsApp */
export async function shareApp(): Promise<any> {
  const message = `🩺 DocNest - देवरिया का अपना हेल्थ ऐप!

✅ अपने पास के डॉक्टर खोजें
📅 ऑनलाइन अपॉइंटमेंट बुक करें
🔢 लाइव टोकन नंबर देखें (OPD Queue)
💊 Medicave से दवाई मंगाएं

📱 डाउनलोड करें: ${CONFIG.PLAY_STORE_URL}`;

  return Linking.openURL(`whatsapp://send?text=${encodeURIComponent(message)}`);
}

/** Share queue position via WhatsApp */
export async function shareLiveQueueStatus(
  doctorName: string,
  currentToken: number,
  userToken: number,
  estimatedWait: number
): Promise<any> {
  const message = `🏥 DocNest Deoria OPD Live Queue
👨‍⚕️ ${doctorName}

🔢 मेरा टोकन नंबर: #${userToken}
▶️ अभी चालू नंबर: #${currentToken}
⏱️ अनुमानित इंतज़ार: ~${estimatedWait} मिनट

📱 DocNest App पर लाइव देखें: ${CONFIG.PLAY_STORE_URL}`;

  return Linking.openURL(`whatsapp://send?text=${encodeURIComponent(message)}`);
}
