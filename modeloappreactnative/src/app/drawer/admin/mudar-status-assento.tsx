import { Href, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator, Alert, StyleSheet,
  Text, TouchableOpacity, View,
} from 'react-native';

const API_URL = 'http://10.0.2.2:8000';
export default function MudarStatusAssentoScreen() {
  const router = useRouter();
  const { id, numero, fila, status: statusParam } = useLocalSearchParams<{
    id: string; numero: string; fila: string; status: string;
  }>();
  const [statusSelecionado, setStatusSelecionado] = useState(statusParam === 'true');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/assentos/assentos/${id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: statusSelecionado }),
      });
      if (res.ok) {
        Alert.alert('Sucesso', 'Status atualizado!');
        router.push('/(drawer)/admin/listar-assentos' as Href);
      } else {
        Alert.alert('Erro', 'Falha ao atualizar.');
      }
    } catch {
      Alert.alert('Erro', 'Sem conexão.');
    } finally { setSaving(false); }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mudar Status</Text>
      <Text style={styles.info}>Fila {fila} — Assento {numero}</Text>

      <Text style={styles.label}>Selecione o novo status:</Text>
      <TouchableOpacity
        style={[styles.option, statusSelecionado && styles.optionSelected]}
        onPress={() => setStatusSelecionado(true)}
      >
        <Text style={[styles.optionText, statusSelecionado && styles.optionTextSelected]}>
          Disponível
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.option, !statusSelecionado && styles.optionSelected]}
        onPress={() => setStatusSelecionado(false)}
      >
        <Text style={[styles.optionText, !statusSelecionado && styles.optionTextSelected]}>
          Indisponível
        </Text>
      </TouchableOpacity>

      {saving
        ? <ActivityIndicator size="large" color="#ff2d2d" style={{ marginTop: 20 }} />
        : <TouchableOpacity style={styles.btnSalvar} onPress={handleSave}>
            <Text style={styles.btnTexto}>Confirmar</Text>
          </TouchableOpacity>
      }
      <TouchableOpacity style={styles.btnVoltar}
        onPress={() => router.push('/(drawer)/admin/listar-assentos' as Href)}>
        <Text style={[styles.btnTexto, { color: '#ccc' }]}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f', padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#ff2d2d', alignSelf: 'center', marginBottom: 8 },
  info: { fontSize: 15, color: '#888', textAlign: 'center', marginBottom: 20 },
  label: { fontWeight: '600', marginBottom: 10, color: '#fff' },
  option: { borderWidth: 1, borderColor: '#333', borderRadius: 8, padding: 14, marginBottom: 8 },
  optionSelected: { backgroundColor: '#c40000', borderColor: '#c40000' },
  optionText: { fontSize: 16, color: '#fff', textAlign: 'center' },
  optionTextSelected: { color: '#fff', fontWeight: '600' },
  btnSalvar: { backgroundColor: '#c40000', padding: 14, borderRadius: 8, marginTop: 16, alignItems: 'center' },
  btnVoltar: { borderWidth: 1, borderColor: '#444', padding: 14, borderRadius: 8, marginTop: 10, alignItems: 'center', backgroundColor: '#2a2a2a' },
  btnTexto: { color: '#fff', fontWeight: '600', fontSize: 16 },
});