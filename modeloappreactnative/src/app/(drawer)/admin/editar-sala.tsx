import { Href, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';

import { API_URL } from '@/constants/api';
import { useAdminGuard } from '@/hooks/useAdminGuard';

export default function EditarSalaScreen() {
  useAdminGuard();
  const router = useRouter();
  const { id, numero: numeroParam, capacidade: capacidadeParam, sala3D: sala3DParam } = useLocalSearchParams<{ id?: string; numero?: string; capacidade?: string; sala3D?: string; }>();

  const [numero, setNumero] = useState(numeroParam ?? '');
  const [capacidade, setCapacidade] = useState(capacidadeParam ?? '');
  const [sala3D, setSala3D] = useState(sala3DParam ?? 'false');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!id) return;
    if (!numero.trim() || !capacidade.trim()) {
      Alert.alert('Atenção', 'Preencha número e capacidade.');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/salas/${id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ numero: Number(numero), capacidade: Number(capacidade), sala3D: sala3D === 'true' || sala3D === 'True' }),
      });

      if (res.ok) {
        Alert.alert('Sucesso', 'Sala atualizada!');
        router.push('/(drawer)/admin/listar-salas' as Href);
      } else {
        Alert.alert('Erro', 'Não foi possível atualizar a sala.');
      }
    } catch {
      Alert.alert('Erro', 'Sem conexão com o servidor.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 24 }}>
      <Text style={styles.title}>Editar Sala</Text>
      <Text style={styles.label}>Número *</Text>
      <TextInput value={numero} onChangeText={setNumero} style={styles.input} keyboardType="numeric" />
      <Text style={styles.label}>Capacidade *</Text>
      <TextInput value={capacidade} onChangeText={setCapacidade} style={styles.input} keyboardType="numeric" />
      <Text style={styles.label}>Sala 3D</Text>
      <TextInput value={sala3D} onChangeText={setSala3D} style={styles.input} placeholder="true ou false" />

      {saving ? (
        <ActivityIndicator size="large" color="#ff2d2d" style={{ marginTop: 20 }} />
      ) : (
        <TouchableOpacity style={styles.btnSalvar} onPress={handleSave}>
          <Text style={styles.btnTexto}>Salvar</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.btnVoltar} onPress={() => router.back()}>
        <Text style={[styles.btnTexto, { color: '#ccc' }]}>Voltar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f', padding: 16 },
  title: { fontSize: 22, fontWeight: '700', color: '#ff2d2d', alignSelf: 'center', marginBottom: 18 },
  label: { color: '#fff', fontWeight: '600', marginBottom: 6 },
  input: { backgroundColor: '#111', color: '#fff', borderWidth: 1, borderColor: '#333', borderRadius: 8, padding: 12, marginBottom: 10 },
  btnSalvar: { backgroundColor: '#c40000', padding: 14, borderRadius: 8, marginTop: 10, alignItems: 'center' },
  btnVoltar: { borderWidth: 1, borderColor: '#444', padding: 14, borderRadius: 8, marginTop: 10, alignItems: 'center', backgroundColor: '#2a2a2a' },
  btnTexto: { color: '#fff', fontWeight: '600', fontSize: 16 },
});
