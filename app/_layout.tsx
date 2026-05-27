import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import Colors from "@/constants/colors";
import { FavoritesProvider } from "@/providers/favorites-provider";
import { LiveDataProvider } from "@/providers/live-data-provider";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack
      screenOptions={{
        headerBackTitle: "Back",
        headerStyle: { backgroundColor: Colors.palette.ink },
        headerTitleStyle: { color: Colors.palette.text, fontWeight: "700" },
        headerTintColor: Colors.palette.gold,
        contentStyle: { backgroundColor: Colors.palette.ink },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="match/[id]"
        options={{ title: "Match", presentation: "card" }}
      />
      <Stack.Screen
        name="team/[id]"
        options={{ title: "Team", presentation: "card" }}
      />
      <Stack.Screen
        name="modal"
        options={{ presentation: "modal", headerShown: false }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: Colors.palette.ink }}>
        <LiveDataProvider>
          <FavoritesProvider>
            <StatusBar style="light" />
            <RootLayoutNav />
          </FavoritesProvider>
        </LiveDataProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
