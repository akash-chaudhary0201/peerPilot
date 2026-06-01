import Link from "next/link";
import { GraduationCap, Github, Linkedin, Twitter, ArrowRight, ShieldCheck, Mail, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-350 border-t border-slate-900 relative overflow-hidden">
      {/* Decorative top blur glow */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[100px] bg-indigo-550/5 rounded-full blur-3xl -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Top Call-To-Action Strip */}
        <div className="border-b border-slate-900 pb-12 mb-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">Ready to clear your next technical interview?</h3>
            <p className="text-xs sm:text-sm text-slate-400 font-light">Book a mock evaluation session and calibrate your skills with active industry peers.</p>
          </div>
          <Link 
            href="/login?role=student" 
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-indigo-650/10 hover:shadow-indigo-650/20 transition-all duration-200 cursor-pointer shrink-0 font-sans"
          >
            Schedule Mock Call <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* Brand Column */}
          <div className="md:col-span-4 space-y-5">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-md shadow-indigo-950/50">
                <GraduationCap className="h-6 w-6" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                Peer<span className="text-indigo-400">Pilot</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-light max-w-sm">
              Accelerate your engineering trajectory with structured 1:1 mentorship and comprehensive scorecards designed by professional developers.
            </p>
            <div className="flex gap-3 pt-2">
              <a 
                href="https://github.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-slate-900 hover:bg-indigo-600 text-slate-400 hover:text-white rounded-xl border border-slate-800/80 transition-all duration-300"
                aria-label="GitHub Link"
              >
                <Github className="h-4.5 w-4.5" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-slate-900 hover:bg-indigo-600 text-slate-400 hover:text-white rounded-xl border border-slate-800/80 transition-all duration-300"
                aria-label="LinkedIn Link"
              >
                <Linkedin className="h-4.5 w-4.5" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-slate-900 hover:bg-indigo-600 text-slate-400 hover:text-white rounded-xl border border-slate-800/80 transition-all duration-300"
                aria-label="Twitter Link"
              >
                <Twitter className="h-4.5 w-4.5" />
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-xs font-bold text-white tracking-widest uppercase">Explore</h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link href="/" className="text-slate-400 hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/about" className="text-slate-400 hover:text-white transition-colors">About Us</Link>
              </li>
              <li>
                <Link href="/pricing" className="text-slate-400 hover:text-white transition-colors">Pricing & Plans</Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-400 hover:text-white transition-colors">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Portals Column */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-xs font-bold text-white tracking-widest uppercase">Portals</h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link href="/login?role=student" className="text-slate-400 hover:text-white transition-colors">Student Log In</Link>
              </li>
              <li>
                <Link href="/login?role=mentor" className="text-slate-400 hover:text-white transition-colors">Mentor Lobby</Link>
              </li>
              <li>
                <Link href="/login?role=admin" className="text-slate-400 hover:text-white transition-colors">Admin Console</Link>
              </li>
            </ul>
          </div>

          {/* Founding Team Specializations */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-xs font-bold text-white tracking-widest uppercase">Founding Mentors</h4>
            <ul className="space-y-3 text-xs sm:text-sm">
              <li className="flex justify-between items-baseline border-b border-slate-900/60 pb-1.5">
                <span className="text-slate-200 font-medium">Akash</span>
                <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded text-indigo-400 font-bold border border-slate-800">Solution Engineer</span>
              </li>
              <li className="flex justify-between items-baseline border-b border-slate-900/60 pb-1.5">
                <span className="text-slate-200 font-medium">Prashu Pandey</span>
                <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded text-indigo-400 font-bold border border-slate-800">Full Stack</span>
              </li>
              <li className="flex justify-between items-baseline border-b border-slate-900/60 pb-1.5">
                <span className="text-slate-200 font-medium">Sumit Rawat</span>
                <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded text-indigo-400 font-bold border border-slate-800">Full Stack</span>
              </li>
              <li className="flex justify-between items-baseline border-b border-slate-900/60 pb-1.5">
                <span className="text-slate-200 font-medium">Rakshit Rajput</span>
                <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded text-indigo-400 font-bold border border-slate-800">Specialist Prog.</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Divider Line */}
        <hr className="my-10 border-slate-900" />

        {/* Footer Bottom Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 text-xs text-slate-500 font-light">
          <div className="flex items-center gap-1.5 text-center sm:text-left">
            <span>&copy; {new Date().getFullYear()} PeerPilot. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-4 text-center">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-indigo-500/80" /> Verified Platform
            </span>
            <span className="flex items-center gap-1">
              <Globe className="h-3.5 w-3.5 text-slate-500/80" /> Noida & Gurugram, IN
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}

