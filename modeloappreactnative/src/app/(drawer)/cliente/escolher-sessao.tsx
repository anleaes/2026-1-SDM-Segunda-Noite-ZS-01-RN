import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator, FlatList, StyleSheet,
  Text, TouchableOpacity, View,
} from 'react-native';

import { API_URL } from '@/constants/api';

type Sessao = {
  id: number;
  horario: string;  // DateTimeField → string ISO 8601 ex: "2026-06-15T14:30:00Z"
  sala: number;     // FK para Sala
  ativa: boolean;
  filme: number;    // FK para Filme
};

const formatarHorario = (iso: string) => {
  const d = new Date(iso);
  const data = d.toLocaleDateString('pt-BR');
  const hora = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  return `${data} às ${hora}`;
};

export default function EscolherSessaoScreen() {
  const router = useRouter();
  const { filmeId, filmeTitulo } = useLocalSearchParams<{
    filmeId: string; filmeTitulo: string;
  }>();

  const [sessoes, setSessoes] = useState<Sessao[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSessoes = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/sessoes/`);
      const todas: Sessao[] = await res.json();
      // filtra pelo filme e apenas sessões ativas
      setSessoes(todas.filter(s => s.filme === Number(filmeId) && s.ativa));
    } catch { setSessoes([]); }
    finally { setLoading(false); }
  };

  useFocusEffect(useCallback(() => { fetchSessoes(); }, []));

  const renderItem = ({ item }: { item: Sessao }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push({
        pathname: '/(drawer)/cliente/comprar-ingresso',
        params: { sessaoId: item.id, filmeTitulo },
      })}
    >
      <View style={styles.cardRow}>
        <View>
          <Text style={styles.horarioText}>🕐 {formatarHorario(item.horario)}</Text>
          <Text style={styles.salaText}>🎭 Sala: {item.sala}</Text>
        </View>
        <View style={styles.selecionarBox}>
          <Text style={styles.selecionarText}>Selecionar →</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{filmeTitulo}</Text>
      <Text style={styles.subtitle}>Escolha uma sessão</Text>
      {loading
        ? <ActivityIndicator size="large" color="#ff2d2d" style={{ marginTop: 40 }} />
        : <FlatList
            data={sessoes}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 80 }}
            ListEmptyComponent={
              <Text style={styles.empty}>Nenhuma sessão disponível.</Text>
            }
          />
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f', paddingHorizontal: 16, paddingTop: 16 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 2 },
  subtitle: { fontSize: 15, color: '#888', marginBottom: 16 },
  card: { backgroundColor: '#1a1a1a', borderRadius: 12, padding: 16, marginBottom: 12, elevation: 2, borderWidth: 1, borderColor: '#2a2a2a' },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  horarioText: { fontSize: 15, fontWeight: '600', color: '#fff' },
  salaText: { fontSize: 14, color: '#888', marginTop: 4 },
  selecionarBox: { alignItems: 'flex-end' },
  selecionarText: { fontSize: 13, color: '#c40000', fontWeight: '700' },
  empty: { textAlign: 'center', color: '#888', marginTop: 40 },
});