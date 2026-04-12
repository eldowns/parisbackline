import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const gold = "#c8a44a";
const bg = "#09090f";
const surface = "#111118";
const border = "#1e1e2a";
const textPrimary = "#f1f5f9";
const textSecondary = "#94a3b8";
const textMuted = "#606070";

const s = StyleSheet.create({
  page: {
    backgroundColor: bg,
    padding: 48,
    fontFamily: "Helvetica",
    color: textPrimary,
    fontSize: 10,
    fontWeight: 300,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 40,
  },
  logo: {
    fontSize: 22,
    fontWeight: 700,
    letterSpacing: 2,
    color: textPrimary,
  },
  logoAccent: {
    color: gold,
  },
  invoiceLabel: {
    fontSize: 28,
    fontWeight: 700,
    letterSpacing: 3,
    color: gold,
    textAlign: "right" as const,
  },
  invoiceDate: {
    fontSize: 9,
    color: textSecondary,
    textAlign: "right" as const,
    marginTop: 4,
  },
  rule: {
    width: 40,
    height: 1,
    backgroundColor: gold,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 8,
    fontWeight: 600,
    color: textMuted,
    letterSpacing: 2,
    textTransform: "uppercase" as const,
    marginBottom: 8,
  },
  clientName: {
    fontSize: 16,
    fontWeight: 600,
    color: textPrimary,
    marginBottom: 2,
  },
  clientDetail: {
    fontSize: 10,
    color: textSecondary,
    marginBottom: 1,
  },
  table: {
    marginTop: 32,
    marginBottom: 32,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: border,
    paddingBottom: 8,
    marginBottom: 8,
  },
  tableHeaderText: {
    fontSize: 8,
    fontWeight: 600,
    color: textMuted,
    letterSpacing: 1.5,
    textTransform: "uppercase" as const,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#141420",
  },
  tableCell: {
    fontSize: 10,
    color: textPrimary,
  },
  tableCellMuted: {
    fontSize: 10,
    color: textSecondary,
  },
  colItem: { flex: 3 },
  colQty: { width: 40, textAlign: "center" as const },
  colPrice: { width: 70, textAlign: "right" as const },
  colTotal: { width: 70, textAlign: "right" as const },
  totalsSection: {
    marginTop: 16,
    alignItems: "flex-end" as const,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    width: 220,
    paddingVertical: 4,
  },
  totalLabel: {
    flex: 1,
    fontSize: 10,
    color: textSecondary,
  },
  totalValue: {
    width: 80,
    fontSize: 10,
    fontWeight: 600,
    color: textPrimary,
    textAlign: "right" as const,
  },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    width: 220,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: gold,
    marginTop: 4,
  },
  grandTotalLabel: {
    flex: 1,
    fontSize: 12,
    fontWeight: 700,
    color: textPrimary,
  },
  grandTotalValue: {
    width: 80,
    fontSize: 12,
    fontWeight: 700,
    color: gold,
    textAlign: "right" as const,
  },
  paymentSection: {
    marginTop: 40,
    backgroundColor: surface,
    padding: 20,
    borderWidth: 1,
    borderColor: border,
  },
  paymentTitle: {
    fontSize: 10,
    fontWeight: 600,
    color: textPrimary,
    marginBottom: 12,
    letterSpacing: 1,
    textTransform: "uppercase" as const,
  },
  paymentGrid: {
    flexDirection: "row",
    gap: 32,
  },
  paymentItem: {},
  paymentLabel: {
    fontSize: 8,
    color: textMuted,
    letterSpacing: 1,
    textTransform: "uppercase" as const,
    marginBottom: 3,
  },
  paymentValue: {
    fontSize: 12,
    fontWeight: 600,
    color: textPrimary,
  },
  footer: {
    position: "absolute" as const,
    bottom: 40,
    left: 48,
    right: 48,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: border,
    paddingTop: 16,
  },
  footerText: {
    fontSize: 8,
    color: textMuted,
  },
  notesSection: {
    marginTop: 28,
  },
  notesText: {
    fontSize: 9,
    color: textSecondary,
    lineHeight: 1.6,
  },
  dateRow: {
    flexDirection: "row",
    gap: 24,
    marginTop: 8,
  },
});

interface InvoiceData {
  invoiceNumber: string;
  date: string;
  client: {
    name: string;
    email?: string | null;
    phone?: string | null;
    company?: string | null;
  };
  dateStart: string;
  dateEnd: string;
  equipment: {
    name: string;
    quantity: number;
    rentalPrice: number;
  }[];
  subRentals: {
    provider: string;
    description: string;
    cost: number;
  }[];
  deliveryFee: number;
  discountType?: "amount" | "percent";
  discountValue?: number;
  notes?: string | null;
}

