import { Ionicons } from '@expo/vector-icons';
import { Href, useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { API_URL } from '@/constants/api';
import { useAdminGuard } from '@/hooks/useAdminGuard';

export type Genero = {
  id: number;
  nome: string;
  descricao: string;
  icone: string;
};

const formatIconLabel = (value: string) => {
  const raw = value?.trim() ?? '';
  if (!raw) return '🎬';

  const basename = raw.split(/[\\/]/).pop()?.replace(/\.[^.]+$/, '') ?? raw;
  const isEmoji = /^(?:[\p{Emoji_Presentation}\p{Extended_Pictographic}])$/u.test(basename);

  return isEmoji ? basename : '🎬';
};

export default function ListarGenerosScreen() {
  useAdminGuard();
  const router = useRouter();
  const [generos, setGeneros] = useState<Genero[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGeneros = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/generos/`);
      setGeneros(await res.json());
    } catch {
      setGeneros([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/generos/${id}/`, { method: 'DELETE' });
      if (res.ok) {
        setGeneros(prev => prev.filter(item => item.id !== id));
      } else {
        Alert.alert('Erro', 'Não foi possível excluir o gênero.');
      }
    } catch {
      Alert.alert('Erro', 'Sem conexão com o servidor.');
    }
  };

  useFocusEffect(useCallback(() => { fetchGeneros(); }, []));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gêneros</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#ff2d2d" style={{ marginTop: 24 }} />
      ) : (
        <FlatList
          data={generos}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 90 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{formatIconLabel(item.icone)} {item.nome}</Text>
              <Text style={styles.cardText}>{item.descricao}</Text>
              <View style={styles.cardActions}>
                <TouchableOpacity
                  style={styles.btnEditar}
                  onPress={() => router.push({ pathname: '/(drawer)/admin/editar-genero', params: { id: String(item.id), nome: item.nome, descricao: item.descricao, icone: item.icone } } as Href)}
                >
                  <Text style={styles.btnText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnExcluir} onPress={() => handleDelete(item.id)}>
                  <Text style={styles.btnText}>Excluir</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/(drawer)/admin/cadastrar-genero' as Href)}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f', paddingHorizontal: 16, paddingTop: 16 },
  title: { fontSize: 22, fontWeight: '700', color: '#ff2d2d', alignSelf: 'center', marginBottom: 12 },
  card: { backgroundColor: '#1a1a1a', borderRadius: 10, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#2a2a2a' },
  cardTitle: { color: '#fff', fontSize: 17, fontWeight: '700' },
  cardText: { color: '#ccc', marginTop: 4 },
  cardActions: { flexDirection: 'row', marginTop: 10, gap: 8 },
  btnEditar: { flex: 1, backgroundColor: '#c40000', paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  btnExcluir: { flex: 1, backgroundColor: '#7a0000', paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '600' },
  fab: { position: 'absolute', right: 20, bottom: 20, backgroundColor: '#c40000', borderRadius: 28, padding: 14, elevation: 4 },
});
