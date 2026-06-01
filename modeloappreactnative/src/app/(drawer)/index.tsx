import { Ionicons } from '@expo/vector-icons';
import { Href, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.banner}>
        <Text style={styles.bannerEmoji}>🎬</Text>
        <Text style={styles.bannerTitle}>CinemaApp</Text>
        <Text style={styles.bannerSub}>Sua experiência no cinema começa aqui</Text>
      </View>

      <Text style={styles.sectionTitle}>Para clientes</Text>
      <View style={styles.grid}>
        <TouchableOpacity style={styles.gridCard}
          onPress={() => router.push('/(drawer)/cliente/listar-filmes' as Href)}> 
          <Ionicons name="film-outline" size={32} color="#c40000" />
          <Text style={styles.gridText}>Ver filmes</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Administração</Text>
      <View style={styles.grid}>
        <TouchableOpacity style={styles.gridCard}
          onPress={() => router.push('/(drawer)/admin/listar-filmes' as Href)}>
          <Ionicons name="film-outline" size={28} color="#c40000" />
          <Text style={styles.gridText}>Gerenciar filmes</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridCard}
          onPress={() => router.push('/(drawer)/admin/listar-assentos' as Href)}>
          <Ionicons name="grid-outline" size={28} color="#c40000" />
          <Text style={styles.gridText}>Gerenciar assentos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridCard}
          onPress={() => router.push('/(drawer)/admin/cadastrar-usuario' as Href)}>
          <Ionicons name="person-add-outline" size={28} color="#c40000" />
          <Text style={styles.gridText}>Novo usuário</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f' },
  banner: { backgroundColor: '#c40000', padding: 32, alignItems: 'center' },
  bannerEmoji: { fontSize: 48, marginBottom: 8 },
  bannerTitle: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  bannerSub: { fontSize: 14, color: 'rgba(255,255,255,0.85)', marginTop: 4 },
  sectionTitle: {
    fontSize: 18, fontWeight: '700', color: '#fff',
    marginTop: 20, marginBottom: 10, paddingHorizontal: 16,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, gap: 8 },
  gridCard: {
    backgroundColor: '#1a1a1a', borderRadius: 12, padding: 20,
    alignItems: 'center', flex: 1, minWidth: 120, margin: 4, elevation: 2,
    borderWidth: 1, borderColor: '#2a2a2a',
  },
  gridText: { marginTop: 8, fontSize: 13, fontWeight: '600', color: '#fff', textAlign: 'center' },
});