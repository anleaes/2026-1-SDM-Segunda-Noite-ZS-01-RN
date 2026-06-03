
import { Ionicons } from '@expo/vector-icons';
import { Href, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useAdminGuard } from '@/hooks/useAdminGuard';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminHomeScreen() {
  useAdminGuard();
  const router = useRouter();
  const { user } = useAuth();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Painel do Administrador</Text>
        <Text style={styles.subtitle}>Olá, {user.nome || 'Administrador'}! Aqui estão suas ações.</Text>
      </View>

      <Text style={styles.sectionTitle}>O que você pode fazer</Text>
      <View style={styles.grid}>
        <TouchableOpacity style={styles.card} onPress={() => router.push('/(drawer)/admin/cadastrar-filme' as Href)}>
          <Ionicons name="film-outline" size={28} color="#c40000" />
          <Text style={styles.cardText}>Cadastrar Filme</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => router.push('/(drawer)/admin/listar-filmes' as Href)}>
          <Ionicons name="list-outline" size={28} color="#c40000" />
          <Text style={styles.cardText}>Gerenciar Filmes</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => router.push('/(drawer)/admin/criar-assento' as Href)}>
          <Ionicons name="grid-outline" size={28} color="#c40000" />
          <Text style={styles.cardText}>Criar Assento</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => router.push('/(drawer)/admin/listar-assentos' as Href)}>
          <Ionicons name="warning-outline" size={28} color="#c40000" />
          <Text style={styles.cardText}>Gerenciar Assentos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => router.push({ pathname: '/(drawer)/admin/cadastrar-usuario', params: { tipo: 'cliente' } } as unknown as Href)}>
          <Ionicons name="person-add-outline" size={28} color="#c40000" />
          <Text style={styles.cardText}>Cadastrar Cliente</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => router.push({ pathname: '/(drawer)/admin/cadastrar-usuario', params: { tipo: 'administrador' } } as unknown as Href)}>
          <Ionicons name="shield-checkmark-outline" size={28} color="#c40000" />
          <Text style={styles.cardText}>Cadastrar Administrador</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => router.push('/(drawer)/admin/listar-generos' as Href)}>
          <Ionicons name="pricetag-outline" size={28} color="#c40000" />
          <Text style={styles.cardText}>Gerenciar Gêneros</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => router.push('/(drawer)/admin/listar-salas' as Href)}>
          <Ionicons name="business-outline" size={28} color="#c40000" />
          <Text style={styles.cardText}>Gerenciar Salas</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f' },
  contentContainer: { padding: 16 },
  header: { marginBottom: 24 },
  title: { fontSize: 28, fontWeight: '700', color: '#ff2d2d', marginBottom: 8 },
  subtitle: { color: '#ccc', lineHeight: 22 },
  sectionTitle: { color: '#fff', fontWeight: '700', fontSize: 18, marginBottom: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12 },
  card: {
    backgroundColor: '#1a1a1a', width: '48%', borderRadius: 14, padding: 18,
    alignItems: 'center', borderWidth: 1, borderColor: '#2a2a2a', marginBottom: 12,
  },
  cardText: { color: '#fff', marginTop: 10, fontWeight: '600', textAlign: 'center' },
});