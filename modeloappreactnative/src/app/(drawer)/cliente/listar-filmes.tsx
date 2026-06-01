import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator, FlatList, StyleSheet,
  Text, TouchableOpacity, View,
} from 'react-native';

import { API_URL } from '@/constants/api';

type Filme = {
  id: number;
  titulo: string;
  genero: number;         // FK — ID do gênero
  duracao: number;
  classificacao: string;
};

export default function ListarFilmesClienteScreen() {
  const router = useRouter();
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFilmes = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/filmes/`);
      setFilmes(await res.json());
    } catch { setFilmes([]); }
    finally { setLoading(false); }
  };

  useFocusEffect(useCallback(() => { fetchFilmes(); }, []));

  const renderItem = ({ item }: { item: Filme }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push({
        pathname: '/(drawer)/cliente/escolher-sessao',
        params: { filmeId: item.id, filmeTitulo: item.titulo },
      })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitulo}>{item.titulo}</Text>
        <View style={styles.classifBadge}>
          <Text style={styles.classifText}>{item.classificacao}</Text>
        </View>
      </View>
      <Text style={styles.cardDuracao}>⏱ {item.duracao} minutos</Text>
      <View style={styles.verSessoesBtn}>
        <Text style={styles.verSessoesText}>Ver sessões →</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎬 Em Cartaz</Text>
      {loading
        ? <ActivityIndicator size="large" color="#ff2d2d" style={{ marginTop: 40 }} />
        : <FlatList
            data={filmes}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 20 }}
            ListEmptyComponent={
              <Text style={styles.empty}>Nenhum filme disponível no momento.</Text>
            }
          />
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f', paddingHorizontal: 16, paddingTop: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#ff2d2d', marginBottom: 16 },
  card: {
    backgroundColor: '#1a1a1a', borderRadius: 12, padding: 16,
    marginBottom: 14, elevation: 3, borderWidth: 1, borderColor: '#2a2a2a',
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardTitulo: { fontSize: 18, fontWeight: '700', color: '#fff', flex: 1, marginRight: 8 },
  classifBadge: { backgroundColor: '#c40000', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  classifText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  cardDuracao: { fontSize: 13, color: '#888', marginTop: 6 },
  verSessoesBtn: { alignSelf: 'flex-end', marginTop: 10 },
  verSessoesText: { color: '#c40000', fontWeight: '700', fontSize: 14 },
  empty: { textAlign: 'center', color: '#888', marginTop: 40 },
});