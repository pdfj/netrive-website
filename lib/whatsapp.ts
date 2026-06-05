import twilio from "twilio";

function getClient() {
  return twilio(
    process.env.TWILIO_ACCOUNT_SID!,
    process.env.TWILIO_AUTH_TOKEN!
  );
}

function formatE164(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0") && digits.length === 10) {
    return `+27${digits.slice(1)}`;
  }
  return phone.startsWith("+") ? phone : `+${digits}`;
}

export async function sendProjectConfirmationWhatsApp({
  to,
  name,
  projectTitle,
}: {
  to: string;
  name: string;
  projectTitle: string;
}) {
  const formatted = formatE164(to);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.netrive.com";

  await getClient().messages.create({
    from: process.env.TWILIO_WHATSAPP_FROM!,
    to: `whatsapp:${formatted}`,
    body: `Hi ${name}! 👋\n\nYour project *"${projectTitle}"* has been received by NetRive.\n\nOur team is reviewing it now and will be in touch shortly.\n\nTrack your project here:\n${siteUrl}/dashboard\n\n— The NetRive Team`,
  });
}

export async function sendAdminWhatsAppNotification({
  clientName,
  clientEmail,
  projectTitle,
}: {
  clientName: string;
  clientEmail: string;
  projectTitle: string;
}) {
  const adminNumber = process.env.ADMIN_WHATSAPP_NUMBER;
  if (!adminNumber) return;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.netrive.com";

  await getClient().messages.create({
    from: process.env.TWILIO_WHATSAPP_FROM!,
    to: `whatsapp:${adminNumber}`,
    body: `🔔 *New project submission!*\n\n*Client:* ${clientName}\n*Email:* ${clientEmail}\n*Project:* ${projectTitle}\n\nView in admin: ${siteUrl}/admin`,
  });
}
