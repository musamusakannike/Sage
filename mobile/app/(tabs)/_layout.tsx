import React from "react";
import { Tabs } from "expo-router";
import { StyleSheet, View, Text, Platform } from "react-native";
import {
  Home,
  Users,
  Calendar,
  Settings as SettingsIcon,
} from "lucide-react-native";
import { Colors } from "@/constants";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: {
          alignItems: "center",
          justifyContent: "center",
          height: 85,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} Icon={Home} label="Dashboard" />
          ),
        }}
      />
      <Tabs.Screen
        name="employees"
        options={{
          title: "Employees",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} Icon={Users} label="Employees" />
          ),
        }}
      />
      <Tabs.Screen
        name="schedule"
        options={{
          title: "Schedule",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} Icon={Calendar} label="Schedule" />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} Icon={SettingsIcon} label="Settings" />
          ),
        }}
      />
    </Tabs>
  );
}

interface TabIconProps {
  focused: boolean;
  Icon: any;
  label: string;
}

const TabIcon = ({ focused, Icon, label }: TabIconProps) => {
  return (
    <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
      <Icon
        size={22}
        color={focused ? Colors.primary : "#4E4E4E"}
        strokeWidth={focused ? 2.5 : 2}
      />
      <Text
        style={[
          styles.iconLabel,
          { color: focused ? Colors.primary : "#4E4E4E" },
          focused && styles.activeIconLabel,
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: "#F8F9F9",
    borderRadius: 50,
    height: 85,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    borderTopWidth: 0,
    paddingBottom: 0,
    paddingTop: 20,
  },

  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 85,
    height: "100%",
    borderRadius: 35,
  },

  activeIconContainer: {
    backgroundColor: "#3A6E571A",
    minHeight: 70
  },

  iconLabel: {
    fontSize: 11,
    marginTop: 4,
    fontFamily: "PlusJakartaSans_400Regular",
  },

  activeIconLabel: {
    fontFamily: "PlusJakartaSans_700Bold",
  },
});