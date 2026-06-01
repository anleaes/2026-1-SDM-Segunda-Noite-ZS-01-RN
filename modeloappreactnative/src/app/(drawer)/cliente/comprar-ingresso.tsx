import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator, FlatList, ScrollView,
  StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';

import { API_URL } from '@/constants/api';
const TIPOS_INGRESSO = ['Inteira', 'Meia (estudante)', 'Idoso', 'Cortesia'];

type AssentoDisponivel = {
  id: number;
  numero: number;
  fila: string;
  status: boolean;
};

export default function ComprarIngressoScreen() {
  const router = useRouter();
  const { sessaoId, filmeTitulo } = useLocalSearchParams<{
    sessaoId: string; filmeTitulo: string;
  }>();

  const [assentos, setAssentos] = useState<AssentoDisponivel[]>([]);
  const [selecionados, setSelecionados] = useState<number[]>([]);
  const [tipoIngresso, setTipoIngresso] = useState('Inteira');
  const [loading, setLoading] = useState(true);

  const fetchAssentos = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/assentos/assentos/`);
      const todos: AssentoDisponivel[] = await res.json();
      setAssentos(todos.filter(a => !a.status));
    } catch { setAssentos([]); }
    finally { setLoading(false); }
  };

  useFocusEffect(useCallback(() => {
    fetchAssentos();
    setSelecionados([]);
  }, []));

  const toggleAssento = (id: number) => {
    setSelecionados(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const renderAssento = ({ item }: { item: AssentoDisponivel }) => {
    const selecionado = selecionados.includes(item.id);
    return (
      <TouchableOpacity
        style={[styles.assentoBtn, selecionado && styles.assentoBtnSelecionado]}
        onPress={() => toggleAssento(item.id)}
      >
        <Text style={[styles.assentoText, selecionado && styles.assentoTextSelecionado]}>
          {item.fila}{item.numero}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{filmeTitulo}</Text>
      <Text style={styles.subtitle}>Selecione seus assentos</Text>

      <View style={styles.legendaRow}>
        <View style={[styles.legendaBox, { backgroundColor: '#1a1a1a', borderColor: '#333', borderWidth: 1 }]} />
        <Text style={styles.legendaText}>Disponível</Text>
        <View style={[styles.legendaBox, { backgroundColor: '#c40000' }]} />
        <Text style={styles.legendaText}>Selecionado</Text>
      </View>

      {loading
        ? <ActivityIndicator size="large" color="#ff2d2d" style={{ marginTop: 20 }} />
        : <FlatList
            data={assentos}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderAssento}
            numColumns={5}
            columnWrapperStyle={styles.assentosGrid}
            scrollEnabled={false}
            contentContainerStyle={{ marginVertical: 12 }}
          />
      }

      <Text style={styles.label}>Tipo de ingresso</Text>
      {TIPOS_INGRESSO.map((tipo) => (
        <TouchableOpacity key={tipo}
          style={[styles.tipoBtn, tipoIngresso === tipo && styles.tipoBtnAtivo]}
          onPress={() => setTipoIngresso(tipo)}>
          <Text style={[styles.tipoText, tipoIngresso === tipo && styles.tipoTextAtivo]}>
            {tipo}
          </Text>
        </TouchableOpacity>
      ))}

      {selecionados.length > 0 && (
        <View style={styles.resumo}>
          <Text style={styles.resumoText}>
            {selecionados.length} assento(s) selecionado(s)
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={[styles.btnComprar, selecionados.length === 0 && styles.btnDisabled]}
        disabled={selecionados.length === 0}
      >
        <Text style={styles.btnTexto}>Continuar →</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnVoltar} onPress={() => router.back()}>
        <Text style={[styles.btnTexto, { color: '#ccc' }]}>← Voltar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f', padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 2 },
  subtitle: { fontSize: 14, color: '#888', marginBottom: 12 },
  legendaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  legendaBox: { width: 20, height: 20, borderRadius: 4 },
  legendaText: { fontSize: 12, color: '#888', marginRight: 10 },
  assentosGrid: { justifyContent: 'center', gap: 8, marginBottom: 4 },
  assentoBtn: {
    width: 52, height: 52, borderRadius: 8,
    backgroundColor: '#1a1a1a', borderWidth: 1, borderColor: '#333',
    alignItems: 'center', justifyContent: 'center', margin: 4,
  },
  assentoBtnSelecionado: { backgroundColor: '#c40000', borderColor: '#c40000' },
  assentoText: { fontSize: 12, fontWeight: '600', color: '#fff' },
  assentoTextSelecionado: { color: '#fff' },
  label: { fontWeight: '600', marginTop: 16, marginBottom: 8, color: '#fff', fontSize: 15 },
  tipoBtn: { borderWidth: 1, borderColor: '#333', borderRadius: 8, padding: 12, marginBottom: 8 },
  tipoBtnAtivo: { backgroundColor: '#c40000', borderColor: '#c40000' },
  tipoText: { color: '#888', fontSize: 15 },
  tipoTextAtivo: { color: '#fff', fontWeight: '600' },
  resumo: { backgroundColor: '#1a1a1a', borderRadius: 8, padding: 12, marginTop: 12, alignItems: 'center', borderWidth: 1, borderColor: '#c40000' },
  resumoText: { color: '#c40000', fontWeight: '600' },
  btnComprar: { backgroundColor: '#c40000', padding: 14, borderRadius: 8, marginTop: 16, alignItems: 'center' },
  btnDisabled: { backgroundColor: '#444' },
  btnVoltar: { borderWidth: 1, borderColor: '#444', padding: 14, borderRadius: 8, marginTop: 10, alignItems: 'center', marginBottom: 30, backgroundColor: '#2a2a2a' },
  btnTexto: { color: '#fff', fontWeight: '600', fontSize: 16 },
});