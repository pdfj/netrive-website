import * as React from "react";
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Svg,
  Rect,
  Polygon,
  Defs,
  LinearGradient,
  Stop,
  renderToBuffer,
} from "@react-pdf/renderer";

export type InvoiceData = {
  reference: string;
  projectTitle: string;
  packageName?: string | null;
  amount: number;
  monthly?: number | null;
  clientName: string;
  businessName?: string | null;
  clientEmail?: string | null;
  issuedAt?: string | null;
};

// EFT banking details — keep in sync with lib/email.ts BANKING.
// Empty fields => the invoice tells the client details come via WhatsApp.
const BANKING = {
  bank: "GoTyme Bank",
  accountName: "Bushirah Bongani Jamirah",
  accountNumber: "51010767417",
  accountType: "Current Account",
  branchCode: "678910",
};

const CYAN = "#00d4ff";
const BLUE = "#0066ff";
const INK = "#0a0a0a";
const HAZE = "#6b7280";
const LINE = "#e5e7eb";

const s = StyleSheet.create({
  page: { paddingHorizontal: 40, paddingVertical: 30, fontSize: 10, color: "#111827", fontFamily: "Helvetica", lineHeight: 1.45 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  brandName: { fontSize: 18, fontFamily: "Helvetica-Bold", color: INK },
  brandSub: { fontSize: 8, color: HAZE, marginTop: 2 },
  invoiceTitle: { fontSize: 28, fontFamily: "Helvetica-Bold", color: INK, letterSpacing: 1 },
  metaLabel: { fontSize: 8, color: HAZE, textTransform: "uppercase" },
  metaValue: { fontSize: 11, fontFamily: "Helvetica-Bold", color: INK },
  refValue: { fontSize: 12, fontFamily: "Helvetica-Bold", color: BLUE },
  sectionLabel: { fontSize: 8, color: HAZE, textTransform: "uppercase", marginBottom: 4, letterSpacing: 0.5 },
  billBox: { backgroundColor: "#f9fafb", borderRadius: 8, padding: 14, width: "48%" },
  tableHead: { flexDirection: "row", borderBottomWidth: 1.5, borderBottomColor: INK, paddingBottom: 6, marginTop: 18 },
  th: { fontSize: 8, fontFamily: "Helvetica-Bold", color: INK, textTransform: "uppercase" },
  tr: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: LINE, paddingVertical: 8 },
  td: { fontSize: 10, color: "#111827" },
  totalRow: { flexDirection: "row", justifyContent: "flex-end", marginTop: 16 },
  totalBox: { width: "45%" },
  totalLine: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 4 },
  grandTotal: { flexDirection: "row", justifyContent: "space-between", marginTop: 6, paddingTop: 8, borderTopWidth: 1.5, borderTopColor: INK },
  grandLabel: { fontSize: 12, fontFamily: "Helvetica-Bold", color: INK },
  grandValue: { fontSize: 16, fontFamily: "Helvetica-Bold", color: BLUE },
  payBox: { marginTop: 18, backgroundColor: "#f0f7ff", borderRadius: 8, padding: 14, borderLeftWidth: 3, borderLeftColor: BLUE },
  payTitle: { fontSize: 11, fontFamily: "Helvetica-Bold", color: INK, marginBottom: 8 },
  payLine: { flexDirection: "row", marginBottom: 3 },
  payKey: { width: 110, color: HAZE, fontSize: 9 },
  payVal: { fontSize: 9, fontFamily: "Helvetica-Bold", color: INK },
  footer: { position: "absolute", bottom: 36, left: 40, right: 40, borderTopWidth: 1, borderTopColor: LINE, paddingTop: 10 },
  footerText: { fontSize: 8, color: HAZE, textAlign: "center" },
});

function rand(amount: number) {
  return `R ${amount.toLocaleString("en-ZA")}`;
}

function Logo() {
  return (
    <Svg width={42} height={42} viewBox="0 0 512 512">
      <Defs>
        <LinearGradient id="ng" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={CYAN} />
          <Stop offset="1" stopColor={BLUE} />
        </LinearGradient>
      </Defs>
      <Rect x="0" y="0" width="512" height="512" rx="120" fill={INK} />
      <Rect x="160" y="150" width="46" height="212" fill="url(#ng)" />
      <Rect x="306" y="150" width="46" height="212" fill="url(#ng)" />
      <Polygon points="160,150 206,150 296,256 250,256" fill="url(#ng)" />
      <Polygon points="216,256 262,256 352,362 306,362" fill="url(#ng)" />
    </Svg>
  );
}

