import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Star, Shield, Target, Users, Code, Server, HeartHandshake, Database } from "lucide-react";

export default function About() {
  const founders = [
    {
      name: "Akash",
      role: "Co-Founder & Frontend Architect",
      company: "Google",
      bio: "Akash is a user-experience purist who believes that software should not only be functional, but delightful. Having conducted 100+ frontend interviews, he helps candidates master JavaScript, React internals, and responsive design systems.",
      icon: <Code className="h-6 w-6 text-indigo-600" />,
      tagline: "Pixel-perfect engineering.",
      skills: ["React/Next.js", "Web Performance", "Design Systems"]
    },
    {
      name: "Prashu",
      role: "Co-Founder & Backend Lead",
      company: "Meta",
      bio: "Prashu leads scalable system designs and low-latency database queries. He built complex real-time messaging pipelines at Meta and helps candidates master concurrency, API modeling, and indexing strategies.",
      icon: <Database className="h-6 w-6 text-sky-600" />,
      tagline: "Ultra-low latency solutions.",
      skills: ["Go / Python", "PostgreSQL Optimization", "Redis Caching"]
    },
    {
      name: "Sumit",
      role: "Co-Founder & HR Specialist",
      company: "Netflix",
      bio: "Sumit has managed technical recruitment and leadership staffing across Netflix and Amazon. He knows exactly what makes a CV stand out, how to answer tricky behavioral questions, and how to command top-of-market salaries.",
      icon: <HeartHandshake className="h-6 w-6 text-teal-600" />,
      tagline: "Hiring decoded.",
      skills: ["Behavioral Coaching", "Resume Refining", "Salary Negotiation"]
    },
    {
      name: "Rakshit",
      role: "Co-Founder & Systems Architect",
      company: "Uber",
      bio: "Rakshit designs high-throughput microservices and queue architectures at Uber. He specializes in training candidates for distributed systems design, data pipelines, load balancing, and cloud cost management.",
      icon: <Server className="h-6 w-6 text-amber-600" />,
      tagline: "Distributed systems scale.",
      skills: ["System Design", "Kafka & RabbitMQ", "Kubernetes / AWS"]
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50">
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Header */}
        <section className="bg-white py-16 border-b border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-50 rounded-full blur-3xl opacity-40 -z-10"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">Our Story</h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto font-light leading-relaxed">
              We are four friends who realized that interview preparation shouldn&apos;t be a guessing game. We created PeerPilott to bridge the gap between candidate prep and interviewer expectations.
            </p>
          </div>
        </section>

        {/* Founding Philosophy */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-slate-900">Why we started PeerPilott</h2>
              <p className="text-slate-600 leading-relaxed font-normal">
                Akash, Prashu, Sumit, and Rakshit first met during engineering school. After securing roles at tier-one tech organizations, they were frequently approached by juniors asking for advice, resume reviews, and mock interviews.
              </p>
              <p className="text-slate-600 leading-relaxed font-normal">
                They realized that while there is an abundance of coding platforms online, what applicants truly lack is **realistic 1:1 interaction** and **targeted industry feedback**. PeerPilott was born to provide personalized, high-fidelity mock evaluations modeled exactly after real hiring panels.
              </p>

              <div className="grid grid-cols-2 gap-6 pt-4">
                <div className="flex gap-3">
                  <div className="p-2 bg-indigo-50 rounded-xl h-fit">
                    <Shield className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm">Quality Checked</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Real engineers, real hiring managers.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="p-2 bg-emerald-50 rounded-xl h-fit">
                    <Target className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm">Actionable Metrics</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Scored reports on actual interview rubric.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Callout */}
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-3xl p-8 lg:p-12 shadow-xl shadow-indigo-100 flex flex-col justify-between aspect-video lg:aspect-auto min-h-[300px]">
              <div className="space-y-4">
                <Users className="h-10 w-10 text-indigo-100" />
                <h3 className="text-2xl font-bold">Our Mission</h3>
                <p className="text-indigo-100 leading-relaxed font-light text-sm sm:text-base">
                  To democratize technical mentorship. We aim to equip ambitious software developers with the mental models, coding practices, and system design structures required to build thriving careers in modern technology companies.
                </p>
              </div>
              <div className="border-t border-indigo-400/40 pt-4 mt-6 flex justify-between items-center text-xs text-indigo-100 font-semibold">
                <span>Est. 2026</span>
                <span>By Akash, Prashu, Sumit, & Rakshit</span>
              </div>
            </div>
          </div>
        </section>

        {/* Founders Profiles */}
        <section className="bg-white py-20 border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <h2 className="text-3xl font-bold text-slate-900">Meet the Founding Mentors</h2>
              <p className="text-slate-600 leading-relaxed font-light">
                Learn directly from the engineers who architected the platform and actively review engineering candidates.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {founders.map((founder) => (
                <div
                  key={founder.name}
                  className="bg-slate-50/50 rounded-3xl border border-slate-100 p-8 flex flex-col md:flex-row gap-6 hover:shadow-xl hover:bg-white hover:border-slate-200 transition-all duration-300"
                >
                  <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100/80 h-fit w-fit self-start">
                    {founder.icon}
                  </div>

                  <div className="space-y-4 flex-1">
                    <div>
                      <div className="flex flex-wrap items-baseline gap-2">
                        <h3 className="text-2xl font-extrabold text-slate-900">{founder.name}</h3>
                        <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-bold">
                          {founder.company}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">
                        {founder.role}
                      </p>
                    </div>

                    <p className="text-slate-600 text-sm leading-relaxed font-normal">
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
