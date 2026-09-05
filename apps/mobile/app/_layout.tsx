import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';

import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { loadSavedLanguage } from '../i18n';
import '../i18n'; // Initialize i18n

// Keep splash screen visible while we check auth
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { setSession, setProfile, setLoading, session } = useAuthStore();
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    async function initApp() {
      try {
        // Load saved language preference
        await loadSavedLanguage();

        // Check existing session
        const { data: { session: currentSession } } = await supabase.auth.getSession();

        if (currentSession) {
          setSession(currentSession);

          // Fetch user profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentSession.user.id)
            .single();

          if (profile) {
            setProfile(profile);
          }
        }

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, newSession) => {
            setSession(newSession);

            if (newSession) {
              const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', newSession.user.id)
                .single();

              if (profile) {
                setProfile(profile);
              }
            } else {
              setProfile(null);
            }
          }
        );

        setLoading(false);
        setAppReady(true);

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('App initialization error:', error);
        setLoading(false);
        setAppReady(true);
      }
    }

    initApp();
  }, []);

  useEffect(() => {
    if (appReady) {
      SplashScreen.hideAsync();
    }
  }, [appReady]);

  if (!appReady) {
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: '#F8FFFE' },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" options={{ animation: 'fade' }} />
        <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
        <Stack.Screen name="doctor/[id]" />
        <Stack.Screen name="booking/[doctorId]" />
        <Stack.Screen name="booking/confirm" />
        <Stack.Screen name="booking/success" />
        <Stack.Screen name="appointment/[id]" />
        <Stack.Screen name="specialty/[slug]" />
        <Stack.Screen name="queue/[doctorId]" />
      </Stack>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
