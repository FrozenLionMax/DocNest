import { Linking, Alert } from 'react-native';

/**
 * DocNest Payment Gateway Service
 * Handles Razorpay & UPI Deep-Link checkout for doctor consultations & Medicave orders.
 */

export interface PaymentDetails {
  appointmentId: string;
  doctorName: string;
  amount: number; // in INR
  patientName: string;
  patientPhone: string;
}

/**
 * Launch UPI Intent Payment (GPay, PhonePe, Paytm, BHIM)
 */
export async function launchUpiPayment(details: PaymentDetails): Promise<boolean> {
  const upiId = 'medicave@upi'; // Medicave merchant UPI handle
  const note = `DocNest Appt ${details.appointmentId} with ${details.doctorName}`;
  
  // Format standard UPI URL scheme: upi://pay?pa=...&pn=...&am=...&tn=...
  const upiUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=DocNest%20Healthcare&am=${details.amount}&cu=INR&tn=${encodeURIComponent(note)}`;

  try {
    const supported = await Linking.canOpenURL(upiUrl);
    if (supported) {
      await Linking.openURL(upiUrl);
      return true;
    } else {
      // Fallback: Open web checkout / UPI selection
      Alert.alert(
        'UPI Payment Options',
        `पेमेंट राशि: ₹${details.amount}\nUPI ID: ${upiId}\n\nPhonePe, GPay या Paytm ऐप खोलकर भुगतान करें।`,
        [{ text: 'OK' }]
      );
      return false;
    }
  } catch (error) {
    console.error('UPI Launch error:', error);
    Alert.alert('Payment Error', 'भुगतान ऐप नहीं खुल सका। कृपया क्लिनिक पर नकद/UPI भुगतान करें।');
    return false;
  }
}

/**
 * Process Razorpay Online Payment Checkout Sandbox
 */
export async function initiateRazorpayCheckout(details: PaymentDetails): Promise<{
  success: boolean;
  paymentId: string;
}> {
  console.log(`Initiating Razorpay checkout for ₹${details.amount}...`);
  // Simulated checkout response for sandbox testing
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        paymentId: `pay_${Math.random().toString(36).substring(2, 12)}`,
      });
    }, 1000);
  });
}
