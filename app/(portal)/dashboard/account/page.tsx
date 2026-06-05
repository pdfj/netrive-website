"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function AccountPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [fullName, setFullName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [pwMsg, setPwMsg] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase
        .from("profiles")
        .select("full_name, business_name, phone")
        .eq("id", user.id)
        .single()
        .then(({ data }) => {
          if (data) {
            setFullName(data.full_name ?? "");
            setBusinessName(data.business_name ?? "");
            setPhone(data.phone ?? "");
          }
          setLoading(false);
        });
    });
  }, []);

  const saveProfile = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase
      .from("profiles")
      .update({ full_name: fullName, business_name: businessName, phone })
      .eq("id", user.id);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const updatePassword = async () => {
    if (password.length < 8) { setPwMsg("Password must be at least 8 characters."); return; }
    const { error } = await supabase.auth.updateUser({ password });
    setPwMsg(error ? error.message : "Password updated successfully.");
    setPassword("");
  };

  const inputClass =
    "w-full rounded-input border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-electric focus:outline-none focus:ring-1 focus:ring-electric";

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-electric" />
      </div>
    );
  }

  return (
    <div className="max-w-xl">
      <h1 className="mb-8 font-display text-3xl font-bold text-white">Account</h1>

      <div className="space-y-6">
        {/* Profile */}
        <div className="rounded-card glass p-6">
          <h2 className="mb-4 font-display text-lg font-semibold text-white">Your Details</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm text-white/80">Full Name</label>
              <input className={inputClass} value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-white/80">Business Name</label>
              <input className={inputClass} value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-white/80">Phone / WhatsApp</label>
              <input className={inputClass} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+27 ..." />
            </div>
          </div>
          <button
            onClick={saveProfile}
            disabled={saving}
            className="mt-5 flex items-center gap-2 rounded-btn bg-electric px-6 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <><CheckCircle2 className="h-4 w-4" /> Saved</> : "Save Changes"}
          </button>
        </div>

        {/* Password */}
        <div className="rounded-card glass p-6">
          <h2 className="mb-4 font-display text-lg font-semibold text-white">Change Password</h2>
          <div className="space-y-4">
            <input
              type="password"
              className={inputClass}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New password (min. 8 chars)"
            />
            {pwMsg && (
              <p className={`text-sm ${pwMsg.includes("success") ? "text-green-400" : "text-red-400"}`}>
                {pwMsg}
              </p>
            )}
            <button
              onClick={updatePassword}
              className="rounded-btn border border-white/10 bg-white/[0.03] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-white/[0.07]"
            >
              Update Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
