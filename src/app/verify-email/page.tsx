"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, AlertTriangle, ArrowRight, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMessage("No verification token was provided in the URL link. Please request a new verification email.");
      return;
    }

    // Call API route to verify token
    fetch(`/api/auth/verify-email?token=${token}`, { method: "POST" })
      .then(async (res) => {
        const data = await res.json();
        if (res.ok && data.success) {
          setStatus("success");
        } else {
          setStatus("error");
          setErrorMessage(data.error || "The verification link is invalid or has expired.");
        }
      })
      .catch((err) => {
        console.error("Verification error:", err);
        setStatus("error");
        setErrorMessage("A network connectivity error occurred. Please try again.");
      });
  }, [token]);

  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-8 sm:p-12 shadow-2xl max-w-md w-full text-center space-y-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 h-1.5 w-full bg-indigo-650"></div>

      {status === "loading" && (
        <div className="space-y-4 animate-pulse">
          <div className="inline-flex p-4 bg-indigo-50 text-indigo-600 rounded-full">
            <Loader2 className="h-10 w-10 animate-spin" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Verifying Email...</h2>
          <p className="text-sm text-slate-500 font-light">
            Syncing credentials and registering verification status on PostgreSQL...
          </p>
        </div>
      )}

      {status === "success" && (
        <div className="space-y-6">
          <div className="inline-flex p-4 bg-emerald-50 text-emerald-600 rounded-full shadow-inner animate-bounce">
            <CheckCircle2 className="h-12 w-12" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Email Verified!</h2>
            <p className="text-sm text-slate-650 font-light leading-relaxed">
              Your student account has been successfully calibrated and approved. You can now access your PeerPilot Portal dashboard.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/login?role=student"
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 text-white font-extrabold rounded-2xl hover:bg-indigo-700 transition-all duration-200 shadow-md shadow-indigo-150 hover:shadow-lg hover:shadow-indigo-250 cursor-pointer"
            >
              Sign In to Your Portal <ArrowRight className="h-4.5 w-4.5" />
            </Link>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="space-y-6">
          <div className="inline-flex p-4 bg-rose-50 text-rose-600 rounded-full">
            <AlertTriangle className="h-12 w-12" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Verification Failed</h2>
            <p className="text-sm text-rose-700 bg-rose-50 border border-rose-100 p-3 rounded-2xl font-semibold leading-relaxed">
              {errorMessage}
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/contact"
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-2xl transition-all cursor-pointer"
            >
              Contact Support Helpdesk
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 font-sans">
      <Navbar />

      <main className="flex-grow flex items-center justify-center py-20 px-4">
        <Suspense fallback={
          <div className="bg-white rounded-3xl border border-slate-100 p-8 sm:p-12 shadow-2xl max-w-md w-full text-center space-y-4 animate-pulse">
            <div className="inline-flex p-4 bg-indigo-50 text-indigo-650 rounded-full">
              <Loader2 className="h-10 w-10 animate-spin" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Loading Page Context...</h2>
          </div>
        }>
          <VerifyEmailContent />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
