import { Stack } from "expo-router";
import * as NavigationBar from 'expo-navigation-bar';
import * as SystemUI from 'expo-system-ui';
import { useEffect } from 'react';

export default function RootLayout() {
  useEffect(() => {
    // Configure navigation bar button style for better visibility
    const configureNavigationBar = async () => {
      // Set the button style to dark for better visibility on light backgrounds
      await NavigationBar.setButtonStyleAsync('dark');
    };

    configureNavigationBar();
    
    // Set the system navigation bar background to light gray to match app theme
    SystemUI.setBackgroundColorAsync('#f5f5f5');
  }, []);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}