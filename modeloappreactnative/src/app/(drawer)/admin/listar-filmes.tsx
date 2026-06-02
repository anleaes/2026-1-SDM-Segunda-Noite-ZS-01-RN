
import { Ionicons } from '@expo/vector-icons';
import { Alert } from 'react-native'
import { Href, useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';

import { useAuth } from '@/contexts/AuthContext';
import {
  ActivityIndicator, FlatList, StyleSheet,
  Text, TouchableOpacity, View,
} from 'react-native';

import { API_URL } from '@/constants/api';

type Filme = {
  id: number;
  titulo: string;
  genero: number;          
  duracao: number;
  classificacao: string;
};

export default function ListarFilmesAdminScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [loading, setLoading] = useState(true);

  const handleDelete = async (id: number) => {
  try {
    await fetch(`${API_URL}/filmes/${id}/`, { method: 'DELETE' });
    setFilmes(prev => prev.filter(f => f.id !== id));
  } catch {
    Alert.alert('Erro', 'Não foi possível excluir.');
  }
};

  const fetchFilmes = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/filmes/`);
      setFilmes(await res.json());
    } catch { setFilmes([]); }
    finally { setLoading(false); }
  };

  useFocusEffect(useCallback(() => {
    if (user.tipo === 'administrador') {
      fetchFilmes();
      return;
    }

    if (user.tipo === 'cliente') {
      router.replace('/(drawer)/cliente/listar-filmes' as Href);
      return;
    }

    router.replace('/login' as Href);
  }, [router, user.tipo]));

  const renderItem = ({ item }: { item: Filme }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitulo}>{item.titulo}</Text>
      <Text style={styles.cardInfo}>⏱ {item.duracao} min  ·  🎬 {item.classificacao}</Text>
      <View style={styles.cardActions}>
        <TouchableOpacity
          style={styles.btnEditar}
          onPress={() => router.push({
            pathname: '/(drawer)/admin/editar-filme',
            params: {
              id: String(item.id),
              titulo: item.titulo,
              duracao: String(item.duracao),
              classificacao: item.classificacao,
              genero: String(item.genero ?? ''),
            },
          } as unknown as Href)}>
          <Text style={styles.btnText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnExcluir} onPress={() => handleDelete(item.id)}>
          <Text style={styles.btnText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Filmes Cadastrados</Text>
      {loading
        ? <ActivityIndicator size="large" color="#ff2d2d" style={{ marginTop: 40 }} />
        : <FlatList
            data={filmes}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 80 }}
            ListEmptyComponent={
              <Text style={styles.empty}>Nenhum filme cadastrado.</Text>
            }
          />
      }
      <TouchableOpacity style={styles.fab}
        onPress={() => router.push('/(drawer)/admin/cadastrar-filme' as Href)}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f', paddingHorizontal: 16, paddingTop: 16 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#ff2d2d', alignSelf: 'center', marginBottom: 12 },
  card: { backgroundColor: '#1a1a1a', padding: 16, borderRadius: 10, marginBottom: 12, elevation: 2, borderWidth: 1, borderColor: '#2a2a2a' },
  cardTitulo: { fontSize: 18, fontWeight: '600', color: '#fff' },
  cardInfo: { fontSize: 13, color: '#888', marginTop: 4 },
  cardSinopse: { fontSize: 13, color: '#888', marginTop: 4 },
  cardActions: { flexDirection: 'row', marginTop: 10, gap: 8 },
  btnEditar: { backgroundColor: '#c40000', padding: 8, borderRadius: 6, flex: 1, alignItems: 'center' },
  btnExcluir: { backgroundColor: '#7a0000', padding: 8, borderRadius: 6, flex: 1, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '500' },
  fab: { position: 'absolute', right: 20, bottom: 20, backgroundColor: '#c40000', borderRadius: 28, padding: 14, elevation: 4 },
  empty: { textAlign: 'center', color: '#888', marginTop: 40 },
});
