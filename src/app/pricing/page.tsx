"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useState, useEffect } from "react";
import { 
  GraduationCap, 
  Check, 
  Sparkles, 
  HelpCircle, 
  Sliders, 
  Briefcase, 
  Clock, 
  ArrowRight,
  TrendingUp,
  Award,
  Users,
  Coins,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";

export default function PricingPage() {
  const [budgetLimit, setBudgetLimit] = useState<number>(1000);
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/pricing")
      .then(res => {
        if (res.ok) return res.json();
        throw new Error("Failed to load");
      })
      .then(data => {
        setPlans(data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setPlans([]);
        setLoading(false);
      });
  }, []);

  // Helper check to determine if a plan matches the active budget limit
  const isWithinBudget = (price: number) => price <= budgetLimit;

  // Frequently Asked Questions mockup
  const faqs = [
    {
      q: "How does the session booking and payment verification process work?",
      a: "After selecting your mentor, session date/time, and pricing plan, your mock session is temporarily reserved. You then submit your payment details (Payment Date and Transaction ID) via our manual UPI payment QR code. Once our administration team verifies your payment, the booking request is instantly sent to the mentor for final approval."
    },
    {
      q: "Can I choose my mentor for 1:1 sessions?",
      a: "Yes! During booking, you can choose any approved mentor matching your target field (e.g. Frontend with Akash, Backend with Prashu, System Design with Rakshit, Behavioral with Sumit)."
    },
    {
      q: "Is there a refund policy if I am not satisfied?",
      a: "Absolutely. We pride ourselves on the quality of our mentorship. If your session does not meet expectations, notify us within 24 hours for a full refund or session credit."
    },
    {
      q: "How does the action plan PDF work?",
      a: "After a Premium or Career Accelerator session, your mentor drafts a comprehensive evaluation card detailing code optimizations, architecture advice, soft skills grade scores, and a structured checklist. This is exported as a personal roadmap PDF on your dashboard."
    }
  ];

  const maxPrice = plans.length > 0 ? Math.max(...plans.map(p => p.price)) : 2000;
  const displayMaxPrice = maxPrice < 2000 ? 2000 : maxPrice;

  if (!loading && plans.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 font-sans">
      <Navbar />

      <main className="flex-grow py-16 px-4 max-w-7xl mx-auto w-full">
        
        {/* HERO SECTION */}
        <div className="text-center space-y-4 mb-16 animate-in fade-in duration-200">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <Coins className="h-3.5 w-3.5 text-indigo-600" /> Pricing & Plans
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Invest in Your Engineering Career
          </h1>
          <p className="text-slate-500 text-sm sm:text-base max-w-2xl mx-auto font-light leading-relaxed">
            Choose from our flexible evaluation sessions to optimize your learning velocity, review your code/resume, and land high-payout offers.
          </p>
        </div>

        {/* INTERACTIVE CONTROLS SECTION */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xl shadow-slate-100/50 mb-12 max-w-xl mx-auto space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Interactive Budget Matcher
              </label>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-150 px-2.5 py-0.5 rounded-lg">
                Budget Limit: ₹{budgetLimit}
              </span>
            </div>
            <div className="space-y-2 pt-1.5">
              <input
                type="range"
                min="100"
                max={displayMaxPrice}
                step="50"
                value={budgetLimit}
                onChange={(e) => setBudgetLimit(Number(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none"
              />
              <div className="flex justify-between text-[9px] font-bold text-slate-400">
                <span>₹100</span>
                <span>₹500</span>
                <span>₹1000</span>
                <span>₹1500</span>
                <span>₹{displayMaxPrice}</span>
              </div>
            </div>
          </div>

          <div className="text-center text-[10px] text-slate-400 font-light flex items-center justify-center gap-1 bg-slate-50 py-2 rounded-xl border border-slate-150">
            <Sliders className="h-3 w-3 text-indigo-500" />
            <span>Plan tiers matching your budget will highlight, others will dim.</span>
          </div>
        </div>

        {/* PRICING PLANS GRID */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-650"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch animate-in fade-in duration-300">
            {plans.map((plan) => {
              const isBestSeller = plan.tag === "Best Seller";
              return (
                <div key={plan.id || plan.name} className={`bg-white rounded-3xl border p-8 flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${
                  isWithinBudget(plan.price)
                    ? "shadow-2xl shadow-indigo-100/70 border-indigo-200 ring-4 ring-indigo-500/10 scale-102"
                    : "opacity-45 filter grayscale-[20%] blur-[0.3px] border-slate-150"
                }`}>
                  {isBestSeller && (
                    <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-indigo-500 via-sky-500 to-indigo-650"></div>
                  )}

                  {plan.tag && (
                    <div className="absolute top-4 right-4">
                      <span className={`${isBestSeller ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600"} text-[9px] font-black px-2.5 py-1 rounded-xl uppercase tracking-wider flex items-center gap-1 shadow shadow-indigo-150`}>
                        {isBestSeller && <Sparkles className="h-2.5 w-2.5 fill-white" />} {plan.tag}
                      </span>
                    </div>
                  )}

                  <div className="space-y-6">
                    <div>
                      <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block">Mock Session Plan</span>
                      <h3 className="text-xl font-extrabold text-slate-900 mt-1">{plan.name}</h3>
                      {plan.subtitle && (
                        <p className="text-xs text-slate-400 mt-1 font-light leading-relaxed">
                          {plan.subtitle}
                        </p>
                      )}
                    </div>

                    {/* Pricing & Duration */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl font-black text-slate-955">₹{plan.price}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">per session</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                        <span>{plan.duration} Minutes duration</span>
                      </div>
                    </div>

                    {plan.perfectFor && plan.perfectFor.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[9px] font-bold text-slate-400 tracking-wider block uppercase">Best For:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {plan.perfectFor.map((p: string, idx: number) => (
                            <span key={idx} className="bg-indigo-50 text-indigo-700 text-[9px] font-bold px-2 py-0.5 rounded-lg border border-indigo-100/50">
                              {p}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <hr className="border-slate-100" />

                    {plan.features && plan.features.length > 0 && (
                      <div className="space-y-3">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">What&apos;s Included:</span>
                        <ul className="space-y-2 text-xs text-slate-600 font-medium">
                          {plan.features.map((feat: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2">
                              <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="pt-8">
                    <Link
                      href="/login?role=student"
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow cursor-pointer text-center font-sans"
                    >
                      Book {plan.name} <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* STATS STRIP SECTION */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 bg-slate-900 text-white rounded-3xl p-8 border border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-40 w-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="text-center space-y-1">
            <h4 className="text-3xl font-black text-indigo-400">98%</h4>
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block">Placement Success Ratio</span>
          </div>
          <div className="text-center space-y-1 border-y sm:border-y-0 sm:border-x border-slate-800 py-4 sm:py-0">
            <h4 className="text-3xl font-black text-indigo-400">1000+</h4>
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block">Simulated Mock Sessions Completed</span>
          </div>
          <div className="text-center space-y-1">
            <h4 className="text-3xl font-black text-indigo-400">₹45 LPA</h4>
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block">Highest Package Received</span>
          </div>
        </div>

        {/* TRUST BANNER WITH SHIELD */}
        <div className="mt-12 bg-emerald-50 border border-emerald-100 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4 text-emerald-800 max-w-4xl mx-auto text-left">
          <ShieldCheck className="h-10 w-10 text-emerald-600 shrink-0" />
          <div className="space-y-1 text-xs">
            <strong className="font-bold text-emerald-950 block">100% Satisfaction Guarantee Protection</strong>
            <p className="text-emerald-700 leading-normal font-light">
              We stand behind our expert mentors. If you are not satisfied with the quality of guidance, mock review, or technical grading of your 1:1 call, request a full refund within 24 hours. No questions asked.
            </p>
          </div>
        </div>

        {/* FREQUENTLY ASKED QUESTIONS SECTION */}
        <div className="mt-24 space-y-10 max-w-4xl mx-auto">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Frequently Asked Questions</h2>
            <p className="text-slate-500 text-xs font-light">Clear answers to common questions about mock interview packages and pricing plans.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-2 flex flex-col justify-start">
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="h-4.5 w-4.5 text-indigo-500 shrink-0" />
                  {faq.q}
                </h4>
                <p className="text-[11px] text-slate-500 leading-relaxed font-light pl-6">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
