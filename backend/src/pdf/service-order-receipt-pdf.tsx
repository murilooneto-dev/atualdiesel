import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import type { ServiceOrderReceiptData } from './pdf.types.js';

const styles = StyleSheet.create({
  page: { padding: 32, fontSize: 10, fontFamily: 'Helvetica' },
  title: { fontSize: 16, marginBottom: 4, fontFamily: 'Helvetica-Bold' },
  subtitle: { fontSize: 10, color: '#555', marginBottom: 16 },
  section: { marginBottom: 12 },
  sectionTitle: { fontSize: 11, fontFamily: 'Helvetica-Bold', marginBottom: 4 },
  tableHeader: { flexDirection: 'row', borderBottom: '1 solid #333', paddingBottom: 4, marginBottom: 4 },
  tableRow: { flexDirection: 'row', paddingVertical: 2, borderBottom: '1 solid #eee' },
  colDesc: { flex: 3 },
  colQty: { flex: 1, textAlign: 'right' },
  colValue: { flex: 1.5, textAlign: 'right' },
  colItem: { flex: 3 },
  colStatus: { flex: 1 },
  colObs: { flex: 3 },
  totalRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 },
  totalLabel: { fontFamily: 'Helvetica-Bold', marginRight: 8 },
  signatureBlock: { marginTop: 48 },
  signatureLine: { borderTop: '1 solid #333', width: 260, marginBottom: 4 },
  signatureCaption: { fontSize: 9, color: '#555' },
});

const currency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const checklistStatusLabels: Record<string, string> = {
  OK: 'OK',
  ATENCAO: 'Atenção',
  NAO_APLICAVEL: 'Não aplicável',
};

export function ServiceOrderReceiptPdf({ os }: { os: ServiceOrderReceiptData }) {
  const aprovadaEm = os.dataConclusao ?? new Date();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Atual Diesel — Recibo de aprovação — OS #{os.numeroOs}</Text>
        <Text style={styles.subtitle}>Aprovada em {new Date(aprovadaEm).toLocaleDateString('pt-BR')}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cliente</Text>
          <Text>{os.client.nome}</Text>
          {os.client.telefone && <Text>{os.client.telefone}</Text>}
          {os.client.cpfCnpj && <Text>{os.client.cpfCnpj}</Text>}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Veículo</Text>
          <Text>
            {os.vehicle.placa} — {os.vehicle.marca} {os.vehicle.modelo} {os.vehicle.ano ?? ''}
          </Text>
        </View>

        {os.entryChecklist && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Checklist de entrada #{os.entryChecklist.numeroChecklist}</Text>
            <View style={styles.tableHeader}>
              <Text style={styles.colItem}>Item</Text>
              <Text style={styles.colStatus}>Status</Text>
              <Text style={styles.colObs}>Observação</Text>
            </View>
            {os.entryChecklist.itens.map((item) => (
              <View key={item.id} style={styles.tableRow}>
                <Text style={styles.colItem}>{item.checklistItemType.nome}</Text>
                <Text style={styles.colStatus}>{checklistStatusLabels[item.status] ?? item.status}</Text>
                <Text style={styles.colObs}>{item.observacao ?? '-'}</Text>
              </View>
            ))}
            {os.entryChecklist.itens.length === 0 && <Text>Nenhum item registrado.</Text>}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Serviços realizados</Text>
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
          {os.itens.length === 0 && <Text>Nenhum serviço registrado.</Text>}
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

        <View style={styles.signatureBlock}>
          <View style={styles.signatureLine} />
          <Text style={styles.signatureCaption}>Atual Diesel — assinatura e carimbo</Text>
        </View>
      </Page>
    </Document>
  );
}
