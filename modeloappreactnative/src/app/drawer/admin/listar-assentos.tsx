import { Ionicons } from '@expo/vector-icons';
import { Href, useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator, FlatList, StyleSheet,
  Text, TouchableOpacity, View,
} from 'react-native';

const API_URL = 'http://10.0.2.2:8000';

export type Assento = {
  id: number;
  numero: number;
  fila: string;        // ← campo correto do backend (era 'fileira')
  status: boolean;     // ← boolean: false = disponível, true = ocupado
  id_sala: number;
};

const statusColor = (status: boolean) =>
  status ? '#155724' : '#721c24';  // true = disponível (verde), false = indisponível (vermelho)

const statusLabel = (status: boolean) =>
  status ? 'disponivel' : 'indisponivel';

export default function ListarAssentosScreen() {
  const router = useRouter();
  const [assentos, setAssentos] = useState<Assento[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAssentos = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/assentos/assentos/`);
      setAssentos(await res.json());
    } catch { setAssentos([]); }
    finally { setLoading(false); }
  };

  useFocusEffect(useCallback(() => { fetchAssentos(); }, []));

  const renderItem = ({ item }: { item: Assento }) => (
    <View style={styles.card}>
      <View style={styles.cardRow}>
        <Text style={styles.cardTitulo}>Fila {item.fila} — Assento {item.numero}</Text>
        <View style={[styles.badge, { backgroundColor: statusColor(item.status) }]}>
          <Text style={styles.badgeText}>{statusLabel(item.status)}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.btnMudar}
        onPress={() => router.push({
          pathname: '/(drawer)/admin/mudar-status-assento',
          params: { id: item.id, numero: item.numero, fila: item.fila, status: String(item.status) },
        } as unknown as Href)}>
        <Text style={styles.btnText}>Mudar Status</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Assentos</Text>
      {loading
        ? <ActivityIndicator size="large" color="#ff2d2d" />
        : <FlatList
            data={assentos}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 80 }}
          />
      }
      <TouchableOpacity style={styles.fab}
        onPress={() => router.push('/(drawer)/admin/criar-assento' as Href)}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f', paddingHorizontal: 16, paddingTop: 16 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#ff2d2d', alignSelf: 'center', marginBottom: 12 },
  card: { backgroundColor: '#1a1a1a', padding: 16, borderRadius: 10, marginBottom: 12, elevation: 2, borderWidth: 1, borderColor: '#2a2a2a' },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitulo: { fontSize: 16, fontWeight: '600', color: '#fff', flex: 1 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  btnMudar: { backgroundColor: '#c40000', padding: 8, borderRadius: 6, marginTop: 10, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '500' },
  fab: { position: 'absolute', right: 20, bottom: 20, backgroundColor: '#c40000', borderRadius: 28, padding: 14, elevation: 4 },
});