import { DrawerContentScrollView, DrawerItemList } from 'expo-router/build/react-navigation/drawer';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useAuth } from '@/contexts/AuthContext';
import { API_URL } from '@/constants/api';

const CustomDrawerContent = (props: any) => {
  const router = useRouter();
  const { user, logout } = useAuth();

  const filteredRoutes = props.state.routes.filter((route: any) => {
    if (user.tipo === 'administrador') return true;
    return !route.name.startsWith('admin/');
  });

  const activeRouteKey = props.state.routes[props.state.index]?.key;
  const filteredIndex = filteredRoutes.findIndex((route: any) => route.key === activeRouteKey);

  const filteredState = {
    ...props.state,
    routes: filteredRoutes,
    index: filteredIndex >= 0 ? filteredIndex : 0,
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/usuarios/logout/`, {
        method: 'GET',
        credentials: 'include',
      });
    } catch {
    }
    logout();
    router.replace('/login');
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      <View style={styles.header}>
        <Image
          source={require('../../assets/images/gato.png')}
          style={styles.avatar}
        />
        <Text style={styles.appName}>CinemaApp</Text>
        <Text style={styles.userName}>Olá, {user.nome || 'Usuário'}!</Text>
      </View>

      <View style={{ flex: 1, paddingTop: 10 }}>
        <DrawerItemList {...props} state={filteredState} />
      </View>

      {user.tipo !== 'guest' && (
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      )}

      <View style={styles.footer}>
        <Text style={styles.footerText}>SDM 2026 · Turma ZS-01</Text>
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 20,
    backgroundColor: '#c40000',
    alignItems: 'center',
  },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    marginBottom: 10, borderWidth: 2, borderColor: '#fff',
  },
  appName: { color: '#fff', fontSize: 13, opacity: 0.8, marginBottom: 2 },
  userName: { color: '#fff', fontSize: 18, fontWeight: '600' },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#2a2a2a',
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#7a0000',
    borderRadius: 10,
    marginHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  logoutText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  footerText: { color: '#888', fontSize: 12 },
});

export default CustomDrawerContent;