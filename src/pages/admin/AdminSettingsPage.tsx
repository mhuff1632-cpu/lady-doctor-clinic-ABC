import React, { useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useClinicSettings } from '../../context/ClinicSettingsContext';
import { ClinicLogo } from '../../components/ui/ClinicLogo';
import {
  Save,
  RotateCcw,
  Building,
  Phone,
  Clock,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Eye,
  Megaphone,
  MapPin,
  Mail,
  ShieldCheck,
  FileText,
} from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const { settings, updateSettings, resetSettings } = useClinicSettings();

  const [formData, setFormData] = useState({
    name: settings.name,
    logoPrimary: settings.logoPrimary,
    logoAccent: settings.logoAccent,
    tagline: settings.tagline,
    subheadline: settings.subheadline,
    announcementText: settings.announcementText,
    phone: settings.phone,
    whatsapp: settings.whatsapp,
    email: settings.email,
    addressStreet: settings.addressStreet,
    addressArea: settings.addressArea,
    addressCity: settings.addressCity,
    addressZip: settings.addressZip,
    addressFull: settings.addressFull,
    weekdayHours: settings.weekdayHours,
    saturdayHours: settings.saturdayHours,
    sundayHours: settings.sundayHours,
    emergencyNote: settings.emergencyNote,
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: value };

      // If user updates the main clinic name, automatically split into primary and accent if user hasn't typed custom ones
      if (name === 'name') {
        const parts = value.trim().split(/\s+/);
        if (parts.length > 1) {
          next.logoAccent = parts[parts.length - 1];
          next.logoPrimary = parts.slice(0, parts.length - 1).join(' ');
        } else {
          next.logoPrimary = value;
          next.logoAccent = '';
        }
      }

      // If address parts change, update addressFull automatically
      if (['addressStreet', 'addressArea', 'addressCity', 'addressZip'].includes(name)) {
        next.addressFull = `${next.addressStreet}, ${next.addressCity}, ${next.addressArea} ${next.addressZip}`.replace(/,\s*,/g, ',').trim();
      }

      return next;
    });
    setSavedSuccess(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 4000);
  };

  const handleReset = () => {
    resetSettings();
    setResetConfirmOpen(false);
    // Reload form from default
    setTimeout(() => {
      window.location.reload();
    }, 200);
  };

  return (
    <AdminLayout
      title="Website & Clinic Settings"
      subtitle="Customize your clinic brand name, direct helpline, location, announcements, and operating schedule."
    >
      <div className="max-w-5xl space-y-8 pb-16">
        {/* Live Preview Card */}
        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-rose-950/40 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rose-400">
              <Eye className="w-4 h-4" />
              <span>Real-Time Website Branding Preview</span>
            </div>
            <span className="text-xs bg-rose-500/15 text-rose-300 border border-rose-500/30 px-2.5 py-1 rounded-full font-mono">
              Live Preview
            </span>
          </div>

          {/* Announcement Bar Preview */}
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg px-4 py-2 text-xs text-rose-200 mb-5 flex items-center justify-between">
            <span className="truncate">{formData.announcementText || 'Announcement strip text goes here'}</span>
            <span className="text-[11px] text-rose-300/80 shrink-0 font-mono hidden sm:inline ml-4">
              Phone: {formData.phone}
            </span>
          </div>

          {/* Logo & Header Preview */}
          <div className="bg-white/95 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-slate-900 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 font-bold text-lg">
                <img src="/images/logo.svg" alt="Emblem" className="w-8 h-8 object-contain" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 leading-none">
                  <span>{formData.logoPrimary || 'Clinic'}</span>{' '}
                  <span className="text-rose-600 font-extrabold">{formData.logoAccent}</span>
                </div>
                <div className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider mt-1">
                  {formData.tagline || 'Specialized Healthcare'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-right hidden md:block">
                <div className="text-xs font-semibold text-slate-700">Helpline / Appointments</div>
                <div className="text-xs text-rose-600 font-bold">{formData.phone}</div>
              </div>
              <div className="px-3.5 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-semibold shadow-xs">
                Book Consultation
              </div>
            </div>
          </div>
        </div>

        {/* Success Alert Banner */}
        {savedSuccess && (
          <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            <div className="flex-1 text-sm">
              <strong className="font-semibold">Settings Successfully Updated!</strong> The website name and branding have been synchronized across all pages, headers, footers, and booking forms.
            </div>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-8">
          {/* Section 1: Clinic Brand & Name */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-7 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
              <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">Website Name & Brand Identity</h2>
                <p className="text-xs text-slate-400">
                  Control the name that appears in the logo, website header, and browser tabs.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Full Website / Clinic Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Lady Doctor Clinic"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-hidden focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all font-semibold"
                />
                <p className="text-[11px] text-slate-400 mt-1.5">
                  This is the official title shown on Google, browser tabs, and documents.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Logo Primary Text
                </label>
                <input
                  type="text"
                  name="logoPrimary"
                  value={formData.logoPrimary}
                  onChange={handleChange}
                  placeholder="e.g. Lady Doctor"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-hidden focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
                />
                <p className="text-[11px] text-slate-400 mt-1">First portion of the logo text (Dark / White color).</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Logo Accent Word (Highlighted)
                </label>
                <input
                  type="text"
                  name="logoAccent"
                  value={formData.logoAccent}
                  onChange={handleChange}
                  placeholder="e.g. Clinic"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-hidden focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all font-bold text-rose-400"
                />
                <p className="text-[11px] text-slate-400 mt-1">Highlighted word in bold brand color (e.g. "Clinic").</p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Tagline / Header Subtitle
                </label>
                <input
                  type="text"
                  name="tagline"
                  value={formData.tagline}
                  onChange={handleChange}
                  placeholder="e.g. Dedicated Women's Healthcare by Experienced Lady Specialists"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-hidden focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Top Announcement Strip Message
                </label>
                <div className="relative">
                  <Megaphone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    name="announcementText"
                    value={formData.announcementText}
                    onChange={handleChange}
                    placeholder="e.g. Women & Children’s Practice · Near Inspire Business Academy, Sadiqabad"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-hidden focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5">
                  Appears at the very top banner of every page on the public website.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Contact Numbers & WhatsApp */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-7 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
              <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">Helpline, Phone & WhatsApp</h2>
                <p className="text-xs text-slate-400">
                  Phone numbers used for instant patient calls, WhatsApp triage, and urgent appointments.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Direct Clinic Phone / Helpline
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (800) 523-9362"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-hidden focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  WhatsApp Support Number
                </label>
                <input
                  type="text"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  placeholder="+1 (800) 523-9362"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-hidden focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Official Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="care@ladydoctorclinic.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-hidden focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Physical Address & Location */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-7 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">Clinic Location & Directions</h2>
                <p className="text-xs text-slate-400">
                  Displayed in website footer, contact page, appointment confirmations, and Google Maps card.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Complete Address (Display Format)
                </label>
                <input
                  type="text"
                  name="addressFull"
                  value={formData.addressFull}
                  onChange={handleChange}
                  placeholder="Near The Inspire Business Academy, KRL Road, Sadiqabad, Punjab 64350"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-hidden focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Street / Landmark
                </label>
                <input
                  type="text"
                  name="addressStreet"
                  value={formData.addressStreet}
                  onChange={handleChange}
                  placeholder="Near The Inspire Business Academy, KRL Road"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-hidden focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  City & District
                </label>
                <input
                  type="text"
                  name="addressCity"
                  value={formData.addressCity}
                  onChange={handleChange}
                  placeholder="Sadiqabad"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-hidden focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Operating Hours & Emergency Alert */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-7 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">Clinical Hours & Emergency Note</h2>
                <p className="text-xs text-slate-400">
                  Set regular consultation hours and patient emergency triage guidelines.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Monday – Friday Hours
                </label>
                <input
                  type="text"
                  name="weekdayHours"
                  value={formData.weekdayHours}
                  onChange={handleChange}
                  placeholder="8:30 AM – 6:30 PM"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-hidden focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Saturday Hours
                </label>
                <input
                  type="text"
                  name="saturdayHours"
                  value={formData.saturdayHours}
                  onChange={handleChange}
                  placeholder="9:00 AM – 3:30 PM"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-hidden focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Sunday Status
                </label>
                <input
                  type="text"
                  name="sundayHours"
                  value={formData.sundayHours}
                  onChange={handleChange}
                  placeholder="Closed / On-call triage"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-hidden focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Emergency Guidance Note
                </label>
                <textarea
                  name="emergencyNote"
                  rows={2}
                  value={formData.emergencyNote}
                  onChange={handleChange}
                  placeholder="For acute emergencies outside operating hours, please visit the nearest hospital emergency department..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-hidden focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setResetConfirmOpen(true)}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-900 text-xs font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Defaults</span>
            </button>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold shadow-lg shadow-rose-900/40 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save & Synchronize Website Settings</span>
            </button>
          </div>
        </form>

        {/* Reset Confirmation Modal */}
        {resetConfirmOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center gap-3 text-amber-400">
                <AlertCircle className="w-6 h-6" />
                <h3 className="text-base font-bold text-white">Reset Website Settings?</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                This will reset the website name, helpline, and announcements back to original factory defaults ("Lady Doctor Clinic").
              </p>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setResetConfirmOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white"
                >
                  Yes, Reset
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
