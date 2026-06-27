// US lead lifecycle — shared by the admin list, detail page, and status control.

export const LEAD_STATUSES = [
  { value: "new", label: "New" },
  { value: "preview_built", label: "Preview Built" },
  { value: "sent", label: "Sent" },
  { value: "call_booked", label: "Call Booked" },
  { value: "paid", label: "Paid" },
  { value: "live", label: "Live" },
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number]["value"];

export const LEAD_STATUS_LABELS: Record<string, string> = Object.fromEntries(
  LEAD_STATUSES.map((s) => [s.value, s.label])
);

export const LEAD_STATUS_COLORS: Record<string, string> = {
  new: "text-sky bg-sky/10 border-sky/20",
  preview_built: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  sent: "text-electric bg-electric/10 border-electric/20",
  call_booked: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  paid: "text-green-400 bg-green-400/10 border-green-400/20",
  live: "text-green-300 bg-green-300/10 border-green-300/20",
};