export function InvoicePDF({ data }: { data: InvoiceData }) {
  const equipmentTotal = data.equipment.reduce((s, e) => s + e.rentalPrice * e.quantity, 0);
  const subRentalTotal = data.subRentals.reduce((s, sr) => s + sr.cost, 0);
  const subtotal = equipmentTotal + subRentalTotal;
  const discountAmount =
    data.discountValue && data.discountValue > 0
      ? data.discountType === "percent"
        ? subtotal * (data.discountValue / 100)
        : data.discountValue
      : 0;
  const grandTotal = subtotal - discountAmount + data.deliveryFee;

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* Header */}
        <View style={s.header}>
          <View>
            <Text style={s.logo}>
              PARIS <Text style={s.logoAccent}>BACKLINE</Text>
            </Text>
            <Text style={{ fontSize: 8, color: textMuted, letterSpacing: 2, marginTop: 4 }}>
              LOS ANGELES, CA
            </Text>
          </View>
          <View>
            <Text style={s.invoiceLabel}>INVOICE</Text>
            <Text style={s.invoiceDate}>{data.invoiceNumber}</Text>
            <Text style={s.invoiceDate}>{data.date}</Text>
          </View>
        </View>

        <View style={s.rule} />

        {/* Bill To */}
        <View>
          <Text style={s.sectionTitle}>Bill To</Text>
          <Text style={s.clientName}>{data.client.company || data.client.name}</Text>
          {data.client.company && <Text style={s.clientDetail}>{data.client.name}</Text>}
          {data.client.email && <Text style={s.clientDetail}>{data.client.email}</Text>}
          {data.client.phone && <Text style={s.clientDetail}>{data.client.phone}</Text>}
        </View>

        {/* Rental Period */}
        <View style={s.dateRow}>
          <View>
            <Text style={s.sectionTitle}>Rental Start</Text>
            <Text style={{ fontSize: 11, color: textPrimary }}>{data.dateStart}</Text>
          </View>
          <View>
            <Text style={s.sectionTitle}>Rental End</Text>
            <Text style={{ fontSize: 11, color: textPrimary }}>{data.dateEnd}</Text>
          </View>
        </View>

        {/* Equipment Table */}
        <View style={s.table}>
          <View style={s.tableHeader}>
            <Text style={[s.tableHeaderText, s.colItem]}>Item</Text>
            <Text style={[s.tableHeaderText, s.colQty]}>Qty</Text>
            <Text style={[s.tableHeaderText, s.colPrice]}>Price</Text>
            <Text style={[s.tableHeaderText, s.colTotal]}>Total</Text>
          </View>
          {data.equipment.map((item, i) => (
            <View key={i} style={s.tableRow}>
              <Text style={[s.tableCell, s.colItem]}>{item.name}</Text>
              <Text style={[s.tableCellMuted, s.colQty]}>{item.quantity}</Text>
              <Text style={[s.tableCellMuted, s.colPrice]}>${item.rentalPrice.toFixed(2)}</Text>
              <Text style={[s.tableCell, s.colTotal]}>${(item.rentalPrice * item.quantity).toFixed(2)}</Text>
            </View>
          ))}
          {data.subRentals.map((sr, i) => (
            <View key={`sr-${i}`} style={s.tableRow}>
              <Text style={[s.tableCell, s.colItem]}>{sr.description} (via {sr.provider})</Text>
              <Text style={[s.tableCellMuted, s.colQty]}>1</Text>
              <Text style={[s.tableCellMuted, s.colPrice]}>${sr.cost.toFixed(2)}</Text>
              <Text style={[s.tableCell, s.colTotal]}>${sr.cost.toFixed(2)}</Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={s.totalsSection}>
          <View style={s.totalRow}>
            <Text style={s.totalLabel}>Equipment</Text>
            <Text style={s.totalValue}>${equipmentTotal.toFixed(2)}</Text>
          </View>
          {subRentalTotal > 0 && (
            <View style={s.totalRow}>
              <Text style={s.totalLabel}>Sub-Rentals</Text>
              <Text style={s.totalValue}>${subRentalTotal.toFixed(2)}</Text>
            </View>
          )}
          {discountAmount > 0 && (
            <View style={s.totalRow}>
              <Text style={s.totalLabel}>
                Discount{data.discountType === "percent" ? ` (${data.discountValue}%)` : ""}
              </Text>
              <Text style={s.totalValue}>−${discountAmount.toFixed(2)}</Text>
            </View>
          )}
          {data.deliveryFee > 0 && (
            <View style={s.totalRow}>
              <Text style={s.totalLabel}>Delivery</Text>
              <Text style={s.totalValue}>${data.deliveryFee.toFixed(2)}</Text>
            </View>
          )}
          <View style={s.grandTotalRow}>
            <Text style={s.grandTotalLabel}>Total Due</Text>
            <Text style={s.grandTotalValue}>${grandTotal.toFixed(2)}</Text>
          </View>
        </View>

        {/* Notes */}
        {data.notes && (
          <View style={s.notesSection}>
            <Text style={s.sectionTitle}>Notes</Text>
            <Text style={s.notesText}>{data.notes}</Text>
          </View>
        )}

        {/* Payment Info */}
        <View style={s.paymentSection}>
          <Text style={s.paymentTitle}>Payment Information — Bank Transfer (ACH)</Text>
          <View style={s.paymentGrid}>
            <View style={s.paymentItem}>
              <Text style={s.paymentLabel}>Account Number</Text>
              <Text style={s.paymentValue}>103035011</Text>
            </View>
            <View style={s.paymentItem}>
              <Text style={s.paymentLabel}>Routing Number</Text>
              <Text style={s.paymentValue}>211370150</Text>
            </View>
            <View style={s.paymentItem}>
              <Text style={s.paymentLabel}>Account Type</Text>
              <Text style={s.paymentValue}>Checking</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={s.footer}>
          <Text style={s.footerText}>PARIS BACKLINE</Text>
          <Text style={s.footerText}>parisbackline.com</Text>
        </View>
      </Page>
    </Document>
  );
}
