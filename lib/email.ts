import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
// hello@ = warm, human onboarding. info@ = automated brand concierge
// (invoices, confirmations, internal alerts). Automated mail sets
// reply-to: hello@ so a client who hits "reply" still reaches a human.
const FROM = "NetRive <hello@netrive.com>";
const INFO_FROM = "NetRive <info@netrive.com>";
const REPLY_TO = "hello@netrive.com";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "hello@netrive.com";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.netrive.com";
const BANNER_URL = `${SITE_URL}/images/email/welcome-banner.png`;

// EFT banking details shown on invoices.
// Keep in sync with lib/invoice-pdf.tsx BANKING.
export const BANKING = {
  bank: "GoTyme Bank",
  accountName: "Bushirah Bongani Jamirah",
  accountNumber: "51010767417",
  accountType: "Current Account",
  branchCode: "678910",
};

function bankingBlock(reference: string) {
  const hasDetails = BANKING.bank && BANKING.accountNumber;
  if (!hasDetails) {
    return `<p style="margin:0;font-size:13px;color:#9aa3b2;">
      We'll send our EFT banking details to you on WhatsApp — use reference
      <strong style="color:#ffffff;">${reference}</strong> when you pay.
    </p>`;
  }
  return `<table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
    ${[
      ["Bank", BANKING.bank],
      ["Account name", BANKING.accountName],
      ["Account number", BANKING.accountNumber],
      ["Account type", BANKING.accountType],
      ["Branch code", BANKING.branchCode],
      ["Payment reference", reference],
    ]
      .map(
        ([label, value]) => `
    <tr>
      <td style="padding:6px 0;color:#9aa3b2;width:150px;">${label}</td>
      <td style="padding:6px 0;color:#ffffff;font-weight:600;">${value}</td>
    </tr>`
      )
      .join("")}
  </table>
  <p style="margin:12px 0 0;font-size:13px;font-weight:600;color:#ff7a1a;">
    Please send immediate / real-time payment so we can confirm without delay.
  </p>`;
}

function emailShell(content: string, withBanner = false) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>NetRive</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Inter',Arial,sans-serif;color:#ffffff;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;">
  <tr><td align="center" style="padding:40px 16px;">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
      ${
        withBanner
          ? `<tr><td style="padding-bottom:24px;">
              <img src="${BANNER_URL}" alt="Welcome to NetRive" width="600" style="width:100%;height:auto;border-radius:20px;display:block;" />
            </td></tr>`
          : `<tr><td style="padding-bottom:32px;text-align:center;">
              <span style="font-family:'Arial Black',Arial,sans-serif;font-size:22px;font-weight:900;letter-spacing:-0.5px;color:#ffffff;">Net<span style="color:#00a8ff;">Rive</span></span>
            </td></tr>`
      }
      <tr><td style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:20px;padding:40px 36px;">
        ${content}
      </td></tr>
      <tr><td style="padding-top:28px;text-align:center;font-size:12px;color:#9aa3b2;">
        NetRive · Cape Town, South Africa · <a href="${SITE_URL}" style="color:#00a8ff;text-decoration:none;">netrive.com</a>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
}

const CTA_STYLE =
  "display:inline-block;background:linear-gradient(120deg,#ff7a1a,#d97757);color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;padding:14px 36px;border-radius:50px;letter-spacing:0.02em;";

