import { Tabs } from "expo-router";
import { CalendarDays, Trophy, Users, Goal } from "lucide-react-native";
import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Colors from "@/constants/colors";
import TopTabBar from "@/components/TopTabBar";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.palette.gold,
        tabBarInactiveTintColor: Colors.palette.textDim,
        tabBarStyle: {
          backgroundColor: Colors.palette.charcoal,
          borderTopColor: Colors.palette.border,
          borderTopWidth: StyleSheet.hairlineWidth,
          height: Platform.OS === "ios" ? 88 : 64,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          letterSpacing: 0.3,
        },
        headerStyle: { backgroundColor: Colors.palette.ink },
        headerTitleStyle: {
          color: Colors.palette.text,
          fontWeight: "800",
          fontSize: 22,
          letterSpacing: -0.5,
        },
        headerShadowVisible: false,
        header: ({ options }) => (
          <SafeAreaView edges={["top"]} style={styles.headerSafe}>
            <View style={styles.headerTitleRow}>
              <Text style={styles.headerTitle}>
                {typeof options.headerTitle === "string"
                  ? options.headerTitle
                  : (options.title ?? "")}
              </Text>
            </View>
            <TopTabBar />
          </SafeAreaView>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Matches",
          headerTitle: "World Cup 2026",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon focused={focused}>
              <CalendarDays color={color} size={22} strokeWidth={2.5} />
            </TabIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="standings"
        options={{
          title: "Standings",
          headerTitle: "Group Standings",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon focused={focused}>
              <Trophy color={color} size={22} strokeWidth={2.5} />
            </TabIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="teams"
        options={{
          title: "Teams",
          headerTitle: "Teams",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon focused={focused}>
              <Users color={color} size={22} strokeWidth={2.5} />
            </TabIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="scorers"
        options={{
          title: "Scorers",
          headerTitle: "Top Scorers",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon focused={focused}>
              <Goal color={color} size={22} strokeWidth={2.5} />
            </TabIcon>
          ),
        }}
      />
    </Tabs>
  );
}

function TabIcon({
  children,
  focused,
}: {
  children: React.ReactNode;
  focused: boolean;
}) {
  return (
    <View style={[styles.iconWrap, focused && styles.iconWrapFocused]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  headerSafe: {
    backgroundColor: Colors.palette.ink,
  },
  headerTitleRow: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  headerTitle: {
    color: Colors.palette.text,
    fontWeight: "800",
    fontSize: 22,
    letterSpacing: -0.5,
  },
  iconWrap: {
    width: 44,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
  },
  iconWrapFocused: {
    backgroundColor: "rgba(255, 200, 87, 0.12)",
  },
});
