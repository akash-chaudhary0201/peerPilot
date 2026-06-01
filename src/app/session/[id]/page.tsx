"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Script from "next/script";
import {
  Video,
  Clock,
  BookOpen,
  ArrowLeft,
  PenTool,
  CheckCircle,
  AlertTriangle,
  User,
  Shield,
  ArrowRight
} from "lucide-react";

interface SessionParticipant {
  name: string;
  email: string;
}

interface SessionData {
  id: string;
  sessionType: string;
  date: string;
  timeSlot: string;
  status: string;
  notes?: string;
  student: SessionParticipant;
  mentor: SessionParticipant;
}

export default function SessionRoom() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;

  const [currentUser, setCurrentUser] = useState<{ email: string; name: string; role: string } | null>(null);
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [jitsiLoaded, setJitsiLoaded] = useState(false);
  const [scratchpadText, setScratchpadText] = useState(
    "// PeerPilot Shared Interview Workspace\n// Write notes, sample code, or outline interview metrics here...\n\n"
  );
  
  // Call Timer states
  const [timeElapsed, setTimeElapsed] = useState(0);
  const jitsiApiRef = useRef<any>(null);

  // Authenticate user session from localStorage
  useEffect(() => {
    const userSession = localStorage.getItem("user_session");
    if (!userSession) {
      router.push("/login");
      return;
    }

    try {
      const parsed = JSON.parse(userSession);
      setCurrentUser(parsed);
      fetchSessionDetails(parsed.email);
    } catch (err) {
      router.push("/login");
    }
  }, [sessionId, router]);

  // Fetch session parameters from DB
  const fetchSessionDetails = async (email: string) => {
    try {
      const res = await fetch(`/api/session/${sessionId}?email=${email}`, {
        headers: { "x-user-email": email },
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Failed to load session details.");
      }

      const data = await res.json();
      setSessionData(data);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || "An error occurred while loading this room.");
      setLoading(false);
    }
  };

  // Timer loop
  useEffect(() => {
    if (loading || error) return;
    const interval = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [loading, error]);

  // Format timer
  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Initialize Jitsi Meet Iframe API
  const initializeJitsi = () => {
    if (!sessionData || !currentUser || typeof window === "undefined" || !(window as any).JitsiMeetExternalAPI) {
      return;
    }

    // Prevent multiple instances
    if (jitsiApiRef.current) return;

    const domain = "meet.jit.si";
    const options = {
      roomName: `PeerPilot-Session-${sessionData.id}`,
      width: "100%",
      height: "100%",
      parentNode: document.getElementById("jitsi-container"),
      userInfo: {
        email: currentUser.email,
        displayName: currentUser.role === "mentor" ? `${currentUser.name} (Mentor)` : `${currentUser.name} (Student)`,
      },
      configOverwrite: {
        startWithAudioMuted: false,
        startWithVideoMuted: false,
        prejoinPageEnabled: false, // Skip lobby to join instantly
        disableDeepLinking: true, // Don't redirect mobile users to app download
        toolbarButtons: [
          'microphone', 'camera', 'closedcaptions', 'desktop', 'embedmeeting', 'fullscreen',
          'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
          'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
          'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
          'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone',
          'mute-video-everyone', 'security'
        ],
      },
      interfaceConfigOverwrite: {
        SHOW_JITSI_WATERMARK: false,
        SHOW_BRAND_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
        DEFAULT_BACKGROUND: "#0b0f19",
      },
    };

    try {
      const api = new (window as any).JitsiMeetExternalAPI(domain, options);
      jitsiApiRef.current = api;

      // Event listener: when user hangs up, redirect them to dashboard
      api.addEventListener("readyToClose", () => {
        handleLeaveRoom();
      });
    } catch (err) {
      console.error("Failed to initialize Jitsi Meet iframe API:", err);
    }
  };

  // Run Jitsi setup when script is loaded AND sessionData is populated
  useEffect(() => {
    if (jitsiLoaded && sessionData && currentUser) {
      initializeJitsi();
    }

    return () => {
      if (jitsiApiRef.current) {
        jitsiApiRef.current.dispose();
        jitsiApiRef.current = null;
      }
    };
  }, [jitsiLoaded, sessionData, currentUser]);

  const handleLeaveRoom = () => {
    if (jitsiApiRef.current) {
      jitsiApiRef.current.dispose();
      jitsiApiRef.current = null;
    }
    if (currentUser?.role === "mentor") {
      router.push("/mentor");
    } else {
      router.push("/student");
    }
  };

  const handleMentorComplete = () => {
    if (jitsiApiRef.current) {
      jitsiApiRef.current.dispose();
      jitsiApiRef.current = null;
    }
    // Redirect mentor to dashboard with feedback triggers
    router.push(`/mentor?feedback=1&bookingId=${sessionId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-100 font-sans">
        <div className="relative flex items-center justify-center mb-6">
          <div className="h-16 w-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
          <Video className="absolute h-6 w-6 text-indigo-400 animate-pulse" />
        </div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Syncing Secure Call Channels...</h2>
        <p className="text-xs text-slate-500 mt-2">Checking session authorization and loading video lobby.</p>
      </div>
    );
  }

  if (error || !sessionData || !currentUser) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-100 font-sans">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl max-w-md w-full text-center space-y-6 shadow-xl">
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 p-4 rounded-full w-fit mx-auto">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-black text-slate-100">Access Denied</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {error || "We couldn't connect you to this interview lobby. Please check that you are logged in with the correct account."}
            </p>
          </div>
          <button
            onClick={() => router.push("/login")}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-550/15 cursor-pointer"
          >
            Go to Login <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  const isMentor = currentUser.role === "mentor";

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans text-slate-100 overflow-hidden select-none">
      {/* Dynamic Jitsi External API script */}
      <Script
        src="https://meet.jit.si/external_api.js"
        onLoad={() => setJitsiLoaded(true)}
      />

      {/* Dynamic Header */}
      <header className="h-16 bg-slate-900/60 border-b border-slate-800/80 px-6 flex justify-between items-center backdrop-blur-md shrink-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={handleLeaveRoom}
            className="p-2 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer"
            title="Leave Call"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <span className="text-slate-700 font-bold">|</span>
          <div>
            <h1 className="text-xs font-black text-slate-200 tracking-wide uppercase">{sessionData.sessionType}</h1>
            <p className="text-[10px] text-indigo-400 font-semibold mt-0.5">
              Candidate: {sessionData.student.name} • Mentor: {sessionData.mentor.name}
            </p>
          </div>
        </div>

        {/* Live Call statistics */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-mono bg-slate-950 border border-slate-800 px-4 py-1.5 rounded-full shrink-0">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
            <Clock className="h-3.5 w-3.5 text-indigo-400" />
            <span className="text-slate-300">Call Duration: <span className="text-indigo-400 font-extrabold">{formatTimer(timeElapsed)}</span></span>
          </div>

          {isMentor ? (
            <button
              onClick={handleMentorComplete}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
            >
              <CheckCircle className="h-3.5 w-3.5" /> End Call & Grade
            </button>
          ) : (
            <button
              onClick={handleLeaveRoom}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold rounded-xl border border-slate-700 transition-all cursor-pointer"
            >
              Leave Room
            </button>
          )}
        </div>
      </header>

      {/* Main Workspace Frame */}
      <main className="flex-grow flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* Left Column: Embed Jitsi Meeting Iframe */}
        <div className="flex-1 bg-[#0b0f19] relative flex items-center justify-center overflow-hidden">
          <div id="jitsi-container" className="w-full h-full relative" />
          
          {!jitsiLoaded && (
            <div className="absolute inset-0 bg-[#0b0f19] flex flex-col items-center justify-center space-y-4">
              <div className="h-10 w-10 border-4 border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin"></div>
              <p className="text-slate-400 text-xs font-bold tracking-wide">Attaching Jitsi iframe canvas...</p>
            </div>
          )}
        </div>

        {/* Right Column: Shared Workspace Scratchpad & Session Details */}
        <div className="w-full lg:w-96 bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-800/80 flex flex-col divide-y divide-slate-800/80 shrink-0">
          
          {/* 1. Whiteboard Scratchpad */}
          <div className="flex-1 flex flex-col min-h-[300px] overflow-hidden">
            <div className="h-10 bg-slate-950 px-4 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
              <span className="flex items-center gap-1.5">
                <PenTool className="h-3.5 w-3.5 text-indigo-400" /> 
                Live Interview Scratchpad
              </span>
            </div>
            <textarea
              value={scratchpadText}
              onChange={(e) => setScratchpadText(e.target.value)}
              className="flex-grow w-full bg-slate-950 p-5 text-xs font-mono text-indigo-200 outline-none resize-none leading-relaxed border-none focus:ring-0"
              placeholder="Start coding or writing notes here..."
            />
          </div>

          {/* 2. Room Instructions / Session Info */}
          <div className="p-5 space-y-4 bg-slate-900/40 select-text">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5 text-indigo-400" />
              Room Guidelines
            </h3>
            
            <div className="space-y-3 text-xs leading-relaxed text-slate-400 font-light">
              <p>
                Welcome to PeerPilot's dynamic interview suite. Jitsi's WebRTC technology establishes a direct encrypted peer-to-peer call.
              </p>
              
              {sessionData.notes && (
                <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-xl space-y-1">
                  <span className="text-[9px] font-bold uppercase tracking-wide text-indigo-400 block">Candidate Expectations</span>
                  <p className="text-[10px] font-normal leading-normal italic text-slate-400">
                    &quot;{sessionData.notes}&quot;
                  </p>
                </div>
              )}

              <div className="flex items-center gap-2 p-3 bg-indigo-500/5 rounded-xl border border-indigo-500/10 text-[10px] text-indigo-400">
                <Shield className="h-4 w-4 shrink-0" />
                <span>Screen sharing and chat facilities are available on the bottom toolbar.</span>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
