"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import { Mail, MapPin, Phone, Send, CheckCircle2, MessageSquare } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Mentorship",
    message: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setIsSubmitted(true);
      setTimeout(() => {
        // Reset form after simulated submit
        setFormData({ name: "", email: "", subject: "Mentorship", message: "" });
      }, 5000);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50">
      <Navbar />

      <main className="flex-grow py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">Contact Our Team</h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto font-light leading-relaxed">
              Have questions about booking mock interviews, selecting mentors, or setting up corporate training sessions? Drop us a line.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact details */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-8">
                <h3 className="text-xl font-bold text-slate-900">Reach Out Directly</h3>
                
                <div className="space-y-6">
                  {/* Address */}
                  <div className="flex gap-4">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl h-fit">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 text-sm">Tech HQ Location</h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        Sector 5, HSR Layout, Bengaluru,<br />Karnataka 560102, India
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex gap-4">
                    <div className="p-3 bg-sky-50 text-sky-600 rounded-2xl h-fit">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 text-sm">Email Support</h4>
                      <p className="text-xs text-slate-500 mt-1">
                        hello@peerpilot.com
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex gap-4">
                    <div className="p-3 bg-teal-50 text-teal-600 rounded-2xl h-fit">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 text-sm">Phone Line</h4>
                      <p className="text-xs text-slate-500 mt-1">
                        +91 80 4912 3000
                      </p>
                    </div>
                  </div>
                </div>

                <hr className="border-slate-100" />
                <div className="p-4 bg-slate-50 rounded-2xl text-xs text-slate-500 leading-normal flex items-start gap-3">
                  <MessageSquare className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
                  <span>
                    Our typical response timeline is under 12 hours. We look forward to talking to you!
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl border border-slate-100 p-8 lg:p-12 shadow-sm">
                {isSubmitted ? (
                  <div className="py-12 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
                    <div className="inline-flex p-4 bg-emerald-50 text-emerald-600 rounded-full">
                      <CheckCircle2 className="h-12 w-12" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">Message Sent Successfully!</h3>
                    <p className="text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                      Thank you for contacting us. Akash, Prashu, Sumit, or Rakshit will get in touch with you shortly.
                    </p>
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="mt-4 text-xs font-semibold text-indigo-600 hover:text-indigo-700 underline"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                          Your Name
                        </label>
                        <input
                          id="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
                          placeholder="Akash Gupta"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                          Email Address
                        </label>
                        <input
                          id="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
                          placeholder="akash@gmail.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                        Subject
                      </label>
                      <select
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
                      >
                        <option value="Mentorship">1:1 Mentorship Inquiries</option>
                        <option value="MockInterview">Technical Mock Interviews</option>
                        <option value="HRInquiry">HR Counseling & Negotiation</option>
                        <option value="Partnership">Corporate / University Partnerships</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                        Your Message
                      </label>
                      <textarea
                        id="message"
                        rows={4}
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
                        placeholder="Detail how we can help you or what you're working on..."
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 text-white font-semibold rounded-2xl hover:bg-indigo-700 transition-all duration-200 shadow-md shadow-indigo-100 hover:shadow-lg hover:shadow-indigo-200"
                    >
                      Send Message
                      <Send className="h-4 w-4" />
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