function InvoiceDoc({ data }: { data: InvoiceData }) {
  const date = (data.issuedAt ? new Date(data.issuedAt) : new Date(0)).toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const hasBank = BANKING.bank && BANKING.accountNumber;

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* Header */}
        <View style={s.row}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Logo />
            <View>
              <Text style={s.brandName}>NetRive</Text>
              <Text style={s.brandSub}>Websites that work. Businesses that grow.</Text>
            </View>
          </View>
          <Text style={s.invoiceTitle}>INVOICE</Text>
        </View>

        {/* From + meta */}
        <View style={[s.row, { marginTop: 20 }]}>
          <View style={{ width: "48%" }}>
            <Text style={s.sectionLabel}>From</Text>
            <Text style={{ fontFamily: "Helvetica-Bold" }}>NetRive</Text>
            <Text style={{ color: HAZE }}>Cape Town, South Africa</Text>
            <Text style={{ color: HAZE }}>hello@netrive.com</Text>
            <Text style={{ color: HAZE }}>+27 65 653 8435</Text>
            <Text style={{ color: HAZE }}>netrive.com</Text>
          </View>
          <View style={{ width: "40%", alignItems: "flex-end" }}>
            <Text style={s.metaLabel}>Invoice reference</Text>
            <Text style={s.refValue}>{data.reference}</Text>
            <Text style={[s.metaLabel, { marginTop: 8 }]}>Date issued</Text>
            <Text style={s.metaValue}>{date}</Text>
          </View>
        </View>

        {/* Bill to */}
        <View style={{ marginTop: 16 }}>
          <Text style={s.sectionLabel}>Bill to</Text>
          <View style={s.billBox}>
            <Text style={{ fontFamily: "Helvetica-Bold" }}>{data.businessName || data.clientName}</Text>
            {data.businessName ? <Text style={{ color: HAZE }}>{data.clientName}</Text> : null}
            {data.clientEmail ? <Text style={{ color: HAZE }}>{data.clientEmail}</Text> : null}
          </View>
        </View>

        {/* Line items */}
        <View style={s.tableHead}>
          <Text style={[s.th, { width: "70%" }]}>Description</Text>
          <Text style={[s.th, { width: "30%", textAlign: "right" }]}>Amount</Text>
        </View>

        <View style={s.tr}>
          <View style={{ width: "70%" }}>
            <Text style={[s.td, { fontFamily: "Helvetica-Bold" }]}>{data.projectTitle}</Text>
            <Text style={{ fontSize: 8, color: HAZE }}>
              {data.packageName ? `${data.packageName} package · ` : ""}Website design &amp; build
            </Text>
          </View>
          <Text style={[s.td, { width: "30%", textAlign: "right" }]}>{rand(data.amount)}</Text>
        </View>

        {data.monthly ? (
          <View style={s.tr}>
            <View style={{ width: "70%" }}>
              <Text style={[s.td, { fontFamily: "Helvetica-Bold" }]}>Monthly maintenance</Text>
              <Text style={{ fontSize: 8, color: HAZE }}>Security, updates &amp; uptime — billed monthly</Text>
            </View>
            <Text style={[s.td, { width: "30%", textAlign: "right" }]}>{rand(data.monthly)} / mo</Text>
          </View>
        ) : null}

        {/* Totals */}
        <View style={s.totalRow}>
          <View style={s.totalBox}>
            <View style={s.totalLine}>
              <Text style={{ color: HAZE }}>Subtotal</Text>
              <Text>{rand(data.amount)}</Text>
            </View>
            <View style={s.grandTotal}>
              <Text style={s.grandLabel}>Total due</Text>
              <Text style={s.grandValue}>{rand(data.amount)}</Text>
            </View>
            {data.monthly ? (
              <Text style={{ fontSize: 8, color: HAZE, textAlign: "right", marginTop: 4 }}>
                + {rand(data.monthly)}/month maintenance (billed separately)
              </Text>
            ) : null}
          </View>
        </View>

        {/* Payment instructions */}
        <View style={s.payBox}>
          <Text style={s.payTitle}>How to pay (EFT)</Text>
          {hasBank ? (
            <>
              <View style={s.payLine}><Text style={s.payKey}>Bank</Text><Text style={s.payVal}>{BANKING.bank}</Text></View>
              <View style={s.payLine}><Text style={s.payKey}>Account name</Text><Text style={s.payVal}>{BANKING.accountName}</Text></View>
              <View style={s.payLine}><Text style={s.payKey}>Account number</Text><Text style={s.payVal}>{BANKING.accountNumber}</Text></View>
              <View style={s.payLine}><Text style={s.payKey}>Account type</Text><Text style={s.payVal}>{BANKING.accountType}</Text></View>
              <View style={s.payLine}><Text style={s.payKey}>Branch code</Text><Text style={s.payVal}>{BANKING.branchCode}</Text></View>
              <View style={s.payLine}><Text style={s.payKey}>Payment reference</Text><Text style={s.payVal}>{data.reference}</Text></View>
              <Text style={{ fontSize: 9, fontFamily: "Helvetica-Bold", color: BLUE, marginTop: 8 }}>
                Please send IMMEDIATE / real-time payment so we can confirm without delay.
              </Text>
            </>
          ) : (
            <Text style={{ fontSize: 9, color: "#1f2937" }}>
              We&apos;ll send our EFT banking details on WhatsApp (+27 65 653 8435). Use reference{" "}
              <Text style={{ fontFamily: "Helvetica-Bold" }}>{data.reference}</Text> when you pay.
            </Text>
          )}
          <Text style={{ fontSize: 8, color: HAZE, marginTop: 8 }}>
            Use the payment reference above so we can match your payment. After paying, tap
            &quot;I&apos;ve paid this invoice&quot; in your dashboard — we confirm within 12–24 hours
            and deliver your live site.
          </Text>
        </View>

        {/* Footer */}
        <View style={s.footer}>
          <Text style={s.footerText}>
            Thank you for choosing NetRive · You only pay after approving your free preview ·
            netrive.com · hello@netrive.com
          </Text>
        </View>
      </Page>
    </Document>
  );
}

export async function renderInvoicePdf(data: InvoiceData): Promise<Buffer> {
  return renderToBuffer(<InvoiceDoc data={data} />);
}