export async function sendProjectConfirmationEmail({
  to,
  name,
  projectTitle,
  dashboardLink,
  isNewUser,
  reference,
}: {
  to: string;
  name: string;
  projectTitle: string;
  dashboardLink: string;
  isNewUser: boolean;
  reference?: string | null;
}) {
  const content = `
    <h1 style="margin:0 0 8px;font-size:26px;font-weight:700;color:#ffffff;">
      ${isNewUser ? `Welcome aboard, ${name}! 🎉` : "Your project is in good hands 🚀"}
    </h1>
    <p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:#9aa3b2;">
      ${
        isNewUser
          ? "Your NetRive client account is ready, and your project is already with our team. Here's what happens next:"
          : `Hi ${name}, we've received your new project and our team is already reviewing it.`
      }
    </p>
    <div style="background:rgba(255,122,26,0.08);border:1px solid rgba(255,138,61,0.2);border-radius:14px;padding:20px 24px;margin-bottom:28px;">
      <p style="margin:0;font-size:13px;color:#9aa3b2;text-transform:uppercase;letter-spacing:0.1em;">Project received</p>
      <p style="margin:6px 0 0;font-size:17px;font-weight:600;color:#ffffff;">${projectTitle}</p>
      ${reference ? `<p style="margin:6px 0 0;font-family:monospace;font-size:14px;font-weight:700;color:#ff7a1a;">${reference}</p>` : ""}
    </div>
    <p style="margin:0 0 8px;font-size:14px;color:#9aa3b2;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;">What happens next</p>
    <ol style="margin:0 0 28px;padding-left:20px;font-size:14px;line-height:2;color:#9aa3b2;">
      <li>We review your brief <span style="color:#ffffff;">(usually within a few hours)</span></li>
      <li>We build your <span style="color:#ffffff;">free preview</span> — no payment until you approve it</li>
      <li>Track everything and chat with us in your dashboard</li>
    </ol>
    <div style="text-align:center;margin-bottom:28px;">
      <a href="${dashboardLink}" style="${CTA_STYLE}">
        Go to my dashboard →
      </a>
    </div>
    <p style="margin:0;font-size:13px;color:#9aa3b2;text-align:center;">
      Questions? Reply to this email or WhatsApp us at ${process.env.ADMIN_WHATSAPP_NUMBER ?? "+27656538435"}
    </p>
  `;

  await resend.emails.send({
    from: FROM,
    to,
    subject: isNewUser
      ? `🎉 Welcome to NetRive — ${projectTitle} received`
      : `🚀 Project received — ${projectTitle}`,
    html: emailShell(content, true),
  });
}

export async function sendAdminNotificationEmail({
  clientName,
  clientEmail,
  clientPhone,
  businessName,
  pkg,
  projectTitle,
  description,
}: {
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  businessName?: string;
  pkg?: string;
  projectTitle: string;
  description?: string;
}) {
  const content = `
    <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#ffffff;">
      New project submission 📥
    </h1>
    <p style="margin:0 0 24px;font-size:15px;color:#9aa3b2;">A new project has been submitted via netrive.com</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      ${[
        ["Client", clientName],
        ["Email", clientEmail],
        ["Phone/WhatsApp", clientPhone || "—"],
        ["Business", businessName || "—"],
        ["Package", pkg || "—"],
      ]
        .map(
          ([label, value]) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);font-size:13px;color:#9aa3b2;width:130px;">${label}</td>
        <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);font-size:14px;color:#ffffff;font-weight:500;">${value}</td>
      </tr>`
        )
        .join("")}
    </table>
    ${description ? `
    <p style="margin:0 0 8px;font-size:13px;color:#9aa3b2;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;">Project brief</p>
    <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:16px 20px;margin-bottom:24px;font-size:14px;line-height:1.7;color:#ffffff;">${description}</div>
    ` : ""}
    <div style="text-align:center;">
      <a href="${SITE_URL}/admin" style="${CTA_STYLE}">
        Open admin dashboard →
      </a>
    </div>
  `;

  await resend.emails.send({
    from: INFO_FROM,
    replyTo: REPLY_TO,
    to: ADMIN_EMAIL,
    subject: `New project: ${projectTitle}`,
    html: emailShell(content),
  });
}

// ── Invoice emails ────────────────────────────────────────────────

export async function sendInvoiceEmail({
  to,
  name,
  projectTitle,
  reference,
  amount,
  monthly,
  pdf,
}: {
  to: string;
  name: string;
  projectTitle: string;
  reference: string;
  amount: number;
  monthly?: number | null;
  pdf?: Buffer | null;
}) {
  const content = `
    <h1 style="margin:0 0 8px;font-size:26px;font-weight:700;color:#ffffff;">
      Your invoice from NetRive 🧾
    </h1>
    <p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:#9aa3b2;">
      Hi ${name}, you approved your preview — amazing! Here's your invoice. Once paid, your live site goes out within 12–24 hours of confirmation.
    </p>
    <div style="background:rgba(255,122,26,0.08);border:1px solid rgba(255,138,61,0.2);border-radius:14px;padding:24px;margin-bottom:24px;text-align:center;">
      <p style="margin:0;font-size:13px;color:#9aa3b2;text-transform:uppercase;letter-spacing:0.1em;">${projectTitle}</p>
      <p style="margin:10px 0 0;font-size:38px;font-weight:800;color:#ffffff;">R${amount.toLocaleString("en-ZA")}</p>
      ${monthly ? `<p style="margin:6px 0 0;font-size:14px;color:#9aa3b2;">+ R${monthly.toLocaleString("en-ZA")}/month maintenance</p>` : ""}
      <p style="margin:12px 0 0;font-family:monospace;font-size:16px;font-weight:700;color:#ff7a1a;">${reference}</p>
    </div>
    <p style="margin:0 0 10px;font-size:14px;color:#9aa3b2;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;">How to pay (EFT)</p>
    <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:16px 20px;margin-bottom:24px;">
      ${bankingBlock(reference)}
    </div>
    <ol style="margin:0 0 28px;padding-left:20px;font-size:14px;line-height:2;color:#9aa3b2;">
      <li>Pay by EFT using reference <strong style="color:#ffffff;">${reference}</strong></li>
      <li>Open your dashboard and tap <strong style="color:#ffffff;">"I've paid this invoice"</strong></li>
      <li>We confirm within <strong style="color:#ffffff;">12–24 hours</strong> and deliver your live site 🎉</li>
    </ol>
    <div style="text-align:center;">
      <a href="${SITE_URL}/dashboard" style="${CTA_STYLE}">
        View invoice in my dashboard →
      </a>
    </div>
  `;

  await resend.emails.send({
    from: INFO_FROM,
    replyTo: REPLY_TO,
    to,
    subject: `🧾 Invoice ${reference} — R${amount.toLocaleString("en-ZA")} · ${projectTitle}`,
    html: emailShell(content, true),
    attachments: pdf
      ? [{ filename: `Invoice-${reference}.pdf`, content: pdf }]
      : undefined,
  });
}

