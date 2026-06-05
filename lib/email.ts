import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = "NetRive <hello@netrive.com>";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "hello@netrive.com";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.netrive.com";

function emailShell(content: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>NetRive</title>
</head>
<body style="margin:0;padding:0;background:#000000;font-family:'Inter',Arial,sans-serif;color:#ffffff;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#000000;">
  <tr><td align="center" style="padding:40px 16px;">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
      <!-- Logo -->
      <tr><td style="padding-bottom:32px;text-align:center;">
        <span style="font-family:'Arial Black',Arial,sans-serif;font-size:22px;font-weight:900;letter-spacing:-0.5px;color:#ffffff;">Net<span style="color:#2c5fff;">Rive</span></span>
      </td></tr>
      <!-- Card -->
      <tr><td style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:20px;padding:40px 36px;">
        ${content}
      </td></tr>
      <!-- Footer -->
      <tr><td style="padding-top:28px;text-align:center;font-size:12px;color:#a0aaba;">
        NetRive · Cape Town, South Africa · <a href="${SITE_URL}" style="color:#2c5fff;text-decoration:none;">netrive.com</a>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
}

export async function sendProjectConfirmationEmail({
  to,
  name,
  projectTitle,
  dashboardLink,
  isNewUser,
}: {
  to: string;
  name: string;
  projectTitle: string;
  dashboardLink: string;
  isNewUser: boolean;
}) {
  const content = `
    <h1 style="margin:0 0 8px;font-size:26px;font-weight:700;color:#ffffff;">
      Your project is in good hands 🚀
    </h1>
    <p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:#a0aaba;">
      Hi ${name}, we've received your project and our team is already reviewing it. Here's what happens next:
    </p>
    <div style="background:rgba(44,95,255,0.08);border:1px solid rgba(44,95,255,0.2);border-radius:14px;padding:20px 24px;margin-bottom:28px;">
      <p style="margin:0;font-size:13px;color:#a0aaba;text-transform:uppercase;letter-spacing:0.1em;">Project Received</p>
      <p style="margin:6px 0 0;font-size:17px;font-weight:600;color:#ffffff;">${projectTitle}</p>
    </div>
    <p style="margin:0 0 8px;font-size:14px;color:#a0aaba;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;">What happens next</p>
    <ol style="margin:0 0 28px;padding-left:20px;font-size:14px;line-height:2;color:#a0aaba;">
      <li>We review your brief <span style="color:#ffffff;">(usually within a few hours)</span></li>
      <li>We'll reach out on WhatsApp or email to confirm details</li>
      <li>Work begins — you can track every update in your dashboard</li>
    </ol>
    ${isNewUser ? `
    <p style="margin:0 0 16px;font-size:14px;color:#a0aaba;">
      We've created your client dashboard. Click below to ${isNewUser ? "set your password and " : ""}access your project:
    </p>` : `
    <p style="margin:0 0 16px;font-size:14px;color:#a0aaba;">
      Track your new project in your dashboard:
    </p>`}
    <div style="text-align:center;margin-bottom:28px;">
      <a href="${dashboardLink}" style="display:inline-block;background:#2c5fff;color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;padding:14px 36px;border-radius:50px;letter-spacing:0.02em;">
        ${isNewUser ? "Set Password & View Dashboard" : "View My Dashboard"} →
      </a>
    </div>
    <p style="margin:0;font-size:13px;color:#a0aaba;text-align:center;">
      Questions? Reply to this email or WhatsApp us at ${process.env.ADMIN_WHATSAPP_NUMBER ?? "+27835153674"}
    </p>
  `;

  await resend.emails.send({
    from: FROM,
    to,
    subject: `🚀 Project received — ${projectTitle}`,
    html: emailShell(content),
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
    <p style="margin:0 0 24px;font-size:15px;color:#a0aaba;">A new project has been submitted via netrive.com</p>
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
        <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);font-size:13px;color:#a0aaba;width:130px;">${label}</td>
        <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);font-size:14px;color:#ffffff;font-weight:500;">${value}</td>
      </tr>`
        )
        .join("")}
    </table>
    ${description ? `
    <p style="margin:0 0 8px;font-size:13px;color:#a0aaba;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;">Project Brief</p>
    <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:16px 20px;margin-bottom:24px;font-size:14px;line-height:1.7;color:#ffffff;">${description}</div>
    ` : ""}
    <div style="text-align:center;">
      <a href="${SITE_URL}/admin" style="display:inline-block;background:#2c5fff;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:12px 28px;border-radius:50px;">
        Open Admin Dashboard →
      </a>
    </div>
  `;

  await resend.emails.send({
    from: FROM,
    to: ADMIN_EMAIL,
    subject: `New project: ${projectTitle}`,
    html: emailShell(content),
  });
}
