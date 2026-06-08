import type { Metadata } from "next";
import { getSiteConfig } from "@/lib/data";
import { MapPin, Mail, Phone, GitFork, Clock, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with SoftLab at the University of Modena and Reggio Emilia. We welcome collaboration proposals, PhD applications, and research enquiries.",
};

export const revalidate = 3600;

export default async function ContactPage() {
  const site = await getSiteConfig();

  return (
    <div className="pt-20">
      {/* Header */}
      <section className="bg-slate-950 text-white py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block text-xs font-semibold tracking-widest text-cyan-400 uppercase mb-4">
            Reach us
          </span>
          <h1 className="text-5xl font-black mb-5">Contact</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Whether you want to collaborate, apply for a position, or just learn more about our work — we&apos;d love to hear from you.
          </p>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-6">
              <h2 className="text-2xl font-black text-slate-900">Get in Touch</h2>
              <p className="text-slate-500 leading-relaxed">
                We welcome enquiries from prospective PhD students, collaborators from academia and industry, and anyone interested in our research.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-4 bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                  <div className="w-10 h-10 rounded-lg bg-cyan-50 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-cyan-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 mb-1">Address</p>
                    <p className="text-slate-500 text-sm">{site.address}</p>
                    <p className="text-slate-500 text-sm">{site.department}</p>
                    <p className="text-slate-500 text-sm">{site.university}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                  <div className="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-violet-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 mb-1">Email</p>
                    <a href={`mailto:${site.email}`} className="text-cyan-600 hover:underline text-sm">
                      {site.email}
                    </a>
                  </div>
                </div>

                {site.phone && (
                  <div className="flex items-center gap-4 bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 mb-1">Phone</p>
                      <p className="text-slate-500 text-sm">{site.phone}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4 bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 mb-1">Office Hours</p>
                    <p className="text-slate-500 text-sm">Monday – Friday: 9:00 – 17:00</p>
                    <p className="text-slate-500 text-sm">By appointment</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {site.github && (
                  <a
                    href={site.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 hover:border-cyan-300 hover:text-cyan-600 transition-all bg-white"
                  >
                    <GitFork className="w-4 h-4" /> GitHub
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
              <h2 className="text-2xl font-black text-slate-900 mb-6">Send a Message</h2>
              <form
                action={`mailto:${site.email}`}
                method="get"
                className="space-y-5"
              >
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-400 transition-all"
                    placeholder="Jane Smith"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Your Email</label>
                  <input
                    type="email"
                    name="email"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-400 transition-all"
                    placeholder="jane@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Subject</label>
                  <select
                    name="subject"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-400 transition-all text-slate-700"
                  >
                    <option>Research Collaboration</option>
                    <option>PhD Application</option>
                    <option>Postdoc / Research Fellow Application</option>
                    <option>Project Enquiry</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Message</label>
                  <textarea
                    name="body"
                    rows={5}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-400 transition-all resize-none"
                    placeholder="Tell us about your enquiry…"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-cyan-600/20 hover:-translate-y-0.5"
                >
                  Send Message
                </button>
                <p className="text-xs text-slate-400 text-center">
                  This will open your mail client. Alternatively, email us directly at {site.email}
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map embed */}
      <section className="h-72 bg-slate-200">
        <iframe
          src="https://www.openstreetmap.org/export/embed.html?bbox=10.91%2C44.62%2C10.94%2C44.65&layer=mapnik&marker=44.634%2C10.924"
          className="w-full h-full border-0"
          title="SoftLab location map"
          loading="lazy"
        />
      </section>
    </div>
  );
}
