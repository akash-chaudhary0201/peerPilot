import Link from "next/link";
import { GraduationCap, Github, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-2 rounded-xl text-white">
                <GraduationCap className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Peer<span className="text-indigo-400">Pilott</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm">
              Accelerate your engineering career with personalized mock interviews and guidance from industry practitioners. Built for engineers, by engineers.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white transition-colors">Pricing & Plans</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">Portal Login</Link>
              </li>
            </ul>
          </div>

          {/* Founders */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Founding Team</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>Akash (Frontend Leads)</li>
              <li>Prashu (Staff Backend)</li>
              <li>Sumit (HR & Hiring Head)</li>
              <li>Rakshit (System Architect)</li>
            </ul>
          </div>
        </div>

        <hr className="my-8 border-slate-800" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} PeerPilott. All rights reserved.</p>
          <p>
            Designed and built by Akash, Prashu, Sumit, and Rakshit.
          </p>
        </div>
      </div>
    </footer>
  );
}
