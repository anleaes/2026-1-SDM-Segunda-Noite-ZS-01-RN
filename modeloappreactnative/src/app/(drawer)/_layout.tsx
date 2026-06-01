import { Ionicons } from '@expo/vector-icons';
import { Drawer } from 'expo-router/drawer';
import React from 'react';
import CustomDrawerContent from '../../components/CustomDrawerContent';

export default function DrawerLayout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerActiveTintColor: '#c40000',
        drawerInactiveTintColor: '#ccc',
        drawerLabelStyle: { marginLeft: 0, fontSize: 16 },
        drawerStyle: { backgroundColor: '#0f0f0f', width: 260 },
        headerStyle: { backgroundColor: '#c40000' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          title: 'Início',
          drawerIcon: ({ color, size }) =>
            <Ionicons name="home-outline" size={size} color={color} />,
        }}
      />

    </Drawer>
  );
}