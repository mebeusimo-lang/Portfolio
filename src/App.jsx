import { useState, useRef, useEffect } from "react";
import { Mail, ExternalLink, Cpu, Code2, Boxes, Wrench, Send } from "lucide-react";

function Github({ size = 14, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

const roles = ["ML / COMPUTER VISION", "FULL-STACK DEV", "EMBEDDED SYSTEMS"];

function Bracket({ children, label, className = "" }) {
  return (
    <div className={`relative group ${className}`}>
      <span className="absolute -top-2 -left-2 w-3 h-3 border-t-2 border-l-2 border-[#FF5A1F] opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      <span className="absolute -top-2 -right-2 w-3 h-3 border-t-2 border-r-2 border-[#FF5A1F] opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      <span className="absolute -bottom-2 -left-2 w-3 h-3 border-b-2 border-l-2 border-[#FF5A1F] opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      <span className="absolute -bottom-2 -right-2 w-3 h-3 border-b-2 border-r-2 border-[#FF5A1F] opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      {label && (
        <span className="absolute -top-6 left-0 text-[10px] tracking-widest text-[#FF5A1F] opacity-0 group-hover:opacity-100 transition-opacity duration-200 font-mono whitespace-nowrap">
          {label}
        </span>
      )}
      {children}
    </div>
  );
}

function Tag({ children }) {
  return (
    <span className="font-mono text-[11px] tracking-wide px-2.5 py-1 border border-[#14171A]/15 text-[#14171A]/70 rounded-sm">
      {children}
    </span>
  );
}

const STARTER_QUESTIONS = [
  "What's your capstone project about?",
  "What are you best at?",
  "Are you open to internships?",
];

function ChatWidget() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(text) {
    const question = text ?? input;
    if (!question.trim() || loading) return;

    const newMessages = [...messages, { role: "user", content: question }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    setError(false);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: question,
          history: messages,
        }),
      });

      if (!res.ok) throw new Error("Request failed");
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border border-[#14171A]/12 rounded-sm">
      <div className="max-h-80 overflow-y-auto px-5 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-wrap gap-2">
            {STARTER_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => send(q)}
                className="font-mono text-[11px] px-3 py-1.5 border border-[#14171A]/15 rounded-sm text-[#14171A]/60 hover:border-[#FF5A1F] hover:text-[#FF5A1F] transition-colors duration-200"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] text-sm px-3.5 py-2.5 rounded-sm leading-relaxed ${
                m.role === "user"
                  ? "bg-[#14171A] text-[#FAFAF8]"
                  : "bg-[#14171A]/5 text-[#14171A]/85"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="text-sm px-3.5 py-2.5 rounded-sm bg-[#14171A]/5 text-[#14171A]/40 font-mono text-xs">
              [ THINKING... ]
            </div>
          </div>
        )}

        {error && (
          <p className="font-mono text-[11px] text-[#FF5A1F]">
            Something went wrong — try again, or email me directly at mebeusimo@gmail.com.
          </p>
        )}
        <div ref={endRef} />
      </div>

      <div className="flex items-center gap-2 border-t border-[#14171A]/10 px-3 py-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ask about my projects, skills, background..."
          className="flex-1 bg-transparent outline-none text-sm px-2 placeholder:text-[#14171A]/30"
        />
        <button
          onClick={() => send()}
          disabled={loading}
          className="flex items-center justify-center w-9 h-9 bg-[#14171A] text-[#FAFAF8] rounded-sm hover:bg-[#FF5A1F] transition-colors duration-200 disabled:opacity-40"
        >
          <Send size={14} />
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [activeRole, setActiveRole] = useState(0);

  return (
    <div
      className="min-h-screen w-full"
      style={{ background: "#FAFAF8", color: "#14171A", fontFamily: "'IBM Plex Sans', sans-serif" }}
    >
      {/* NAV */}
      <nav className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
        <span className="font-mono text-xs tracking-[0.2em] text-[#14171A]/60">[ BELGANE.DEV ]</span>
        <div className="flex gap-5 font-mono text-xs tracking-wide">
          <a href="#projects" className="hover:text-[#FF5A1F] transition-colors">PROJECTS</a>
          <a href="#skills" className="hover:text-[#FF5A1F] transition-colors">SKILLS</a>
          <a href="#ask" className="hover:text-[#FF5A1F] transition-colors">ASK ME</a>
          <a href="#contact" className="hover:text-[#FF5A1F] transition-colors">CONTACT</a>
        </div>
      </nav>

      {/* HERO */}
      <header className="max-w-5xl mx-auto px-6 pt-16 pb-20">
        <div className="font-mono text-[11px] tracking-[0.25em] text-[#FF5A1F] mb-4">
          FINAL-YEAR B.TECH · COMPUTER ENGINEERING
        </div>
        <h1 className="text-5xl sm:text-6xl font-semibold leading-[1.05] mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Mebeu Simo Claude<br />Belgane
        </h1>

        <div className="flex flex-wrap gap-2 mb-6">
          {roles.map((r, i) => (
            <button
              key={r}
              onClick={() => setActiveRole(i)}
              className={`font-mono text-[11px] tracking-wide px-3 py-1.5 border rounded-sm transition-all duration-200 ${
                activeRole === i
                  ? "border-[#FF5A1F] text-[#FF5A1F] bg-[#FF5A1F]/5"
                  : "border-[#14171A]/15 text-[#14171A]/50 hover:border-[#14171A]/30"
              }`}
            >
              [ {r} {activeRole === i ? "98%" : ""} ]
            </button>
          ))}
        </div>

        <p className="max-w-xl text-[#14171A]/70 text-lg leading-relaxed">
          I build systems that sense and respond — from real-time object
          detection pipelines to full-stack web apps. Currently finishing my
          capstone on assistive technology for the visually impaired, and
          building a collaborative travel platform on the side.
        </p>

        <div className="flex gap-4 mt-8">
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=mebeusimo@gmail.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 font-mono text-xs px-4 py-2.5 bg-[#14171A] text-[#FAFAF8] rounded-sm hover:bg-[#FF5A1F] transition-colors duration-200"
          >
            <Mail size={14} /> GET IN TOUCH
          </a>
          <a
            href="https://github.com/mebeusimo-lang"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 font-mono text-xs px-4 py-2.5 border border-[#14171A]/20 rounded-sm hover:border-[#14171A] transition-colors duration-200"
          >
            <Github size={14} /> GITHUB
          </a>
        </div>
      </header>

      {/* ABOUT */}
      <section className="max-w-5xl mx-auto px-6 py-14 border-t border-[#14171A]/10">
        <div className="grid sm:grid-cols-[120px_1fr] gap-6">
          <span className="font-mono text-[11px] tracking-[0.2em] text-[#14171A]/40 pt-1">ABOUT</span>
          <p className="text-[#14171A]/80 leading-relaxed max-w-2xl">
            I'm a final-year Computer Engineering student at Institut
            Universitaire La Côte. My capstone project pairs an ESP32-CAM
            module with a custom-trained YOLO11n detector and a
            Gemini-powered scene-description pipeline to help visually
            impaired users understand their surroundings in real time,
            with fully offline text-to-speech output. I handled the ML and
            detection pipeline end-to-end — from data collection and
            training on Colab through deployment and debugging on constrained
            hardware. Outside the capstone, I'm building{" "}
            <span className="text-[#14171A]">Wanderly</span>, a
            collaborative travel platform, to sharpen my frontend and
            full-stack skills.
          </p>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" className="max-w-5xl mx-auto px-6 py-14 border-t border-[#14171A]/10">
        <span className="font-mono text-[11px] tracking-[0.2em] text-[#14171A]/40">SKILLS</span>
        <div className="grid sm:grid-cols-2 gap-8 mt-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Cpu size={16} className="text-[#FF5A1F]" />
              <h3 className="font-medium" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>ML &amp; Computer Vision</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {["Python", "YOLO / Ultralytics", "OpenCV", "ONNX", "Google Colab", "Gemini API"].map(t => <Tag key={t}>{t}</Tag>)}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Code2 size={16} className="text-[#FF5A1F]" />
              <h3 className="font-medium" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Web &amp; Frontend</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {["React", "Vite", "JavaScript", "HTML / CSS"].map(t => <Tag key={t}>{t}</Tag>)}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Boxes size={16} className="text-[#FF5A1F]" />
              <h3 className="font-medium" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Embedded &amp; Systems</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {["ESP32-CAM", "Hardware/software integration", "pyttsx3 (offline TTS)"].map(t => <Tag key={t}>{t}</Tag>)}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Wrench size={16} className="text-[#FF5A1F]" />
              <h3 className="font-medium" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Tools</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {["Git / GitHub", "Google Cloud (GCP)", "REST APIs"].map(t => <Tag key={t}>{t}</Tag>)}
            </div>
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="max-w-5xl mx-auto px-6 py-14 border-t border-[#14171A]/10">
        <span className="font-mono text-[11px] tracking-[0.2em] text-[#14171A]/40">PROJECTS</span>
        <div className="mt-6 space-y-6">
          <Bracket label="DETECTED: CAPSTONE" className="block">
            <a
              href="https://github.com/mebeusimo-lang/AI-Assistive-System"
              target="_blank"
              rel="noreferrer"
              className="block p-6 border border-[#14171A]/12 rounded-sm hover:border-[#FF5A1F]/50 transition-colors duration-200"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>AI Assistive System</h3>
                  <p className="text-[#14171A]/70 text-sm leading-relaxed max-w-xl">
                    Real-time object recognition system for visually impaired
                    users — ESP32-CAM feed, custom-trained YOLO11n detector,
                    and a Gemini-powered scene-description pipeline with
                    offline text-to-speech. Built and led the ML/detection
                    pipeline as part of a two-person capstone team.
                  </p>
                </div>
                <ExternalLink size={16} className="text-[#14171A]/40 shrink-0 mt-1" />
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {["YOLO11n", "ESP32-CAM", "Gemini API", "pyttsx3", "Python"].map(t => <Tag key={t}>{t}</Tag>)}
              </div>
            </a>
          </Bracket>

          <Bracket label="DETECTED: IN PROGRESS" className="block">
            <div className="p-6 border border-[#14171A]/12 rounded-sm hover:border-[#FF5A1F]/50 transition-colors duration-200">
              <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Wanderly</h3>
              <p className="text-[#14171A]/70 text-sm leading-relaxed max-w-xl">
                A collaborative travel planning platform built with React and
                Vite. Handling the full frontend — component architecture,
                state, and UI — while a teammate builds out the backend.
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {["React", "Vite", "JavaScript"].map(t => <Tag key={t}>{t}</Tag>)}
              </div>
            </div>
          </Bracket>
        </div>
      </section>

      {/* ASK ME ANYTHING */}
      <section id="ask" className="max-w-5xl mx-auto px-6 py-14 border-t border-[#14171A]/10">
        <span className="font-mono text-[11px] tracking-[0.2em] text-[#14171A]/40">ASK ME ANYTHING</span>
        <p className="text-[#14171A]/60 text-sm mt-3 mb-6 max-w-lg">
          Have a question about my projects, skills, or background? Ask
          directly — this is an AI answering using real details about me.
        </p>
        <ChatWidget />
      </section>

      {/* EDUCATION */}
      <section className="max-w-5xl mx-auto px-6 py-14 border-t border-[#14171A]/10">
        <span className="font-mono text-[11px] tracking-[0.2em] text-[#14171A]/40">EDUCATION</span>
        <div className="mt-6">
          <h3 className="font-medium" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>B.Tech, Computer Engineering</h3>
          <p className="text-[#14171A]/60 text-sm mt-1">Institut Universitaire La Côte · Final Year</p>
        </div>
      </section>

      {/* CONTACT / FOOTER */}
      <footer id="contact" className="max-w-5xl mx-auto px-6 py-16 border-t border-[#14171A]/10">
        <span className="font-mono text-[11px] tracking-[0.2em] text-[#14171A]/40">CONTACT</span>
        <h2 className="text-3xl sm:text-4xl font-semibold mt-4 mb-8 max-w-lg" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Open to internships, junior roles, and collaboration.
        </h2>
        <div className="flex flex-wrap gap-4">
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=mebeusimo@gmail.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 font-mono text-xs px-4 py-2.5 bg-[#14171A] text-[#FAFAF8] rounded-sm hover:bg-[#FF5A1F] transition-colors duration-200"
          >
            <Mail size={14} /> mebeusimo@gmail.com
          </a>
          <a
            href="https://github.com/mebeusimo-lang"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 font-mono text-xs px-4 py-2.5 border border-[#14171A]/20 rounded-sm hover:border-[#14171A] transition-colors duration-200"
          >
            <Github size={14} /> github.com/mebeusimo-lang
          </a>
        </div>
        <p className="font-mono text-[10px] text-[#14171A]/30 mt-16">© 2026 MEBEU SIMO CLAUDE BELGANE</p>
      </footer>
    </div>
  );
}
