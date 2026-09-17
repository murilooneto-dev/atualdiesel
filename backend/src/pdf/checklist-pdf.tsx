import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import type { EntryChecklistWithRelations } from './pdf.types.js';

const styles = StyleSheet.create({
  page: { padding: 32, fontSize: 10, fontFamily: 'Helvetica' },
  title: { fontSize: 16, marginBottom: 4, fontFamily: 'Helvetica-Bold' },
  subtitle: { fontSize: 10, color: '#555', marginBottom: 16 },
  section: { marginBottom: 12 },
  sectionTitle: { fontSize: 11, fontFamily: 'Helvetica-Bold', marginBottom: 4 },
  tableHeader: { flexDirection: 'row', borderBottom: '1 solid #333', paddingBottom: 4, marginBottom: 4 },
  tableRow: { flexDirection: 'row', paddingVertical: 2, borderBottom: '1 solid #eee' },
  colItem: { flex: 3 },
  colStatus: { flex: 1 },
  colObs: { flex: 3 },
  photosGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  photo: { width: 120, height: 90, objectFit: 'cover' },
});

const nivelLabels: Record<string, string> = {
  RESERVA: 'Reserva',
  UM_QUARTO: '1/4',
  METADE: '1/2',
  TRES_QUARTOS: '3/4',
  CHEIO: 'Cheio',
};

const statusLabels: Record<string, string> = {
  OK: 'OK',
  ATENCAO: 'Atenção',
  NAO_APLICAVEL: 'Não aplicável',
};

export function ChecklistPdf({ checklist }: { checklist: EntryChecklistWithRelations }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Atual Diesel — Checklist de Entrada #{checklist.numeroChecklist}</Text>
        <Text style={styles.subtitle}>
          Realizado em {new Date(checklist.criadoEm).toLocaleDateString('pt-BR')}
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Veículo</Text>
          <Text>
            {checklist.vehicle.placa} — {checklist.vehicle.marca} {checklist.vehicle.modelo}{' '}
            {checklist.vehicle.ano ?? ''}
          </Text>
          <Text>Quilometragem: {checklist.quilometragem} km</Text>
          <Text>Combustível: {nivelLabels[checklist.nivelCombustivel] ?? checklist.nivelCombustivel}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Itens verificados</Text>
          <View style={styles.tableHeader}>
            <Text style={styles.colItem}>Item</Text>
            <Text style={styles.colStatus}>Status</Text>
            <Text style={styles.colObs}>Observação</Text>
          </View>
          {checklist.itens.map((item) => (
            <View key={item.id} style={styles.tableRow}>
              <Text style={styles.colItem}>{item.checklistItemType.nome}</Text>
              <Text style={styles.colStatus}>{statusLabels[item.status] ?? item.status}</Text>
              <Text style={styles.colObs}>{item.observacao ?? '-'}</Text>
            </View>
          ))}
          {checklist.itens.length === 0 && <Text>Nenhum item registrado.</Text>}
        </View>

        {checklist.observacoesGerais && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Observações gerais</Text>
            <Text>{checklist.observacoesGerais}</Text>
          </View>
        )}

        {checklist.fotos.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Fotos</Text>
            <View style={styles.photosGrid}>
              {checklist.fotos.map((foto) => (
                <Image key={foto.id} src={foto.urlStorage} style={styles.photo} />
              ))}
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
}
