import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Star, Shield, Target, Users, Code, Server, HeartHandshake, Database, Briefcase, GraduationCap } from "lucide-react";

export default function About() {
  const founders = [
    {
      name: "Akash",
      role: "Co-Founder & Solution Engineer",
      company: "Noida-based Tech Firm",
      bio: "Akash specializes in enterprise design systems, project coordination, Salesforce integrations, and modern frontend architectures. He is dedicated to building intuitive, responsive digital portals and helping candidates translate complex user flows into clean code.",
      icon: <Code className="h-6 w-6 text-indigo-600" />,
      tagline: "Bridging business logic with pixel-perfect design.",
      skills: ["Salesforce & IT", "Project Management", "Frontend Development"]
    },
    {
      name: "Prashu Pandey",
      role: "Co-Founder & Full Stack Developer",
      company: "Remote State (Noida)",
      bio: "Prashu is a full-stack engineer with expertise in building responsive applications and managing microservice interactions. He guides candidates in mastering end-to-end web engineering, efficient API design, and scalable client-server pipelines.",
      icon: <Database className="h-6 w-6 text-sky-600" />,
      tagline: "Designing scalable, performant remote systems.",
      skills: ["Full Stack", "React & Node.js", "API Architectures"]
    },
    {
      name: "Sumit Rawat",
      role: "Co-Founder & Full Stack Developer",
      company: "Unthinkable Solutions (Gurugram)",
      bio: "Sumit is a versatile developer passionate about writing robust full-stack software. Drawing from deep experience with diverse web stacks, he helps candidates build solid foundations in technical problem solving and code quality.",
      icon: <HeartHandshake className="h-6 w-6 text-teal-600" />,
      tagline: "Translating complex requirements into simple code.",
      skills: ["Full Stack", "JavaScript Ecosystem", "System Operations"]
    },
    {
      name: "Rakshit Rajput",
      role: "Co-Founder & Specialist Programmer",
      company: "Infosys",
      bio: "Rakshit is a specialist developer working on large-scale enterprise services, backend pipelines, and system integration. He focuses on training candidates in core programming concepts, data structures, and optimized logic paradigms.",
      icon: <Server className="h-6 w-6 text-amber-600" />,
      tagline: "Optimizing enterprise logic at scale.",
      skills: ["Specialist Programming", "Enterprise Services", "Data Structures"]
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50">
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Header */}
        <section className="bg-white py-20 border-b border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-indigo-50 rounded-full blur-3xl opacity-50 -z-10 animate-pulse"></div>
          <div className="absolute bottom-0 left-10 w-[300px] h-[300px] bg-violet-50 rounded-full blur-3xl opacity-40 -z-10"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold tracking-wide uppercase">
              Meet The Team
            </span>
            <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-none">
              Empowering Mentorship
            </h1>
            <p className="text-lg sm:text-xl text-slate-650 max-w-2xl mx-auto font-light leading-relaxed">
              We started PeerPilot to redefine tech interview prep. Learn directly from peers who build real-world software every day.
            </p>
          </div>
        </section>

        {/* Founding Philosophy */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Text Copy */}
            <div className="lg:col-span-7 space-y-6">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Our Genesis
              </h2>
              <p className="text-slate-600 leading-relaxed text-base font-light">
                Akash, Sumit, Prashu, and Rakshit first connected during their **Master&apos;s degree** program. As classmates and fellow builders, they regularly teamed up on engineering tasks, code challenges, and architecture labs.
              </p>
              <p className="text-slate-600 leading-relaxed text-base font-light">
                After transitioning into full-time roles in technical software firms, they realized that the standard job preparation process was broken. Ambitious candidates had plenty of generic resources, but lacked access to **personalized 1:1 mock interviews** and genuine developmental feedback. PeerPilot was established to bridge this gap.
              </p>

              {/* USP mini-grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                <div className="flex gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <div className="p-3 bg-indigo-50 rounded-xl h-fit text-indigo-600">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Pragmatic Advice</h4>
                    <p className="text-xs text-slate-500 mt-1">Direct feedback from active full-stack engineers.</p>
                  </div>
                </div>
                
                <div className="flex gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <div className="p-3 bg-emerald-50 rounded-xl h-fit text-emerald-600">
                    <Target className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Actionable Blueprints</h4>
                    <p className="text-xs text-slate-500 mt-1">Detailed feedback cards outlining exact paths to upgrade.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Mission Card */}
            <div className="lg:col-span-5 bg-gradient-to-tr from-slate-900 via-indigo-950 to-indigo-900 text-white rounded-[32px] p-8 sm:p-10 shadow-2xl shadow-indigo-950/20 flex flex-col justify-between min-h-[380px] relative overflow-hidden border border-slate-800">
              <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-indigo-500/10 rounded-full blur-3xl"></div>
              
              <div className="space-y-6 relative">
                <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl w-fit">
                  <GraduationCap className="h-6 w-6 text-indigo-300" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight">Our Core Mission</h3>
                <p className="text-slate-350 leading-relaxed font-light text-sm sm:text-base">
                  To democratize access to quality mock evaluations. We build tools that help software engineers refine their communication, perfect their architectural diagrams, and build successful tech careers.
                </p>
              </div>

              <div className="border-t border-slate-800 pt-6 mt-8 flex justify-between items-center text-xs text-slate-400 font-semibold tracking-wider uppercase">
                <span>Est. 2026</span>
                <span>PeerPilot Team</span>
              </div>
            </div>

          </div>
        </section>

        {/* Founders Profiles */}
        <section className="bg-white py-24 border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Meet the Founders
              </h2>
              <p className="text-slate-500 leading-relaxed font-light text-base">
                Connect with the engineering minds behind PeerPilot and step up your next interview cycle.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {founders.map((founder) => (
                <div
                  key={founder.name}
                  className="bg-slate-50/50 rounded-[32px] border border-slate-100 p-8 flex flex-col sm:flex-row gap-6 hover:shadow-xl hover:shadow-slate-100 hover:bg-white hover:border-slate-200 transition-all duration-300 group"
                >
                  <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100/80 h-fit w-fit self-start group-hover:scale-105 transition-transform duration-300">
                    {founder.icon}
                  </div>

                  <div className="space-y-4 flex-1">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                          {founder.name}
                        </h3>
                        <span className="text-[10px] sm:text-xs bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full font-extrabold tracking-wide">
                          {founder.company}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                        {founder.role}
                      </p>
                    </div>

                    <p className="text-slate-650 text-sm leading-relaxed font-light">
                      {founder.bio}
                    </p>

                    <blockquote className="border-l-2 border-indigo-500 pl-3 py-0.5 text-xs text-slate-500 font-medium italic">
                      &ldquo;{founder.tagline}&rdquo;
                    </blockquote>

                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {founder.skills.map((skill) => (
                        <span
                          key={skill}
                          className="text-[10px] font-bold bg-white text-slate-600 px-2.5 py-1 rounded-lg border border-slate-200"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

