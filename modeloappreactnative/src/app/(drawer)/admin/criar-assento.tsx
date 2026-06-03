import { Href, useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator, Alert, ScrollView,
  StyleSheet, Text, TextInput, TouchableOpacity,
} from 'react-native';

import { useAdminGuard } from '@/hooks/useAdminGuard';

import { API_URL } from '@/constants/api';

export default function CriarAssentoScreen() {
  useAdminGuard();
  const router = useRouter();
  const [salaId, setSalaId] = useState('');
  const [numero, setNumero] = useState('');
  const [fila, setFila] = useState('');
  const [saving, setSaving] = useState(false);

  useFocusEffect(useCallback(() => {
    setSalaId(''); setNumero(''); setFila('');
  }, []));

  const handleSave = async () => {
    if (!salaId.trim() || !numero.trim() || !fila.trim()) {
      Alert.alert('Atenção', 'Preencha todos os campos.'); return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/assentos/assentos/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ id_sala: Number(salaId), numero: Number(numero), fila: fila.toUpperCase(), status: true }),
      });
      if (res.ok) {
        Alert.alert('Sucesso', 'Assento criado!');
        router.push('/(drawer)/admin/listar-assentos' as Href);
      } else {
        Alert.alert('Erro', 'Falha ao criar assento.');
      }
    } catch {
      Alert.alert('Erro', 'Sem conexão com o servidor.');
    } finally { setSaving(false); }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Criar Assento</Text>

      <Text style={styles.label}>ID da Sala</Text>
      <TextInput value={salaId} onChangeText={setSalaId} style={styles.input}
        keyboardType="numeric" placeholder="Ex: 1" placeholderTextColor="#aaa" />

      <Text style={styles.label}>Número</Text>
      <TextInput value={numero} onChangeText={setNumero} style={styles.input}
        keyboardType="numeric" placeholder="Ex: 1" placeholderTextColor="#aaa" />

      <Text style={styles.label}>Fila (A–E)</Text>
      <TextInput value={fila} onChangeText={setFila} style={styles.input}
        placeholder="Ex: A" placeholderTextColor="#aaa" autoCapitalize="characters" maxLength={1} />

      {saving
        ? <ActivityIndicator size="large" color="#ff2d2d" style={{ marginTop: 20 }} />
        : <TouchableOpacity style={styles.btnSalvar} onPress={handleSave}>
            <Text style={styles.btnTexto}>Salvar</Text>
          </TouchableOpacity>
      }
      <TouchableOpacity style={styles.btnVoltar}
        onPress={() => router.push('/(drawer)/admin/listar-assentos' as Href)}>
        <Text style={[styles.btnTexto, { color: '#ccc' }]}>Voltar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f', padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#ff2d2d', alignSelf: 'center', marginBottom: 16 },
  label: { fontWeight: '600', marginTop: 12, marginBottom: 4, color: '#fff' },
  input: { borderWidth: 1, borderColor: '#333', borderRadius: 8, padding: 10, color: '#fff', backgroundColor: '#111' },
  btnSalvar: { backgroundColor: '#c40000', padding: 14, borderRadius: 8, marginTop: 20, alignItems: 'center' },
  btnVoltar: { borderWidth: 1, borderColor: '#444', padding: 14, borderRadius: 8, marginTop: 10, alignItems: 'center', backgroundColor: '#2a2a2a' },
  btnTexto: { color: '#fff', fontWeight: '600', fontSize: 16 },
});