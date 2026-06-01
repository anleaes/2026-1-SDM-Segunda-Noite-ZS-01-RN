import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function CompraConfirmacaoScreen() {
  const router = useRouter();
  const { pedidoId, filmeTitulo, assentos: assentosJson } = useLocalSearchParams<{
    pedidoId: string; filmeTitulo: string; assentos: string;
  }>();

  const assentos: string[] = assentosJson ? JSON.parse(assentosJson) : [];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Ícone de sucesso */}
      <View style={styles.iconCircle}>
        <Text style={styles.iconText}>✓</Text>
      </View>

      <Text style={styles.titulo}>Compra Confirmada!</Text>
      <Text style={styles.subtitulo}>Seu ingresso foi reservado com sucesso.</Text>

      {/* Card de detalhes */}
      <View style={styles.card}>
        <Text style={styles.cardLabel}>Filme</Text>
        <Text style={styles.cardValue}>{filmeTitulo}</Text>

        <View style={styles.divider} />

        <Text style={styles.cardLabel}>Pedido Nº</Text>
        <Text style={styles.cardValue}>#{pedidoId}</Text>

        <View style={styles.divider} />

        <Text style={styles.cardLabel}>Assentos</Text>
        <View style={styles.assentosRow}>
          {assentos.map((a) => (
            <View key={a} style={styles.assentoBadge}>
              <Text style={styles.assentoBadgeText}>{a}</Text>
            </View>
          ))}
        </View>
      </View>

      <Text style={styles.aviso}>
        Apresente este comprovante na entrada do cinema.
      </Text>

      <TouchableOpacity style={styles.btnFilmes}
        onPress={() => router.push('/(drawer)/cliente/listar-filmes')}>
        <Text style={styles.btnTexto}>Ver outros filmes</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnHome}
        onPress={() => router.push('/(drawer)')}>
        <Text style={[styles.btnTexto, { color: '#c40000' }]}>Ir para o início</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#0f0f0f', padding: 24, alignItems: 'center' },
  iconCircle: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: '#c40000', alignItems: 'center',
    justifyContent: 'center', marginBottom: 16, elevation: 4,
  },
  iconText: { color: '#fff', fontSize: 42, fontWeight: 'bold' },
  titulo: { fontSize: 26, fontWeight: 'bold', color: '#fff', marginBottom: 6, textAlign: 'center' },
  subtitulo: { fontSize: 15, color: '#888', marginBottom: 24, textAlign: 'center' },
  card: {
    width: '100%', backgroundColor: '#1a1a1a',
    borderRadius: 14, padding: 20, marginBottom: 20, elevation: 2,
    borderWidth: 1, borderColor: '#2a2a2a',
  },
  cardLabel: {
    fontSize: 12, fontWeight: '600', color: '#c40000',
    textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4,
  },
  cardValue: { fontSize: 17, fontWeight: '600', color: '#fff', marginBottom: 4 },
  divider: { height: 1, backgroundColor: '#2a2a2a', marginVertical: 12 },
  assentosRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  assentoBadge: { backgroundColor: '#c40000', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6 },
  assentoBadgeText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  aviso: { fontSize: 13, color: '#888', textAlign: 'center', marginBottom: 24, fontStyle: 'italic' },
  btnFilmes: { backgroundColor: '#c40000', padding: 14, borderRadius: 8, width: '100%', alignItems: 'center', marginBottom: 10 },
  btnHome: { borderWidth: 1, borderColor: '#c40000', padding: 14, borderRadius: 8, width: '100%', alignItems: 'center' },
  btnTexto: { color: '#fff', fontWeight: '600', fontSize: 16 },
});
