import { DrawerContentScrollView, DrawerItemList } from 'expo-router/build/react-navigation/drawer';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

const CustomDrawerContent = (props: any) => {
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      <View style={styles.header}>
        <Image
          source={require('../../assets/images/gato.png')}
          style={styles.avatar}
        />
        <Text style={styles.appName}>CinemaApp</Text>
        <Text style={styles.userName}>Olá, Usuário!</Text>
      </View>

      <View style={{ flex: 1, paddingTop: 10 }}>
        <DrawerItemList {...props} />
      </View>

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
  footerText: { color: '#888', fontSize: 12 },
});

export default CustomDrawerContent;