export async function sendInvoicePaidClaimEmail({
  clientName,
  projectTitle,
  reference,
  amount,
  projectId,
}: {
  clientName: string;
  projectTitle: string;
  reference: string;
  amount: number | null;
  projectId: string;
}) {
  const content = `
    <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#ffffff;">
      💰 ${clientName} says they've paid
    </h1>
    <p style="margin:0 0 20px;font-size:15px;line-height:1.7;color:#9aa3b2;">
      Check your bank for reference <strong style="color:#ff7a1a;font-family:monospace;">${reference}</strong>
      ${amount ? `(R${amount.toLocaleString("en-ZA")})` : ""} — then confirm in the admin so they get their live site.
    </p>
    <p style="margin:0 0 24px;font-size:14px;color:#ffffff;font-weight:600;">${projectTitle}</p>
    <div style="text-align:center;">
      <a href="${SITE_URL}/admin/projects/${projectId}" style="${CTA_STYLE}">
        Review &amp; confirm payment →
      </a>
    </div>
  `;

  await resend.emails.send({
    from: INFO_FROM,
    replyTo: REPLY_TO,
    to: ADMIN_EMAIL,
    subject: `💰 Payment claimed — ${reference} · ${projectTitle}`,
    html: emailShell(content),
  });
}

export async function sendPaymentConfirmedEmail({
  to,
  name,
  projectTitle,
  reference,
}: {
  to: string;
  name: string;
  projectTitle: string;
  reference: string;
}) {
  const content = `
    <h1 style="margin:0 0 8px;font-size:26px;font-weight:700;color:#ffffff;">
      Payment confirmed — you're live soon! 🎉
    </h1>
    <p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:#9aa3b2;">
      Hi ${name}, we've received your payment for <strong style="color:#ffffff;">${projectTitle}</strong>
      (<span style="font-family:monospace;color:#ff7a1a;">${reference}</span>).
      Your live website is being delivered now — we'll be in touch with the final details.
    </p>
    <div style="text-align:center;">
      <a href="${SITE_URL}/dashboard" style="${CTA_STYLE}">
        Go to my dashboard →
      </a>
    </div>
  `;

  await resend.emails.send({
    from: INFO_FROM,
    replyTo: REPLY_TO,
    to,
    subject: `🎉 Payment confirmed — ${reference} · your site is on the way`,
    html: emailShell(content, true),
  });
}

// Live-agent request — goes to the OWNER's personal inbox so they can jump in.
export async function sendLiveAgentRequestEmail({
  clientName,
  clientEmail,
  projectTitle,
  reference,
  projectId,
  recent,
}: {
  clientName: string;
  clientEmail: string | null;
  projectTitle: string | null;
  reference: string | null;
  projectId: string | null;
  recent: string;
}) {
  const to = process.env.LIVE_AGENT_EMAIL ?? "malgasuser@gmail.com";
  const adminLink = projectId
    ? `${SITE_URL}/admin/projects/${projectId}`
    : `${SITE_URL}/admin`;

  const content = `
    <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#ffffff;">
      🙋 ${clientName} wants to talk to a real person
    </h1>
    <p style="margin:0 0 18px;font-size:15px;line-height:1.7;color:#9aa3b2;">
      Someone asked to speak to the live team in the website chat. Jump in and reply to them in their project chat.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
      ${[
        ["Name", clientName],
        ["Contact", clientEmail || "—"],
        ["Project", projectTitle || "Not a logged-in client (general visitor)"],
        ["Reference", reference || "—"],
      ]
        .map(
          ([label, value]) => `
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.06);font-size:13px;color:#9aa3b2;width:110px;">${label}</td>
        <td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.06);font-size:14px;color:#ffffff;font-weight:500;">${value}</td>
      </tr>`
        )
        .join("")}
    </table>
    ${recent ? `
    <p style="margin:0 0 8px;font-size:13px;color:#9aa3b2;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;">Recent chat</p>
    <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:14px 18px;margin-bottom:22px;font-size:13px;line-height:1.7;color:#ffffff;white-space:pre-wrap;">${recent.replace(/</g, "&lt;")}</div>
    ` : ""}
    <div style="text-align:center;">
      <a href="${adminLink}" style="${CTA_STYLE}">
        Open in admin &amp; reply →
      </a>
    </div>
  `;

  await resend.emails.send({
    from: FROM, // from hello@ (human-facing alert)
    replyTo: clientEmail || REPLY_TO,
    to,
    subject: `🙋 Live chat request from ${clientName}${reference ? ` · ${reference}` : ""}`,
    html: emailShell(content),
  });
}
