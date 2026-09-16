import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import type { ServiceOrderWithRelations } from './pdf.types.js';

const styles = StyleSheet.create({
  page: { padding: 32, fontSize: 10, fontFamily: 'Helvetica' },
  title: { fontSize: 16, marginBottom: 4, fontFamily: 'Helvetica-Bold' },
  subtitle: { fontSize: 10, color: '#555', marginBottom: 16 },
  section: { marginBottom: 12 },
  sectionTitle: { fontSize: 11, fontFamily: 'Helvetica-Bold', marginBottom: 4 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  tableHeader: { flexDirection: 'row', borderBottom: '1 solid #333', paddingBottom: 4, marginBottom: 4 },
  tableRow: { flexDirection: 'row', paddingVertical: 2, borderBottom: '1 solid #eee' },
  colDesc: { flex: 3 },
  colQty: { flex: 1, textAlign: 'right' },
  colValue: { flex: 1.5, textAlign: 'right' },
  totalRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 },
  totalLabel: { fontFamily: 'Helvetica-Bold', marginRight: 8 },
});

const currency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export function ServiceOrderPdf({ os }: { os: ServiceOrderWithRelations }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Atual Diesel — Ordem de Serviço #{os.numeroOs}</Text>
        <Text style={styles.subtitle}>
          Emitida em {new Date().toLocaleDateString('pt-BR')} — Status: {os.status}
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cliente</Text>
          <Text>{os.client.nome}</Text>
          {os.client.telefone && <Text>{os.client.telefone}</Text>}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Veículo</Text>
          <Text>
            {os.vehicle.placa} — {os.vehicle.marca} {os.vehicle.modelo} {os.vehicle.ano ?? ''}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Serviços</Text>
          <View style={styles.tableHeader}>
            <Text style={styles.colDesc}>Descrição</Text>
            <Text style={styles.colQty}>Qtd</Text>
            <Text style={styles.colValue}>Valor unit.</Text>
            <Text style={styles.colValue}>Total</Text>
          </View>
          {os.itens.map((item) => (
            <View key={item.id} style={styles.tableRow}>
              <Text style={styles.colDesc}>{item.descricao}</Text>
              <Text style={styles.colQty}>{item.quantidade}</Text>
              <Text style={styles.colValue}>{currency(Number(item.valorUnitario))}</Text>
              <Text style={styles.colValue}>{currency(Number(item.valorTotal))}</Text>
            </View>
          ))}
        </View>

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total geral:</Text>
          <Text>{currency(Number(os.valorTotal))}</Text>
        </View>

        {os.observacoes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Observações</Text>
            <Text>{os.observacoes}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
}
