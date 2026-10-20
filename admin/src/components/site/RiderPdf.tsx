import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { totalQuantity, type Rider } from "./rider";

const ink = "#171717";
const muted = "#6b6b66";
const rule = "#d9d9d4";
const accent = "#4f63d8";

const s = StyleSheet.create({
  page: { padding: 48, paddingBottom: 70, fontFamily: "Helvetica", fontSize: 10, color: ink, lineHeight: 1.4 },
  label: { fontSize: 8, letterSpacing: 2, color: muted, textTransform: "uppercase" },
  top: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", borderBottomWidth: 2, borderBottomColor: ink, paddingBottom: 14 },
  artist: { fontFamily: "Helvetica-Bold", fontSize: 30, letterSpacing: -0.6, lineHeight: 1.05, marginTop: 6, maxWidth: 360 },
  docType: { fontFamily: "Helvetica-Bold", fontSize: 11, letterSpacing: 1.5, textAlign: "right" },
  contact: { flexDirection: "row", marginTop: 18, marginBottom: 26, borderBottomWidth: 1, borderBottomColor: rule, paddingBottom: 16 },
  contactCell: { flex: 1, paddingRight: 12 },
  contactValue: { fontSize: 10.5, marginTop: 4 },
  group: { marginBottom: 18 },
  groupTitle: { flexDirection: "row", justifyContent: "space-between", borderBottomWidth: 1, borderBottomColor: ink, paddingBottom: 5, marginBottom: 2 },
  groupName: { fontFamily: "Helvetica-Bold", fontSize: 12 },
  groupCount: { fontSize: 8, color: muted, letterSpacing: 1 },
  row: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: rule, paddingVertical: 7 },
  qty: { width: 42, fontFamily: "Helvetica-Bold", color: accent },
  item: { flex: 1.3, paddingRight: 12 },
  notes: { flex: 1, color: muted },
  headRow: { flexDirection: "row", paddingTop: 2, paddingBottom: 4 },
  notesBlock: { marginTop: 10, borderTopWidth: 2, borderTopColor: ink, paddingTop: 10 },
  notesText: { marginTop: 6, fontSize: 10, lineHeight: 1.55 },
  footer: { position: "absolute", left: 48, right: 48, bottom: 30, flexDirection: "row", justifyContent: "space-between", fontSize: 7.5, color: muted, borderTopWidth: 1, borderTopColor: rule, paddingTop: 8 },
});

export default function RiderPdf({ rider }: { rider: Rider }) {
  const contact = [
    { label: "Contact", value: rider.contactName },
    { label: "Phone", value: rider.phone },
    { label: "Email", value: rider.email },
  ].filter(cell => cell.value.trim());

  return <Document title={`${rider.artist} — Backline Rider`} author={rider.contactName} creator="Paris Backline Rider Builder" producer="parisbackline.com">
    <Page size="LETTER" style={s.page}>
      <View style={s.top}>
        <View><Text style={s.label}>Artist</Text><Text style={s.artist}>{rider.artist}</Text></View>
        <Text style={s.docType}>BACKLINE{"\n"}RIDER</Text>
      </View>
      <View style={s.contact}>
        {contact.map(cell => <View key={cell.label} style={s.contactCell}><Text style={s.label}>{cell.label}</Text><Text style={s.contactValue}>{cell.value}</Text></View>)}
      </View>
      <View style={s.group}>
        <View style={s.groupTitle} minPresenceAhead={60}><Text style={s.groupName}>Backline</Text><Text style={s.groupCount}>{totalQuantity(rider.items)} PIECES</Text></View>
        <View style={s.headRow}><Text style={[s.label, { width: 42 }]}>Qty</Text><Text style={[s.label, { flex: 1.3 }]}>Item</Text><Text style={[s.label, { flex: 1 }]}>Notes</Text></View>
        {rider.items.map(item => <View key={item.id} style={s.row} wrap={false}><Text style={s.qty}>{item.quantity}×</Text><Text style={s.item}>{item.item}</Text><Text style={s.notes}>{item.notes}</Text></View>)}
      </View>
      {rider.notes.trim() ? <View style={s.notesBlock} wrap={false}><Text style={s.label}>Additional notes</Text><Text style={s.notesText}>{rider.notes}</Text></View> : null}
      <View style={s.footer} fixed>
        <Text>{rider.artist} · Backline rider</Text>
        <Text render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}  ·  Made with the Paris Backline Rider Builder`} />
      </View>
    </Page>
  </Document>;
}
