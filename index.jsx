import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Search, Home, Compass, Film, Briefcase, MessageCircle, Bell, User,
  Heart, MessageSquare, Share2, Bookmark, UserPlus, Check, ChevronRight,
  ChevronLeft, ChevronUp, ChevronDown, Play, MoreHorizontal, MapPin,
  Star, Clock, DollarSign, Send, Paperclip, Mic, Image as ImageIcon,
  Video as VideoIcon, X, ArrowLeft, BadgeCheck, TrendingUp, Eye,
  Briefcase as BriefcaseIcon, Grid3x3, Layers, Award, Plus, Settings,
  ShieldCheck, Flag, Volume2, VolumeX, UploadCloud as UploadIcon,
} from "lucide-react";

/* ============================================================
   CreatorX — design tokens
   bg near-black / red signal accent / Space Grotesk + Inter + JetBrains Mono
   Signature motif: diagonal "X-cut" slash echoing the logo bolt
=============================================================== */

const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

    .cx-root{
      --bg:#FFFFFF; --bg-b:#FFE0E3; --surface:#FFFFFF; --surface2:#FFF2F3; --surface3:#FFE1E4;
      --border:#FFD3D8; --border-soft:#FFE7EA;
      --red:#FF2E43; --red-dim:#E11D2E; --red-deep:#8C0E22; --red-glow:rgba(225,29,46,.22);
      --white:#FFFFFF; --ink:#18181B; --g100:#3F3F46; --g300:#55555C; --g400:#75757C; --g500:#98989F;
      background:linear-gradient(120deg, var(--bg) 0%, var(--bg-b) 45%, #FFFFFF 75%, var(--bg-b) 100%);
      background-size:300% 300%;
      animation:cx-bg-shift 22s ease infinite;
      color:var(--ink);
      font-family:'Inter',sans-serif;
      min-height:100%; width:100%; position:relative;
    }
    .cx-root *{box-sizing:border-box;}
    .f-display{font-family:'Space Grotesk',sans-serif;}
    .f-mono{font-family:'JetBrains Mono',monospace;}

    @keyframes cx-bg-shift{
      0%{background-position:0% 50%;}
      50%{background-position:100% 50%;}
      100%{background-position:0% 50%;}
    }

    .cx-scrollbar::-webkit-scrollbar{width:6px;height:6px;}
    .cx-scrollbar::-webkit-scrollbar-thumb{background:var(--surface3);border-radius:10px;}
    .cx-scrollbar::-webkit-scrollbar-track{background:transparent;}

    .cx-bg-noise{
      background-image: radial-gradient(circle at 15% 8%, rgba(255,46,67,.14), transparent 40%),
                         radial-gradient(circle at 85% 92%, rgba(255,46,67,.10), transparent 45%);
    }

    .cx-slash{
      position:relative; overflow:hidden;
    }
    .cx-slash::after{
      content:''; position:absolute; top:-40%; left:-10%; width:26px; height:180%;
      background:linear-gradient(180deg, var(--red), var(--red-deep));
      transform:rotate(18deg); opacity:.9; filter:blur(0px);
    }

    .cx-grad-text{
      background:linear-gradient(90deg,var(--ink) 0%, var(--ink) 40%, var(--red) 100%);
      -webkit-background-clip:text; background-clip:text; color:transparent;
    }
    .cx-red-grad{ background:linear-gradient(135deg, var(--red) 0%, var(--red-deep) 100%); }
    .cx-red-grad-soft{ background:linear-gradient(135deg, rgba(255,46,67,.16) 0%, rgba(122,12,30,.06) 100%); }

    .cx-glass{
      background:rgba(255,255,255,.78);
      backdrop-filter:blur(16px); -webkit-backdrop-filter:blur(16px);
      border:1px solid var(--border-soft);
    }

    .cx-card{
      background:var(--surface); border:1px solid var(--border-soft); border-radius:16px;
      transition:border-color .25s ease, transform .25s ease, box-shadow .25s ease;
    }
    .cx-card:hover{ border-color:var(--red-dim); box-shadow:0 8px 24px rgba(225,29,46,.10); }

    .cx-btn-primary{
      background:linear-gradient(135deg, var(--red) 0%, var(--red-dim) 100%);
      color:#fff; font-weight:600; border:none; transition:filter .2s ease, transform .15s ease;
      box-shadow:0 4px 18px var(--red-glow);
    }
    .cx-btn-primary:hover{ filter:brightness(1.12); transform:translateY(-1px); }
    .cx-btn-primary:active{ transform:translateY(0px) scale(.98); }
    .cx-btn-primary:disabled{ opacity:.35; filter:none; transform:none; cursor:not-allowed; box-shadow:none; }

    .cx-btn-ghost{
      background:var(--surface2); color:var(--g100); border:1px solid var(--border);
      transition:background .2s ease, border-color .2s ease;
    }
    .cx-btn-ghost:hover{ background:var(--surface3); border-color:#3a3a40; }

    .cx-btn-following{
      background:transparent; color:var(--g300); border:1px solid var(--border);
    }

    .cx-nav-item{ position:relative; transition:color .2s ease; color:var(--g400); }
    .cx-nav-item.active{ color:var(--ink); }
    .cx-nav-item.active::before{
      content:''; position:absolute; left:-14px; top:50%; transform:translateY(-50%);
      width:3px; height:20px; border-radius:4px;
      background:linear-gradient(180deg, var(--red), var(--red-deep));
    }

    .cx-input{
      background:var(--surface2); border:1px solid var(--border); color:var(--ink);
      transition:border-color .2s ease, box-shadow .2s ease;
    }
    .cx-input:focus{ outline:none; border-color:var(--red-dim); box-shadow:0 0 0 3px rgba(255,46,67,.15); }

    .cx-check{
      width:20px; height:20px; border-radius:6px; border:1.5px solid var(--g500);
      display:flex; align-items:center; justify-content:center; transition:all .18s ease; cursor:pointer;
      flex-shrink:0;
    }
    .cx-check.checked{ background:linear-gradient(135deg, var(--red), var(--red-deep)); border-color:transparent; }

    @keyframes cx-fade-up{ from{opacity:0; transform:translateY(14px);} to{opacity:1; transform:translateY(0);} }
    .cx-fade-up{ animation:cx-fade-up .55s cubic-bezier(.16,1,.3,1) both; }
    @keyframes cx-fade{ from{opacity:0;} to{opacity:1;} }
    .cx-fade{ animation:cx-fade .4s ease both; }
    @keyframes cx-pop{ 0%{transform:scale(.85);opacity:0;} 100%{transform:scale(1);opacity:1;} }
    .cx-pop{ animation:cx-pop .3s cubic-bezier(.34,1.56,.64,1) both; }
    @keyframes cx-pulse-glow{ 0%,100%{box-shadow:0 0 0 0 var(--red-glow);} 50%{box-shadow:0 0 22px 4px var(--red-glow);} }
    .cx-pulse{ animation:cx-pulse-glow 2.4s ease-in-out infinite; }
    @keyframes cx-shimmer{ 0%{background-position:-400px 0;} 100%{background-position:400px 0;} }
    .cx-skeleton{
      background:linear-gradient(90deg, var(--surface2) 25%, var(--surface3) 37%, var(--surface2) 63%);
      background-size:400px 100%; animation:cx-shimmer 1.4s ease infinite;
    }
    @keyframes cx-count{ from{opacity:0; transform:translateY(4px);} to{opacity:1; transform:translateY(0);} }

    .cx-badge-verified{ color:var(--red); }

    .cx-tab{ position:relative; color:var(--g400); transition:color .2s ease; cursor:pointer; }
    .cx-tab.active{ color:var(--ink); font-weight:700; }
    .cx-tab.active::after{
      content:''; position:absolute; left:0; right:0; bottom:-1px; height:2px;
      background:linear-gradient(90deg, var(--red), var(--red-deep));
      border-radius:2px;
    }

    .cx-logo-mark{
      width:30px;height:30px;border-radius:9px;
      background:#000; border:1px solid var(--border);
      display:flex;align-items:center;justify-content:center;
      position:relative; overflow:hidden;
    }

    ::selection{ background:rgba(255,46,67,.35); }
  `}</style>
);

/* ---------- tiny logo mark (css, echoes uploaded logo) ---------- */
const LogoMark = ({ size = 30 }) => (
  <div className="cx-logo-mark" style={{ width: size, height: size, borderRadius: size * 0.3 }}>
    <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 24 24" fill="none">
      <path d="M15 4C10 4 6.5 7.5 6.5 12S10 20 15 20" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" fill="none"/>
      <path d="M20 4L7 20" stroke="#FF2E43" strokeWidth="2.6" strokeLinecap="round"/>
    </svg>
  </div>
);

const Wordmark = ({ size = 20 }) => (
  <span className="f-display" style={{ fontSize: size, fontWeight: 700, letterSpacing: -0.5 }}>
    Creator<span style={{ color: "var(--red)" }}>X</span>
  </span>
);

/* ============================================================
   MOCK DATA — realistic demo content
=============================================================== */

const CREATORS = [
  { id: "c1", role: "freelancer", name: "Bobur Karimov", username: "boburdesign", title: "Video Editor & Motion Designer", avatar: "linear-gradient(135deg,#FF6B7A,#7A0C1E)", verified: true, rating: 4.9, reviews: 128, followers: 12400, following: 340, location: "Tashkent, UZ", since: 2023, skills: ["Premiere Pro", "After Effects", "Motion Design", "Color Grading"], bio: "Professional video editor specializing in short-form content, advertising and motion graphics. 200+ shorts delivered for brands across 12 countries.", completed: 96, views: "1.2M" },
  { id: "c2", role: "freelancer", name: "Elena Petrova", username: "elenarenders", title: "3D Artist & Motion Designer", avatar: "linear-gradient(135deg,#FF9AA6,#4a0812)", verified: true, rating: 5.0, reviews: 84, followers: 8900, following: 210, location: "Kyiv, UA", since: 2022, skills: ["Blender", "Cinema 4D", "Octane", "Product Renders"], bio: "I build cinematic 3D product renders and motion loops for e-commerce and ad campaigns.", completed: 61, views: "740K" },
  { id: "c3", role: "freelancer", name: "Diego Fernandez", username: "diegocodes", title: "Full-Stack Developer", avatar: "linear-gradient(135deg,#FF4757,#1a0308)", verified: false, rating: 4.7, reviews: 52, followers: 5200, following: 180, location: "Buenos Aires, AR", since: 2024, skills: ["React", "Node.js", "PostgreSQL", "AWS"], bio: "Building fast, scalable products end to end. Ex-startup CTO, now taking on select freelance builds.", completed: 34, views: "310K" },
  { id: "c4", role: "freelancer", name: "Mei Lin", username: "meilincreates", title: "UI/UX Designer", avatar: "linear-gradient(135deg,#FF808F,#5c0a18)", verified: true, rating: 4.8, reviews: 97, followers: 15600, following: 402, location: "Singapore, SG", since: 2021, skills: ["Figma", "Design Systems", "Prototyping"], bio: "Product designer helping startups turn rough ideas into polished, usable interfaces.", completed: 112, views: "2.1M" },
  { id: "c5", role: "freelancer", name: "Jonas Weber", username: "jonasshoots", title: "Photographer & Colorist", avatar: "linear-gradient(135deg,#FF6B7A,#2b0610)", verified: false, rating: 4.6, reviews: 39, followers: 3800, following: 156, location: "Berlin, DE", since: 2023, skills: ["Photography", "Lightroom", "Color Grading"], bio: "Editorial and product photography with a cinematic finishing style.", completed: 28, views: "195K" },
  { id: "c6", role: "freelancer", name: "Sara Okafor", username: "saracopy", title: "Copywriter & Brand Strategist", avatar: "linear-gradient(135deg,#FF9AA6,#3a0810)", verified: true, rating: 4.9, reviews: 71, followers: 9100, following: 265, location: "Lagos, NG", since: 2022, skills: ["Copywriting", "Brand Voice", "Ad Scripts"], bio: "Words that convert. I write for brands that want to sound human, not corporate.", completed: 88, views: "560K" },
];

const CLIENTS = [
  { id: "cl1", role: "client", name: "Creative Studio", username: "creativestudio", isCompany: true, avatar: "linear-gradient(135deg,#3a3a40,#0a0a0c)", bio: "We are looking for talented video editors, designers and 3D artists for ongoing brand campaigns.", location: "Los Angeles, US", activeProjects: 4, completedProjects: 22, rating: 4.8, followers: 2100, following: 88, needs: ["Video Editor", "3D Artist", "Motion Designer"] },
];

const VIDEOS = [
  { id: "v1", creator: CREATORS[0], title: "How I edit cinematic YouTube Shorts in 10 minutes", views: "184K", likes: 12300, comments: 342, duration: "10:24", thumb: "linear-gradient(135deg,#3a0a12,#0a0a0c)" },
  { id: "v2", creator: CREATORS[1], title: "3D product render breakdown — perfume bottle", views: "92K", likes: 7100, comments: 128, duration: "6:12", thumb: "linear-gradient(135deg,#5c0a18,#141416)" },
  { id: "v3", creator: CREATORS[3], title: "Redesigning a fintech app in 48 hours", views: "312K", likes: 24800, comments: 615, duration: "14:03", thumb: "linear-gradient(135deg,#7A0C1E,#0a0a0c)" },
  { id: "v4", creator: CREATORS[2], title: "Building a SaaS dashboard with React + Tailwind", views: "58K", likes: 3900, comments: 96, duration: "22:47", thumb: "linear-gradient(135deg,#2b0610,#1c1c1f)" },
  { id: "v5", creator: CREATORS[4], title: "Color grading portraits like a film colorist", views: "141K", likes: 9800, comments: 210, duration: "8:56", thumb: "linear-gradient(135deg,#4a0812,#0a0a0c)" },
  { id: "v6", creator: CREATORS[5], title: "Writing ad scripts that actually convert", views: "77K", likes: 5200, comments: 143, duration: "11:18", thumb: "linear-gradient(135deg,#3a0810,#141416)" },
];

const SHORTS = [
  { id: "s1", creator: CREATORS[0], caption: "3 transitions every editor should know 🔥", likes: 45200, comments: 891, thumb: "linear-gradient(160deg,#7A0C1E,#0a0a0c)" },
  { id: "s2", creator: CREATORS[3], caption: "Rebuilding this login screen in real time", likes: 28900, comments: 412, thumb: "linear-gradient(160deg,#5c0a18,#1c1c1f)" },
  { id: "s3", creator: CREATORS[1], caption: "This render took 40 hours. Worth it.", likes: 61300, comments: 1204, thumb: "linear-gradient(160deg,#4a0812,#0a0a0c)" },
  { id: "s4", creator: CREATORS[4], caption: "POV: golden hour saves every shoot", likes: 33700, comments: 560, thumb: "linear-gradient(160deg,#2b0610,#141416)" },
  { id: "s5", creator: CREATORS[5], caption: "The hook formula I use for every ad script", likes: 19800, comments: 288, thumb: "linear-gradient(160deg,#3a0a12,#0a0a0c)" },
];

const JOBS = [
  { id: "j1", client: CLIENTS[0], title: "Edit 10 YouTube Shorts for skincare brand", category: "Video Editing", skills: ["Premiere Pro", "Captions", "Sound Design"], budget: "$400", type: "Fixed price", deadline: "7 days", level: "Intermediate", proposals: 18, posted: "2h ago" },
  { id: "j2", client: CLIENTS[0], title: "3D animated product intro (15s)", category: "3D Animation", skills: ["Blender", "Cinema 4D"], budget: "$45/hr", type: "Hourly", deadline: "2 weeks", level: "Expert", proposals: 9, posted: "5h ago" },
  { id: "j3", client: CLIENTS[0], title: "Redesign onboarding flow for mobile app", category: "UI/UX Design", skills: ["Figma", "Prototyping"], budget: "$800", type: "Fixed price", deadline: "10 days", level: "Expert", proposals: 27, posted: "1d ago" },
  { id: "j4", client: CLIENTS[0], title: "Build a landing page with React", category: "Development", skills: ["React", "Tailwind"], budget: "$30/hr", type: "Hourly", deadline: "5 days", level: "Intermediate", proposals: 14, posted: "1d ago" },
  { id: "j5", client: CLIENTS[0], title: "Write 20 ad scripts for TikTok campaign", category: "Copywriting", skills: ["Copywriting", "Ad Scripts"], budget: "$250", type: "Fixed price", deadline: "4 days", level: "Entry", proposals: 31, posted: "2d ago" },
];

const SERVICES = [
  { id: "sv1", creator: CREATORS[0], title: "I will edit professional YouTube Shorts", price: 25, delivery: "2 days", includes: ["Subtitles", "Transitions", "Color correction", "Sound effects"] },
  { id: "sv2", creator: CREATORS[0], title: "I will create a cinematic brand promo video", price: 180, delivery: "5 days", includes: ["Storyboard", "Motion graphics", "Sound design", "2 revisions"] },
];

const REVIEWS = [
  { id: "r1", client: "Creative Studio", rating: 5, project: "YouTube Shorts Editing", date: "Aug 2026", text: "Bobur delivered ahead of schedule with flawless pacing and transitions. Already booked him again." },
  { id: "r2", client: "NovaTech", rating: 5, project: "Product Launch Video", date: "Jun 2026", text: "Extremely professional, fast communicator, and the final cut exceeded what we asked for." },
  { id: "r3", client: "Studio Aster", rating: 4, project: "Instagram Reels Pack", date: "Mar 2026", text: "Great work overall, one round of revisions needed but handled quickly." },
];

const PORTFOLIO = [
  { id: "p1", title: "Skincare Brand — Shorts Campaign", client: "Creative Studio", tools: ["Premiere Pro", "After Effects"], result: "+2.3M views across 12 shorts", thumb: "linear-gradient(135deg,#7A0C1E,#0a0a0c)" },
  { id: "p2", title: "Fitness App — Launch Trailer", client: "NovaTech", tools: ["Premiere Pro", "DaVinci Resolve"], result: "180K views in first week", thumb: "linear-gradient(135deg,#5c0a18,#141416)" },
  { id: "p3", title: "Fashion Week Recap Reel", client: "Studio Aster", tools: ["After Effects", "Photoshop"], result: "Featured on brand homepage", thumb: "linear-gradient(135deg,#3a0a12,#1c1c1f)" },
];

const ADS = [
  { id: "ad1", brand: "Adobe Creative Cloud", title: "Create without limits.", desc: "Get every Adobe app for creators, one plan.", cta: "Learn More", grad: "linear-gradient(135deg,#FF2E43,#7A0C1E)" },
  { id: "ad2", brand: "NovaTech", title: "Launch your product with pros.", desc: "Hire vetted freelancers for your next launch.", cta: "Hire Now", grad: "linear-gradient(135deg,#3a3a40,#0a0a0c)" },
  { id: "ad3", brand: "CX Premium", title: "Get featured. Get hired faster.", desc: "Boost your profile to the top of search.", cta: "Upgrade", grad: "linear-gradient(135deg,#7A0C1E,#1a0308)" },
  { id: "ad4", brand: "Studio Aster", title: "We're hiring 3D artists.", desc: "Long-term contract, remote friendly.", cta: "View Job", grad: "linear-gradient(135deg,#FF6B7A,#3a0810)" },
  { id: "ad5", brand: "CreatorX Ads", title: "Promote your Shorts.", desc: "Reach 10x more viewers this week.", cta: "Get Started", grad: "linear-gradient(135deg,#242428,#0a0a0c)" },
];

const CONVERSATIONS = [
  { id: "m1", person: CREATORS[3], lastMsg: "Sounds good, I'll send the first draft tomorrow", time: "2m", unread: 2, online: true },
  { id: "m2", person: CLIENTS[0], lastMsg: "Can you hop on a call this week?", time: "1h", unread: 0, online: true },
  { id: "m3", person: CREATORS[1], lastMsg: "Thanks for the follow! Loved your render 👀", time: "3h", unread: 0, online: false },
  { id: "m4", person: CREATORS[5], lastMsg: "Sent you the script draft", time: "1d", unread: 1, online: false },
];

const MESSAGES_THREAD = [
  { id: 1, from: "them", text: "Hey! Saw your Shorts edit for the skincare brand, really clean pacing.", time: "10:02" },
  { id: 2, from: "me", text: "Thank you! Appreciate that 🙏", time: "10:04" },
  { id: 3, from: "them", text: "We have a similar project coming up, would you be open to a quick call?", time: "10:05" },
  { id: 4, from: "me", text: "Definitely, I'm free Thursday afternoon", time: "10:07" },
  { id: 5, from: "them", text: "Sounds good, I'll send the first draft tomorrow", time: "10:08" },
];

const NOTIFICATIONS = [
  { id: "n1", type: "follow", person: CREATORS[2], text: "started following you", time: "5m" },
  { id: "n2", type: "like", person: CREATORS[1], text: "liked your Short", time: "22m" },
  { id: "n3", type: "comment", person: CREATORS[4], text: "commented: \"This is incredible work 🔥\"", time: "1h" },
  { id: "n4", type: "job", person: CLIENTS[0], text: "invited you to apply: 3D animated product intro", time: "3h" },
  { id: "n5", type: "message", person: CREATORS[5], text: "sent you a message", time: "5h" },
];

const FILTER_CHIPS = ["Video Editor", "Graphic Designer", "3D Artist", "Programmer", "Animator", "Photographer", "Copywriter", "UI/UX Designer", "Marketing", "AI Creator"];

const FILTER_KEYWORDS = {
  "Video Editor": ["video editor", "premiere", "after effects", "editing"],
  "Graphic Designer": ["graphic", "photoshop", "illustrator", "design"],
  "3D Artist": ["3d", "blender", "cinema 4d", "octane"],
  "Programmer": ["developer", "programmer", "react", "node", "code"],
  "Animator": ["animat", "motion"],
  "Photographer": ["photograph", "lightroom"],
  "Copywriter": ["copywrit", "copy", "script"],
  "UI/UX Designer": ["ui/ux", "ux", "ui design", "figma", "prototyp"],
  "Marketing": ["marketing", "brand"],
  "AI Creator": ["ai creator", "ai-generated", " ai "],
};

function matchesFilter(entity, filter) {
  if (!filter) return true;
  const kws = FILTER_KEYWORDS[filter] || [filter.toLowerCase()];
  const haystack = `${entity.title || ""} ${(entity.skills || []).join(" ")} ${entity.category || ""}`.toLowerCase();
  return kws.some(k => haystack.includes(k));
}

function fmtNum(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return String(n);
}

/* ============================================================
   ONBOARDING — Welcome / Auth / Role
=============================================================== */

function WelcomeScreen({ onContinue }) {
  const [checked, setChecked] = useState(false);
  return (
    <div className="cx-bg-noise" style={{ minHeight: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 20px" }}>
      <div className="cx-fade-up" style={{ width: "100%", maxWidth: 420, textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
          <div className="cx-pulse" style={{ width: 84, height: 84, borderRadius: 24, background: "#000", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="46" height="46" viewBox="0 0 24 24" fill="none">
              <path d="M15 4C10 4 6.5 7.5 6.5 12S10 20 15 20" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" fill="none"/>
              <path d="M20 4L7 20" stroke="#FF2E43" strokeWidth="2.6" strokeLinecap="round"/>
            </svg>
          </div>
        </div>
        <h1 className="f-display" style={{ fontSize: 36, fontWeight: 700, letterSpacing: -1, marginBottom: 8 }}>
          Creator<span style={{ color: "var(--red)" }}>X</span>
        </h1>
        <p className="f-mono" style={{ color: "var(--red)", fontSize: 13, letterSpacing: 1, marginBottom: 20, textTransform: "uppercase" }}>
          Create. Work. Connect. Grow.
        </p>
        <p style={{ color: "var(--g300)", fontSize: 15, lineHeight: 1.6, marginBottom: 36 }}>
          CreatorX connects talented creators, freelancers and clients from around the world — showcase your work, discover opportunities, and grow your career in one place.
        </p>
        <label onClick={() => setChecked(v => !v)} style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center", marginBottom: 20, cursor: "pointer", userSelect: "none" }}>
          <span className={`cx-check ${checked ? "checked" : ""}`}>{checked && <Check size={13} color="#fff" strokeWidth={3} />}</span>
          <span style={{ fontSize: 14, color: "var(--g300)" }}>I have read and understood</span>
        </label>
        <button disabled={!checked} onClick={onContinue} className="cx-btn-primary" style={{ width: "100%", padding: "15px 0", borderRadius: 14, fontSize: 15 }}>
          Continue
        </button>
      </div>
    </div>
  );
}

function isValidNamePart(v) {
  const t = v.trim();
  return /^[A-Za-z][A-Za-z'-]{1,29}$/.test(t);
}
function isValidUsername(v) {
  const t = v.trim();
  return /^(?=.*[A-Za-z])[A-Za-z0-9_]{3,20}$/.test(t);
}

function AuthScreen({ onDone }) {
  const [step, setStep] = useState("google"); // google -> details
  const [name, setName] = useState("");
  const [last, setLast] = useState("");
  const [username, setUsername] = useState("");
  const [touched, setTouched] = useState(false);

  const nameOk = isValidNamePart(name);
  const lastOk = isValidNamePart(last);
  const userOk = isValidUsername(username);
  const canSubmit = nameOk && lastOk && userOk;

  return (
    <div className="cx-bg-noise" style={{ minHeight: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 20px" }}>
      <div className="cx-fade-up" style={{ width: "100%", maxWidth: 400 }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
          <LogoMark size={40} />
        </div>
        {step === "google" ? (
          <>
            <h2 className="f-display" style={{ fontSize: 24, fontWeight: 700, textAlign: "center", marginBottom: 6 }}>Join CreatorX</h2>
            <p style={{ color: "var(--g400)", fontSize: 14, textAlign: "center", marginBottom: 32 }}>Sign up in seconds to start creating and connecting</p>
            <button onClick={() => setStep("details")} className="cx-btn-ghost" style={{ width: "100%", padding: "14px 0", borderRadius: 12, fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 14 }}>
              <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 01-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.88 2.7-6.62z"/><path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.98v2.33A9 9 0 009 18z"/><path fill="#FBBC05" d="M3.95 10.7A5.4 5.4 0 013.68 9c0-.59.1-1.17.27-1.7V4.97H.98A9 9 0 000 9c0 1.45.35 2.83.98 4.03l2.97-2.33z"/><path fill="#EA4335" d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 00.98 4.97l2.97 2.33C4.66 5.17 6.65 3.58 9 3.58z"/></svg>
              Continue with Google
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "20px 0" }}>
              <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
              <span className="f-mono" style={{ color: "var(--g500)", fontSize: 11 }}>OR</span>
              <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            </div>
            <button onClick={() => setStep("details")} className="cx-btn-primary" style={{ width: "100%", padding: "14px 0", borderRadius: 12, fontSize: 14 }}>
              Continue with Email
            </button>
          </>
        ) : (
          <>
            <h2 className="f-display" style={{ fontSize: 24, fontWeight: 700, textAlign: "center", marginBottom: 6 }}>Create your account</h2>
            <p style={{ color: "var(--g400)", fontSize: 14, textAlign: "center", marginBottom: 28 }}>Tell us a bit about you</p>
            <div style={{ display: "flex", gap: 10, marginBottom: 6 }}>
              <div style={{ flex: 1 }}>
                <input value={name} onChange={e => setName(e.target.value)} onBlur={() => setTouched(true)} placeholder="First name" className="cx-input" style={{ width: "100%", padding: "13px 14px", borderRadius: 12, fontSize: 14, borderColor: touched && name && !nameOk ? "var(--red-dim)" : undefined }} />
              </div>
              <div style={{ flex: 1 }}>
                <input value={last} onChange={e => setLast(e.target.value)} onBlur={() => setTouched(true)} placeholder="Last name" className="cx-input" style={{ width: "100%", padding: "13px 14px", borderRadius: 12, fontSize: 14, borderColor: touched && last && !lastOk ? "var(--red-dim)" : undefined }} />
              </div>
            </div>
            {touched && name && !nameOk && <div style={{ fontSize: 11.5, color: "var(--red-dim)", marginBottom: 6 }}>First name must be letters only (min 2 characters)</div>}
            {touched && last && !lastOk && <div style={{ fontSize: 11.5, color: "var(--red-dim)", marginBottom: 6 }}>Last name must be letters only (min 2 characters)</div>}
            <div style={{ position: "relative", marginBottom: 6, marginTop: 6 }}>
              <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--g500)", fontSize: 14 }}>@</span>
              <input value={username} onChange={e => setUsername(e.target.value.replace(/\s/g, ""))} onBlur={() => setTouched(true)} placeholder="username" className="cx-input" style={{ width: "100%", padding: "13px 14px 13px 28px", borderRadius: 12, fontSize: 14, borderColor: touched && username && !userOk ? "var(--red-dim)" : undefined }} />
            </div>
            {touched && username && !userOk && <div style={{ fontSize: 11.5, color: "var(--red-dim)", marginBottom: 14 }}>Username needs at least 3 characters and can't be numbers only</div>}
            <div style={{ marginBottom: 20 }} />
            <button
              disabled={!canSubmit}
              onClick={() => onDone({ name: name.trim(), last: last.trim(), username: username.trim() })}
              className="cx-btn-primary"
              style={{ width: "100%", padding: "14px 0", borderRadius: 12, fontSize: 14 }}
            >
              Create account
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   APP SHELL — sidebar (desktop) / bottom nav (mobile) / top bar
=============================================================== */

const NAV_ITEMS = [
  { id: "home", label: "Home", icon: Home },
  { id: "discover", label: "Discover", icon: Compass },
  { id: "shorts", label: "Shorts", icon: Film },
  { id: "jobs", label: "Jobs", icon: Briefcase },
  { id: "messages", label: "Messages", icon: MessageCircle },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "profile", label: "Profile", icon: User },
];

function Sidebar({ tab, setTab, me, onUpload }) {
  return (
    <div className="cx-scrollbar" style={{ width: 236, flexShrink: 0, borderRight: "1px solid var(--border-soft)", padding: "22px 18px", display: "flex", flexDirection: "column", height: "100%", overflowY: "auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 34, paddingLeft: 4 }}>
        <LogoMark size={30} />
        <Wordmark size={17} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          const active = tab === item.id;
          return (
            <div key={item.id} onClick={() => setTab(item.id)}
              className={`cx-nav-item ${active ? "active" : ""}`}
              style={{ display: "flex", alignItems: "center", gap: 13, padding: "11px 14px", borderRadius: 12, cursor: "pointer", marginLeft: 14, background: active ? "var(--surface2)" : "transparent", fontSize: 14.5, fontWeight: active ? 600 : 500 }}>
              <Icon size={19} strokeWidth={active ? 2.4 : 2} />
              {item.label}
              {item.id === "notifications" && <span style={{ marginLeft: "auto", width: 7, height: 7, borderRadius: 10, background: "var(--red)" }} />}
              {item.id === "messages" && <span className="f-mono" style={{ marginLeft: "auto", fontSize: 10.5, background: "var(--red-dim)", padding: "1px 6px", borderRadius: 8, color: "#fff" }}>3</span>}
            </div>
          );
        })}
      </div>

      <div onClick={onUpload} style={{ marginTop: 22, marginLeft: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px 0", borderRadius: 12, cursor: "pointer" }} className="cx-btn-primary">
        <UploadIcon size={17} /> <span style={{ fontSize: 14 }}>Upload Video / Short</span>
      </div>
      <div onClick={() => setTab("post-job")} style={{ marginTop: 10, marginLeft: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px 0", borderRadius: 12, cursor: "pointer" }} className="cx-btn-ghost">
        <Plus size={17} /> <span style={{ fontSize: 14 }}>Post a Job</span>
      </div>

      <div onClick={() => setTab("profile")} style={{ marginTop: "auto", paddingLeft: 14, display: "flex", alignItems: "center", gap: 10, paddingTop: 20, borderTop: "1px solid var(--border-soft)", cursor: "pointer" }}>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: me.avatar, flexShrink: 0 }} />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{me.name}</div>
          <div className="f-mono" style={{ fontSize: 11, color: "var(--g500)" }}>@{me.username}</div>
        </div>
        <Settings size={16} color="var(--g500)" style={{ marginLeft: "auto", flexShrink: 0 }} />
      </div>
    </div>
  );
}

function BottomNav({ tab, setTab, onUpload }) {
  const left = NAV_ITEMS.filter(i => ["home", "discover", "shorts"].includes(i.id));
  const right = NAV_ITEMS.filter(i => ["jobs", "messages"].includes(i.id));
  const renderItem = (item) => {
    const Icon = item.icon;
    const active = tab === item.id;
    return (
      <div key={item.id} onClick={() => setTab(item.id)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, color: active ? "var(--ink)" : "var(--g500)", padding: "4px 10px", cursor: "pointer" }}>
        <Icon size={21} strokeWidth={active ? 2.4 : 2} color={active ? "var(--red)" : undefined} />
        <span style={{ fontSize: 10, fontWeight: active ? 600 : 500 }}>{item.label}</span>
      </div>
    );
  };
  return (
    <div className="cx-glass" style={{ position: "fixed", bottom: 0, left: 0, right: 0, display: "flex", justifyContent: "space-around", alignItems: "center", padding: "10px 6px calc(10px + env(safe-area-inset-bottom))", zIndex: 40 }}>
      {left.map(renderItem)}
      <div onClick={onUpload} style={{ width: 46, height: 46, borderRadius: 15, background: "linear-gradient(135deg,var(--red),var(--red-deep))", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 4px 16px var(--red-glow)", marginTop: -14 }}>
        <UploadIcon size={20} color="#fff" />
      </div>
      {right.map(renderItem)}
    </div>
  );
}

function TopBar({ query, setQuery, onProfile, me, onOpenProfile, videos, onGoJobs, onGoDiscover }) {
  const [focused, setFocused] = useState(false);
  const q = query.trim().toLowerCase();

  const people = q ? [...CREATORS, ...CLIENTS].filter(p =>
    p.name.toLowerCase().includes(q) || p.username.toLowerCase().includes(q) ||
    (p.title || "").toLowerCase().includes(q) || (p.skills || []).some(s => s.toLowerCase().includes(q))
  ).slice(0, 5) : [];

  const jobs = q ? JOBS.filter(j =>
    j.title.toLowerCase().includes(q) || j.category.toLowerCase().includes(q) || j.skills.some(s => s.toLowerCase().includes(q))
  ).slice(0, 4) : [];

  const vids = q ? (videos || VIDEOS).filter(v =>
    v.title.toLowerCase().includes(q) || v.creator.name.toLowerCase().includes(q) || v.creator.username.toLowerCase().includes(q)
  ).slice(0, 4) : [];

  const hasResults = people.length || jobs.length || vids.length;
  const showDropdown = focused && q.length > 0;

  const pick = (fn) => { fn(); setQuery(""); setFocused(false); };

  return (
    <div className="cx-glass" style={{ position: "sticky", top: 0, zIndex: 30, display: "flex", alignItems: "center", gap: 14, padding: "14px 22px" }}>
      <div style={{ flex: 1, maxWidth: 480, position: "relative" }}>
        <Search size={16} color="var(--g500)" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          placeholder="Search CreatorX — people, jobs, skills, videos"
          className="cx-input" style={{ width: "100%", padding: "10px 14px 10px 38px", borderRadius: 11, fontSize: 13.5 }} />
        {showDropdown && (
          <div className="cx-card cx-fade cx-scrollbar" style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, right: 0, borderRadius: 16, padding: 10, maxHeight: 420, overflowY: "auto", zIndex: 50, boxShadow: "0 12px 32px rgba(0,0,0,.12)" }}>
            {!hasResults && (
              <div style={{ padding: "18px 10px", textAlign: "center", color: "var(--g500)", fontSize: 13 }}>No results for "{query}"</div>
            )}
            {people.length > 0 && (
              <div style={{ marginBottom: jobs.length || vids.length ? 8 : 0 }}>
                <div className="f-mono" style={{ fontSize: 10.5, color: "var(--g500)", padding: "6px 8px", textTransform: "uppercase" }}>People</div>
                {people.map(p => (
                  <div key={p.id} onClick={() => pick(() => onOpenProfile(p))} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px", borderRadius: 10, cursor: "pointer" }} onMouseEnter={e => e.currentTarget.style.background = "var(--surface2)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <div style={{ width: 32, height: 32, borderRadius: 9, background: p.avatar, flexShrink: 0 }} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>{p.name} {p.verified && <BadgeCheck size={12} fill="var(--red)" color="#fff" />}</div>
                      <div className="f-mono" style={{ fontSize: 10.5, color: "var(--g500)" }}>@{p.username}{p.title ? ` · ${p.title}` : ""}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {jobs.length > 0 && (
              <div style={{ marginBottom: vids.length ? 8 : 0 }}>
                <div className="f-mono" style={{ fontSize: 10.5, color: "var(--g500)", padding: "6px 8px", textTransform: "uppercase" }}>Jobs</div>
                {jobs.map(j => (
                  <div key={j.id} onClick={() => pick(onGoJobs)} style={{ padding: "8px", borderRadius: 10, cursor: "pointer" }} onMouseEnter={e => e.currentTarget.style.background = "var(--surface2)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{j.title}</div>
                    <div className="f-mono" style={{ fontSize: 10.5, color: "var(--g500)" }}>{j.category} · {j.budget}</div>
                  </div>
                ))}
              </div>
            )}
            {vids.length > 0 && (
              <div>
                <div className="f-mono" style={{ fontSize: 10.5, color: "var(--g500)", padding: "6px 8px", textTransform: "uppercase" }}>Videos</div>
                {vids.map(v => (
                  <div key={v.id} onClick={() => pick(() => onOpenProfile(v.creator))} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px", borderRadius: 10, cursor: "pointer" }} onMouseEnter={e => e.currentTarget.style.background = "var(--surface2)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <div style={{ width: 44, height: 30, borderRadius: 7, background: v.thumb, flexShrink: 0 }} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 12.5, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{v.title}</div>
                      <div className="f-mono" style={{ fontSize: 10.5, color: "var(--g500)" }}>{v.creator.name}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 14 }}>
        <div onClick={onProfile} style={{ width: 34, height: 34, borderRadius: 10, background: me.avatar, cursor: "pointer", flexShrink: 0 }} />
      </div>
    </div>
  );
}

function AdCarousel() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % ADS.length), 4200);
    return () => clearInterval(t);
  }, []);
  const ad = ADS[idx];
  return (
    <div style={{ width: 280, flexShrink: 0 }}>
      <div className="f-mono" style={{ fontSize: 10.5, color: "var(--g500)", letterSpacing: 1, marginBottom: 10, textTransform: "uppercase" }}>Sponsored</div>
      <div key={ad.id} className="cx-pop" style={{ borderRadius: 18, overflow: "hidden", border: "1px solid var(--border-soft)" }}>
        <div style={{ height: 150, background: ad.grad, position: "relative" }}>
          <div className="cx-slash" style={{ position: "absolute", inset: 0, opacity: 0.5 }} />
        </div>
        <div style={{ padding: 16, background: "var(--surface)" }}>
          <div className="f-mono" style={{ fontSize: 10.5, color: "var(--g400)", marginBottom: 6 }}>{ad.brand}</div>
          <div className="f-display" style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{ad.title}</div>
          <div style={{ fontSize: 12.5, color: "var(--g400)", marginBottom: 14, lineHeight: 1.5 }}>{ad.desc}</div>
          <button className="cx-btn-ghost" style={{ width: "100%", padding: "9px 0", borderRadius: 9, fontSize: 12.5, fontWeight: 600 }}>{ad.cta}</button>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 5, marginTop: 12 }}>
        {ADS.map((_, i) => (
          <div key={i} style={{ width: i === idx ? 16 : 6, height: 6, borderRadius: 4, background: i === idx ? "var(--red)" : "var(--surface3)", transition: "all .3s ease" }} />
        ))}
      </div>

      <div style={{ marginTop: 26, padding: 16, borderRadius: 16, border: "1px solid var(--border-soft)" }}>
        <div style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 12, color: "var(--g300)" }}>Trending creators</div>
        {CREATORS.slice(0, 3).map(c => (
          <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: 9, background: c.avatar, flexShrink: 0 }} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.name}</div>
              <div className="f-mono" style={{ fontSize: 10.5, color: "var(--g500)" }}>{fmtNum(c.followers)} followers</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function VideoCard({ v, onOpenProfile }) {
  const [liked, setLiked] = useState(false);
  const [following, setFollowing] = useState(false);
  return (
    <div className="cx-card cx-fade-up" style={{ borderRadius: 18, overflow: "hidden" }}>
      <div style={{ height: 190, background: v.thumb, position: "relative", cursor: "pointer" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 55%, rgba(0,0,0,.55) 100%)" }} />
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 52, height: 52, borderRadius: "50%", background: "rgba(255,255,255,.14)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Play size={20} fill="#fff" color="#fff" />
        </div>
        <span className="f-mono" style={{ position: "absolute", bottom: 10, right: 10, background: "rgba(0,0,0,.6)", padding: "2px 7px", borderRadius: 6, fontSize: 11 }}>{v.duration}</span>
      </div>
      <div style={{ padding: 14 }}>
        <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.35, marginBottom: 10 }}>{v.title}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 12, cursor: "pointer" }} onClick={onOpenProfile}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: v.creator.avatar, cursor: "pointer", flexShrink: 0 }} />
          <div style={{ minWidth: 0, cursor: "pointer" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12.5, fontWeight: 600, whiteSpace: "nowrap" }}>
              {v.creator.name} {v.creator.verified && <BadgeCheck size={12} className="cx-badge-verified" fill="var(--red)" color="#0A0A0C" />}
            </div>
            <div className="f-mono" style={{ fontSize: 11, color: "var(--g500)" }}>@{v.creator.username}</div>
          </div>
          <button onClick={(e) => { e.stopPropagation(); setFollowing(f => !f); }} className={following ? "cx-btn-following" : "cx-btn-primary"} style={{ marginLeft: "auto", padding: "5px 12px", borderRadius: 8, fontSize: 11.5, fontWeight: 600, flexShrink: 0 }}>
            {following ? "Following" : "Follow"}
          </button>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, color: "var(--g400)", fontSize: 12 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Eye size={13} /> {v.views}</span>
          <span onClick={() => setLiked(l => !l)} style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer", color: liked ? "var(--red)" : "var(--g400)" }}>
            <Heart size={13} fill={liked ? "var(--red)" : "none"} /> {fmtNum(v.likes + (liked ? 1 : 0))}
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><MessageSquare size={13} /> {v.comments}</span>
          <Share2 size={13} style={{ marginLeft: "auto", cursor: "pointer" }} />
        </div>
      </div>
    </div>
  );
}

function HomeFeed({ onOpenProfile, videos }) {
  const [filter, setFilter] = useState(null);
  const list = videos.filter(v => matchesFilter(v.creator, filter));
  return (
    <div style={{ display: "flex", gap: 28, padding: "24px 22px 90px", alignItems: "flex-start" }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <TrendingUp size={17} color="var(--red)" />
          <h2 className="f-display" style={{ fontSize: 19, fontWeight: 700 }}>Recommended for you</h2>
        </div>
        <p style={{ color: "var(--g500)", fontSize: 13, marginBottom: 18 }}>Based on creators you follow and skills you've searched</p>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 18 }} className="cx-scrollbar">
          <div onClick={() => setFilter(null)} className="f-mono" style={{ padding: "7px 14px", borderRadius: 20, fontSize: 12, whiteSpace: "nowrap", cursor: "pointer", flexShrink: 0, background: !filter ? "linear-gradient(135deg,var(--red),var(--red-deep))" : "var(--surface2)", border: !filter ? "none" : "1px solid var(--border)", color: !filter ? "#fff" : "var(--g300)" }}>All</div>
          {FILTER_CHIPS.slice(0, 6).map(f => (
            <div key={f} onClick={() => setFilter(x => x === f ? null : f)} className="f-mono" style={{ padding: "7px 14px", borderRadius: 20, fontSize: 12, whiteSpace: "nowrap", cursor: "pointer", flexShrink: 0, background: filter === f ? "linear-gradient(135deg,var(--red),var(--red-deep))" : "var(--surface2)", border: filter === f ? "none" : "1px solid var(--border)", color: filter === f ? "#fff" : "var(--g300)" }}>{f}</div>
          ))}
        </div>
        {list.length ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: 18 }}>
            {list.map(v => <VideoCard key={v.id} v={v} onOpenProfile={() => onOpenProfile(v.creator)} />)}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "60px 0", color: "var(--g500)" }}>
            <Film size={30} style={{ marginBottom: 10, opacity: 0.5 }} />
            <div style={{ fontSize: 13.5 }}>No videos match "{filter}" yet</div>
          </div>
        )}
      </div>
      <div className="cx-scrollbar" style={{ position: "sticky", top: 78 }}>
        <AdCarousel />
      </div>
    </div>
  );
}

/* ============================================================
   SHORTS
=============================================================== */

function ShortCard({ s, onOpenProfile }) {
  const [liked, setLiked] = useState(false);
  const [following, setFollowing] = useState(false);
  const [muted, setMuted] = useState(true);
  return (
    <div style={{ position: "relative", width: "100%", height: "100%", background: s.thumb, borderRadius: 26, overflow: "hidden", flexShrink: 0 }}>
      <div className="cx-slash" style={{ position: "absolute", inset: 0, opacity: 0.35 }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,.25) 0%, transparent 30%, transparent 55%, rgba(0,0,0,.75) 100%)" }} />
      <div onClick={() => setMuted(m => !m)} style={{ position: "absolute", top: 16, right: 16, width: 34, height: 34, borderRadius: "50%", background: "rgba(0,0,0,.4)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
        {muted ? <VolumeX size={15} color="#fff" /> : <Volume2 size={15} color="#fff" />}
      </div>
      <div style={{ position: "absolute", left: 18, right: 80, bottom: 24, color: "#fff" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <div onClick={() => onOpenProfile && onOpenProfile(s.creator)} style={{ width: 36, height: 36, borderRadius: 10, background: s.creator.avatar, flexShrink: 0, border: "1.5px solid #fff", cursor: "pointer" }} />
          <div onClick={() => onOpenProfile && onOpenProfile(s.creator)} style={{ fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }}>
            @{s.creator.username} {s.creator.verified && <BadgeCheck size={13} fill="var(--red)" color="#0A0A0C" />}
          </div>
          <button onClick={() => setFollowing(f => !f)} style={{ marginLeft: 4, padding: "4px 11px", borderRadius: 7, fontSize: 11, fontWeight: 700, border: "1px solid #fff", background: following ? "transparent" : "#fff", color: following ? "#fff" : "#0A0A0C" }}>
            {following ? "Following" : "Follow"}
          </button>
        </div>
        <div style={{ fontSize: 13.5, lineHeight: 1.4, opacity: 0.95 }}>{s.caption}</div>
      </div>
      <div style={{ position: "absolute", right: 14, bottom: 28, display: "flex", flexDirection: "column", alignItems: "center", gap: 22, color: "#fff" }}>
        <div onClick={() => setLiked(l => !l)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer" }}>
          <Heart size={27} fill={liked ? "var(--red)" : "none"} color={liked ? "var(--red)" : "#fff"} />
          <span className="f-mono" style={{ fontSize: 11 }}>{fmtNum(s.likes + (liked ? 1 : 0))}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer" }}>
          <MessageSquare size={25} />
          <span className="f-mono" style={{ fontSize: 11 }}>{s.comments}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer" }}>
          <Share2 size={24} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer" }}>
          <Bookmark size={24} />
        </div>
      </div>
    </div>
  );
}

function ShortsView({ shorts, onOpenProfile }) {
  const [i, setI] = useState(0);
  const wheelLock = useRef(false);
  const list = shorts && shorts.length ? shorts : SHORTS;

  const next = useCallback(() => setI(v => Math.min(v + 1, list.length - 1)), [list.length]);
  const prev = useCallback(() => setI(v => Math.max(v - 1, 0)), []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowDown") { e.preventDefault(); next(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); prev(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const onWheel = (e) => {
    if (wheelLock.current) return;
    if (e.deltaY > 25) { next(); wheelLock.current = true; }
    else if (e.deltaY < -25) { prev(); wheelLock.current = true; }
    if (wheelLock.current) setTimeout(() => { wheelLock.current = false; }, 480);
  };

  useEffect(() => { if (i > list.length - 1) setI(0); }, [list.length, i]);

  return (
    <div onWheel={onWheel} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", padding: "16px 0 90px", gap: 12 }}>
      <div style={{ position: "relative", width: 380, maxWidth: "94vw", height: "82vh", maxHeight: 760 }}>
        <ShortCard s={list[i]} onOpenProfile={onOpenProfile} />
      </div>
      <div className="f-mono" style={{ fontSize: 11, color: "var(--g500)" }}>{i + 1} / {list.length} — scroll or use ↑ ↓ to browse</div>
    </div>
  );
}

/* ============================================================
   DISCOVER
=============================================================== */

function CreatorCard({ c, onOpen }) {
  const [following, setFollowing] = useState(false);
  return (
    <div className="cx-card cx-fade-up" style={{ padding: 20, borderRadius: 18, textAlign: "center" }}>
      <div onClick={onOpen} style={{ width: 62, height: 62, borderRadius: 16, background: c.avatar, margin: "0 auto 12px", cursor: "pointer" }} />
      <div onClick={onOpen} style={{ cursor: "pointer" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, fontSize: 14.5, fontWeight: 700 }}>
          {c.name} {c.verified && <BadgeCheck size={13} fill="var(--red)" color="#0A0A0C" />}
        </div>
        <div className="f-mono" style={{ fontSize: 11.5, color: "var(--g500)", marginBottom: 6 }}>@{c.username}</div>
      </div>
      <div style={{ fontSize: 12, color: "var(--g400)", marginBottom: 10 }}>{c.title}</div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, fontSize: 12, marginBottom: 12 }}>
        <Star size={12} fill="var(--red)" color="var(--red)" /> {c.rating} <span style={{ color: "var(--g500)" }}>· {fmtNum(c.followers)} followers</span>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5, justifyContent: "center", marginBottom: 16 }}>
        {c.skills.slice(0, 2).map(s => (
          <span key={s} className="f-mono" style={{ fontSize: 10, padding: "3px 8px", borderRadius: 6, background: "var(--surface2)", color: "var(--g300)" }}>{s}</span>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => setFollowing(f => !f)} className={following ? "cx-btn-following" : "cx-btn-primary"} style={{ flex: 1, padding: "8px 0", borderRadius: 9, fontSize: 12, fontWeight: 600 }}>
          {following ? "Following" : "Follow"}
        </button>
        <button onClick={onOpen} className="cx-btn-ghost" style={{ flex: 1, padding: "8px 0", borderRadius: 9, fontSize: 12, fontWeight: 600 }}>View Profile</button>
      </div>
    </div>
  );
}

function DiscoverView({ onOpenProfile }) {
  const [seg, setSeg] = useState("Creators");
  const [filter, setFilter] = useState(null);
  const [applyJob, setApplyJob] = useState(null);
  const segs = ["Creators", "Freelancers", "Clients", "Jobs", "Videos", "Shorts"];

  let people = seg === "Clients" ? CLIENTS : CREATORS;
  const filtered = people.filter(c => matchesFilter(c, filter));

  return (
    <div style={{ padding: "24px 22px 90px" }}>
      <h2 className="f-display" style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Discover</h2>
      <p style={{ color: "var(--g500)", fontSize: 13, marginBottom: 18 }}>Browse creators, freelancers, clients and opportunities</p>
      <div style={{ display: "flex", gap: 22, borderBottom: "1px solid var(--border-soft)", marginBottom: 20, overflowX: "auto" }} className="cx-scrollbar">
        {segs.map(s => (
          <div key={s} onClick={() => setSeg(s)} className={`cx-tab ${seg === s ? "active" : ""}`} style={{ paddingBottom: 12, fontSize: 13.5, fontWeight: 600, whiteSpace: "nowrap" }}>{s}</div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 20 }} className="cx-scrollbar">
        <div onClick={() => setFilter(null)} className="f-mono" style={{ padding: "7px 14px", borderRadius: 20, fontSize: 12, whiteSpace: "nowrap", cursor: "pointer", flexShrink: 0, background: !filter ? "linear-gradient(135deg,var(--red),var(--red-deep))" : "var(--surface2)", border: !filter ? "none" : "1px solid var(--border)", color: !filter ? "#fff" : "var(--g300)" }}>All</div>
        {FILTER_CHIPS.map(f => (
          <div key={f} onClick={() => setFilter(x => x === f ? null : f)} className="f-mono" style={{ padding: "7px 14px", borderRadius: 20, fontSize: 12, whiteSpace: "nowrap", cursor: "pointer", flexShrink: 0, background: filter === f ? "linear-gradient(135deg,var(--red),var(--red-deep))" : "var(--surface2)", border: filter === f ? "none" : "1px solid var(--border)", color: filter === f ? "#fff" : "var(--g300)" }}>{f}</div>
        ))}
      </div>
      {seg === "Jobs" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 780 }}>
          {JOBS.filter(j => matchesFilter({ title: j.title, category: j.category }, filter)).map(j => <JobCard key={j.id} j={j} onApply={() => setApplyJob(j)} onOpenClient={onOpenProfile} />)}
          {applyJob && <ApplyModal job={applyJob} onClose={() => setApplyJob(null)} />}
        </div>
      ) : filtered.length ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
          {filtered.map(c => <CreatorCard key={c.id} c={c} onOpen={() => onOpenProfile(c)} />)}
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--g500)" }}>
          <Compass size={30} style={{ marginBottom: 10, opacity: 0.5 }} />
          <div style={{ fontSize: 13.5 }}>No results for "{filter}" yet</div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   PROFILE
=============================================================== */

function ProfileView({ creator, onBack, onMessage, myVideos, myShorts, isMe, onUpdateCover }) {
  const [tab, setTab] = useState("Videos");
  const [following, setFollowing] = useState(false);
  const [coverPicker, setCoverPicker] = useState(false);
  const tabs = ["Posts", "Videos", "Shorts", "Portfolio", "Services", "Reviews"];
  const c = creator;
  if (!c) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "var(--g500)" }}>
        <User size={30} style={{ marginBottom: 10, opacity: 0.5 }} />
        <div style={{ fontSize: 13.5 }}>Profile not found</div>
      </div>
    );
  }
  const roleLabel = c.role === "client" ? "Client / Buyer" : "Freelancer / Creator";
  const coverStyle = c.cover || "linear-gradient(120deg, var(--surface3) 0%, var(--surface2) 55%, var(--bg-b) 100%)";
  return (
    <div style={{ padding: "0 0 90px" }}>
      <div style={{ height: 150, background: coverStyle, position: "relative", borderBottom: "1px solid var(--border-soft)" }}>
        {onBack && <div onClick={onBack} style={{ position: "absolute", top: 16, left: 20, width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,.65)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", border: "1px solid var(--border-soft)" }}><ArrowLeft size={16} color="var(--ink)" /></div>}
        <div style={{ position: "absolute", top: 16, left: onBack ? 62 : 20 }}><LogoMark size={26} /></div>
        {isMe && (
          <div onClick={() => setCoverPicker(v => !v)} style={{ position: "absolute", top: 16, right: 20, display: "flex", alignItems: "center", gap: 6, padding: "7px 13px", borderRadius: 20, background: "rgba(255,255,255,.7)", backdropFilter: "blur(6px)", border: "1px solid var(--border-soft)", cursor: "pointer", fontSize: 11.5, fontWeight: 600, color: "var(--ink)" }}>
            <ImageIcon size={13} /> Edit cover
          </div>
        )}
        {coverPicker && (
          <div className="cx-card cx-pop" style={{ position: "absolute", top: 54, right: 20, padding: 10, borderRadius: 14, display: "flex", gap: 8, zIndex: 20 }}>
            {THUMB_GRADIENTS.concat(["linear-gradient(120deg, var(--surface3) 0%, var(--surface2) 55%, var(--bg-b) 100%)"]).map((g, i) => (
              <div key={i} onClick={() => { onUpdateCover && onUpdateCover(g); setCoverPicker(false); }} style={{ width: 34, height: 34, borderRadius: 9, background: g, cursor: "pointer", border: "1px solid var(--border-soft)" }} />
            ))}
          </div>
        )}
      </div>
      <div style={{ padding: "0 26px" }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 18, marginTop: -42, marginBottom: 16 }}>
          <div style={{ width: 96, height: 96, borderRadius: 24, background: c.avatar, border: "4px solid var(--bg)", flexShrink: 0 }} />
          <div style={{ flex: 1, display: "flex", gap: 10, paddingBottom: 6, flexWrap: "wrap" }}>
            {!isMe && (
              <>
                <button onClick={() => setFollowing(f => !f)} className={following ? "cx-btn-following" : "cx-btn-primary"} style={{ padding: "9px 18px", borderRadius: 10, fontSize: 13, fontWeight: 600 }}>
                  {following ? "Following" : <span style={{ display: "flex", alignItems: "center", gap: 6 }}><UserPlus size={14} />Follow</span>}
                </button>
                <button onClick={onMessage} className="cx-btn-ghost" style={{ padding: "9px 18px", borderRadius: 10, fontSize: 13, fontWeight: 600 }}>Message</button>
                {c.role !== "client" && !c.isCompany && <button className="cx-btn-ghost" style={{ padding: "9px 18px", borderRadius: 10, fontSize: 13, fontWeight: 600, borderColor: "var(--red-dim)", color: "var(--red)" }}>Hire</button>}
              </>
            )}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 21, fontWeight: 700, flexWrap: "wrap" }} className="f-display">
          {c.name} {c.verified && <BadgeCheck size={17} fill="var(--red)" color="#0A0A0C" />}
          <span className="f-mono" style={{ fontSize: 10.5, fontWeight: 700, padding: "4px 10px", borderRadius: 20, background: c.role === "client" ? "var(--surface2)" : "linear-gradient(135deg,var(--red),var(--red-deep))", color: c.role === "client" ? "var(--g300)" : "#fff", border: c.role === "client" ? "1px solid var(--border)" : "none", letterSpacing: 0.3 }}>
            {roleLabel.toUpperCase()}
          </span>
        </div>
        <div className="f-mono" style={{ fontSize: 13, color: "var(--g500)", marginBottom: 8 }}>@{c.username}</div>
        {c.title && <div style={{ fontSize: 13.5, color: "var(--red)", fontWeight: 600, marginBottom: 10 }}>{c.title}</div>}
        <p style={{ fontSize: 13.5, color: "var(--g300)", lineHeight: 1.6, marginBottom: 14, maxWidth: 560 }}>{c.bio || "No bio yet."}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, fontSize: 12.5, color: "var(--g400)", marginBottom: 18 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 5 }}><MapPin size={13} />{c.location}</span>
          {c.since && <span style={{ display: "flex", alignItems: "center", gap: 5 }}><Clock size={13} />{c.role === "client" ? "On CreatorX since" : "Working since"} {c.since}</span>}
          {!!c.rating && <span style={{ display: "flex", alignItems: "center", gap: 5 }}><Star size={13} fill="var(--red)" color="var(--red)" />{c.rating} ({c.reviews} reviews)</span>}
        </div>

        <div style={{ display: "flex", gap: 26, padding: "16px 0", borderTop: "1px solid var(--border-soft)", borderBottom: "1px solid var(--border-soft)", marginBottom: 20, flexWrap: "wrap" }}>
          {[["Followers", fmtNum(c.followers)], ["Following", fmtNum(c.following)], ["Views", c.views || "—"], [c.role === "client" ? "Hired" : "Completed", c.completed || c.completedProjects || 0]].map(([l, v]) => (
            <div key={l}>
              <div className="f-display" style={{ fontSize: 18, fontWeight: 700 }}>{v}</div>
              <div style={{ fontSize: 11.5, color: "var(--g500)" }}>{l}</div>
            </div>
          ))}
        </div>

        {c.role === "client" ? (
          (c.needs && c.needs.length > 0) && (
            <div style={{ marginBottom: 22 }}>
              <div className="f-mono" style={{ fontSize: 10.5, color: "var(--g500)", textTransform: "uppercase", marginBottom: 8 }}>Looking to hire for</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {c.needs.map(s => <span key={s} className="f-mono" style={{ fontSize: 11.5, padding: "6px 12px", borderRadius: 8, background: "var(--surface2)", border: "1px solid var(--border)" }}>{s}</span>)}
              </div>
            </div>
          )
        ) : (
          (c.skills && c.skills.length > 0) && (
            <div style={{ marginBottom: 22 }}>
              <div className="f-mono" style={{ fontSize: 10.5, color: "var(--g500)", textTransform: "uppercase", marginBottom: 8 }}>Skills & tools</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {c.skills.map(s => <span key={s} className="f-mono" style={{ fontSize: 11.5, padding: "6px 12px", borderRadius: 8, background: "var(--surface2)", border: "1px solid var(--border)" }}>{s}</span>)}
              </div>
            </div>
          )
        )}

        <div style={{ display: "flex", gap: 22, borderBottom: "1px solid var(--border-soft)", marginBottom: 22, overflowX: "auto" }} className="cx-scrollbar">
          {tabs.map(t => (
            <div key={t} onClick={() => setTab(t)} className={`cx-tab ${tab === t ? "active" : ""}`} style={{ paddingBottom: 12, fontSize: 13.5, fontWeight: 600, whiteSpace: "nowrap" }}>{t}</div>
          ))}
        </div>

        {tab === "Videos" && (
          myVideos && myVideos.length ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px,1fr))", gap: 14 }}>
              {myVideos.map(v => (
                <div key={v.id} style={{ borderRadius: 14, overflow: "hidden", background: v.thumb, height: 130, position: "relative" }}>
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,transparent 50%,rgba(0,0,0,.7))" }} />
                  <div style={{ position: "absolute", bottom: 8, left: 10, right: 10, fontSize: 11.5, fontWeight: 600, color: "#fff" }}>{v.title}</div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "50px 0", color: "var(--g500)" }}>
              <VideoIcon size={30} style={{ marginBottom: 10, opacity: 0.5 }} />
              <div style={{ fontSize: 13.5 }}>No videos uploaded yet</div>
            </div>
          )
        )}
        {tab === "Shorts" && (
          myShorts && myShorts.length ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px,1fr))", gap: 12 }}>
              {myShorts.map(s => (
                <div key={s.id} style={{ borderRadius: 14, overflow: "hidden", background: s.thumb, height: 200, position: "relative" }}>
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,transparent 50%,rgba(0,0,0,.7))" }} />
                  <Play size={16} fill="#fff" color="#fff" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
                  <div className="f-mono" style={{ position: "absolute", bottom: 8, left: 8, fontSize: 10.5, display: "flex", alignItems: "center", gap: 3, color: "#fff" }}><Heart size={10} fill="#fff" />{fmtNum(s.likes)}</div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "50px 0", color: "var(--g500)" }}>
              <Film size={30} style={{ marginBottom: 10, opacity: 0.5 }} />
              <div style={{ fontSize: 13.5 }}>No shorts uploaded yet</div>
            </div>
          )
        )}
        {tab === "Portfolio" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px,1fr))", gap: 16 }}>
            {PORTFOLIO.map(p => (
              <div key={p.id} className="cx-card" style={{ borderRadius: 16, overflow: "hidden" }}>
                <div style={{ height: 130, background: p.thumb }} />
                <div style={{ padding: 14 }}>
                  <div style={{ fontWeight: 700, fontSize: 13.5, marginBottom: 6 }}>{p.title}</div>
                  <div style={{ fontSize: 11.5, color: "var(--g500)", marginBottom: 8 }}>Client: {p.client}</div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
                    {p.tools.map(t => <span key={t} className="f-mono" style={{ fontSize: 10, padding: "2px 7px", borderRadius: 6, background: "var(--surface2)" }}>{t}</span>)}
                  </div>
                  <div style={{ fontSize: 11.5, color: "var(--red)", fontWeight: 600 }}>{p.result}</div>
                </div>
              </div>
            ))}
          </div>
        )}
        {tab === "Services" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {SERVICES.map(sv => (
              <div key={sv.id} className="cx-card" style={{ padding: 18, borderRadius: 16, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14.5, marginBottom: 6 }}>{sv.title}</div>
                  <div style={{ fontSize: 12, color: "var(--g500)", marginBottom: 8, display: "flex", alignItems: "center", gap: 5 }}><Clock size={12} />Delivery in {sv.delivery}</div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {sv.includes.map(i => <span key={i} className="f-mono" style={{ fontSize: 10, padding: "2px 7px", borderRadius: 6, background: "var(--surface2)" }}>{i}</span>)}
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div className="f-display" style={{ fontSize: 22, fontWeight: 700, color: "var(--red)" }}>${sv.price}</div>
                  <button className="cx-btn-primary" style={{ padding: "9px 18px", borderRadius: 9, fontSize: 12.5, marginTop: 8 }}>Order Now</button>
                </div>
              </div>
            ))}
          </div>
        )}
        {tab === "Reviews" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {REVIEWS.map(r => (
              <div key={r.id} className="cx-card" style={{ padding: 16, borderRadius: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{r.client}</div>
                  <div style={{ display: "flex", gap: 2 }}>{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={12} fill={i < r.rating ? "var(--red)" : "none"} color="var(--red)" />)}</div>
                </div>
                <div style={{ fontSize: 12.5, color: "var(--g300)", marginBottom: 8, lineHeight: 1.5 }}>{r.text}</div>
                <div className="f-mono" style={{ fontSize: 11, color: "var(--g500)" }}>{r.project} · {r.date}</div>
              </div>
            ))}
          </div>
        )}
        {tab === "Posts" && (
          <div style={{ textAlign: "center", padding: "50px 0", color: "var(--g500)" }}>
            <Layers size={30} style={{ marginBottom: 10, opacity: 0.5 }} />
            <div style={{ fontSize: 13.5 }}>No posts yet — check back soon</div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   JOBS
=============================================================== */

function JobCard({ j, onApply, onOpenClient }) {
  return (
    <div className="cx-card cx-fade-up" style={{ padding: 20, borderRadius: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{j.title}</div>
          <div style={{ fontSize: 12, color: "var(--g500)", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span onClick={() => onOpenClient && onOpenClient(j.client)} style={{ cursor: onOpenClient ? "pointer" : "default", fontWeight: 600, color: onOpenClient ? "var(--ink)" : "var(--g500)" }}>{j.client.name}</span><span>·</span><span>{j.posted}</span><span>·</span><span>{j.category}</span>
          </div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div className="f-display" style={{ fontSize: 17, fontWeight: 700, color: "var(--red)" }}>{j.budget}</div>
          <div className="f-mono" style={{ fontSize: 10.5, color: "var(--g500)" }}>{j.type}</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
        {j.skills.map(s => <span key={s} className="f-mono" style={{ fontSize: 10.5, padding: "4px 10px", borderRadius: 7, background: "var(--surface2)", border: "1px solid var(--border)" }}>{s}</span>)}
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", gap: 16, fontSize: 11.5, color: "var(--g500)" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Clock size={12} />{j.deadline}</span>
          <span>{j.level}</span>
          <span>{j.proposals} proposals</span>
        </div>
        <button onClick={onApply} className="cx-btn-primary" style={{ padding: "8px 18px", borderRadius: 9, fontSize: 12.5, fontWeight: 600 }}>Apply</button>
      </div>
    </div>
  );
}

function ApplyModal({ job, onClose }) {
  const [sent, setSent] = useState(false);
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 60, padding: 20 }}>
      <div onClick={e => e.stopPropagation()} className="cx-card cx-pop" style={{ width: "100%", maxWidth: 460, padding: 26, borderRadius: 20 }}>
        {!sent ? (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
              <div>
                <div className="f-display" style={{ fontSize: 17, fontWeight: 700 }}>Apply to job</div>
                <div style={{ fontSize: 12.5, color: "var(--g500)" }}>{job.title}</div>
              </div>
              <X size={18} onClick={onClose} style={{ cursor: "pointer" }} />
            </div>
            <textarea placeholder="Write your proposal…" rows={4} className="cx-input" style={{ width: "100%", padding: 12, borderRadius: 12, fontSize: 13, marginBottom: 12, resize: "none" }} />
            <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
              <input placeholder="Your price ($)" className="cx-input" style={{ flex: 1, padding: 12, borderRadius: 12, fontSize: 13 }} />
              <input placeholder="Delivery time" className="cx-input" style={{ flex: 1, padding: 12, borderRadius: 12, fontSize: 13 }} />
            </div>
            <button onClick={() => setSent(true)} className="cx-btn-primary" style={{ width: "100%", padding: "13px 0", borderRadius: 12, fontSize: 14 }}>Send Proposal</button>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <div className="cx-pop" style={{ width: 54, height: 54, borderRadius: "50%", background: "linear-gradient(135deg,var(--red),var(--red-deep))", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <Check size={24} color="#fff" strokeWidth={3} />
            </div>
            <div className="f-display" style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Proposal sent</div>
            <div style={{ fontSize: 13, color: "var(--g500)", marginBottom: 20 }}>{job.client.name} will review your proposal soon</div>
            <button onClick={onClose} className="cx-btn-ghost" style={{ width: "100%", padding: "11px 0", borderRadius: 10, fontSize: 13 }}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
}

function JobsView({ onOpenProfile }) {
  const [applyJob, setApplyJob] = useState(null);
  const [filter, setFilter] = useState(null);
  const list = JOBS.filter(j => matchesFilter({ title: j.title, category: j.category }, filter));
  return (
    <div style={{ padding: "24px 22px 90px", maxWidth: 780 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4, flexWrap: "wrap", gap: 10 }}>
        <h2 className="f-display" style={{ fontSize: 22, fontWeight: 700 }}>Jobs marketplace</h2>
      </div>
      <p style={{ color: "var(--g500)", fontSize: 13, marginBottom: 18 }}>{list.length} open jobs matching your skills</p>
      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 20 }} className="cx-scrollbar">
        <div onClick={() => setFilter(null)} className="f-mono" style={{ padding: "7px 14px", borderRadius: 20, fontSize: 12, whiteSpace: "nowrap", cursor: "pointer", flexShrink: 0, background: !filter ? "linear-gradient(135deg,var(--red),var(--red-deep))" : "var(--surface2)", border: !filter ? "none" : "1px solid var(--border)", color: !filter ? "#fff" : "var(--g300)" }}>All Categories</div>
        {FILTER_CHIPS.slice(0, 5).map(f => (
          <div key={f} onClick={() => setFilter(x => x === f ? null : f)} className="f-mono" style={{ padding: "7px 14px", borderRadius: 20, fontSize: 12, whiteSpace: "nowrap", cursor: "pointer", flexShrink: 0, background: filter === f ? "linear-gradient(135deg,var(--red),var(--red-deep))" : "var(--surface2)", border: filter === f ? "none" : "1px solid var(--border)", color: filter === f ? "#fff" : "var(--g300)" }}>{f}</div>
        ))}
      </div>
      {list.length ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {list.map(j => <JobCard key={j.id} j={j} onApply={() => setApplyJob(j)} onOpenClient={onOpenProfile} />)}
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--g500)" }}>
          <Briefcase size={30} style={{ marginBottom: 10, opacity: 0.5 }} />
          <div style={{ fontSize: 13.5 }}>No jobs match "{filter}" right now</div>
        </div>
      )}
      {applyJob && <ApplyModal job={applyJob} onClose={() => setApplyJob(null)} />}
    </div>
  );
}

function PostJobView({ onPosted, onBack }) {
  const [posted, setPosted] = useState(false);
  return (
    <div style={{ padding: "24px 22px 90px", maxWidth: 640 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
        <div onClick={onBack} style={{ width: 34, height: 34, borderRadius: "50%", background: "var(--surface2)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><ArrowLeft size={16} /></div>
        <h2 className="f-display" style={{ fontSize: 21, fontWeight: 700 }}>Post a job</h2>
      </div>
      {!posted ? (
        <div className="cx-card" style={{ padding: 24, borderRadius: 18, display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ fontSize: 12.5, color: "var(--g400)", marginBottom: 6, display: "block" }}>Job title</label>
            <input placeholder="e.g. Edit 10 YouTube Shorts for skincare brand" className="cx-input" style={{ width: "100%", padding: 12, borderRadius: 11, fontSize: 13.5 }} />
          </div>
          <div>
            <label style={{ fontSize: 12.5, color: "var(--g400)", marginBottom: 6, display: "block" }}>Description</label>
            <textarea rows={4} placeholder="Describe what you need…" className="cx-input" style={{ width: "100%", padding: 12, borderRadius: 11, fontSize: 13.5, resize: "none" }} />
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12.5, color: "var(--g400)", marginBottom: 6, display: "block" }}>Category</label>
              <select className="cx-input" style={{ width: "100%", padding: 12, borderRadius: 11, fontSize: 13.5 }}>
                {["Video Editing", "3D Animation", "UI/UX Design", "Development", "Copywriting"].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12.5, color: "var(--g400)", marginBottom: 6, display: "block" }}>Experience level</label>
              <select className="cx-input" style={{ width: "100%", padding: 12, borderRadius: 11, fontSize: 13.5 }}>
                {["Entry", "Intermediate", "Expert"].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label style={{ fontSize: 12.5, color: "var(--g400)", marginBottom: 6, display: "block" }}>Skills required</label>
            <input placeholder="e.g. Premiere Pro, Captions, Sound Design" className="cx-input" style={{ width: "100%", padding: 12, borderRadius: 11, fontSize: 13.5 }} />
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12.5, color: "var(--g400)", marginBottom: 6, display: "block" }}>Budget type</label>
              <select className="cx-input" style={{ width: "100%", padding: 12, borderRadius: 11, fontSize: 13.5 }}>
                <option>Fixed price</option><option>Hourly</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12.5, color: "var(--g400)", marginBottom: 6, display: "block" }}>Budget ($)</label>
              <input placeholder="400" className="cx-input" style={{ width: "100%", padding: 12, borderRadius: 11, fontSize: 13.5 }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12.5, color: "var(--g400)", marginBottom: 6, display: "block" }}>Deadline</label>
              <input placeholder="7 days" className="cx-input" style={{ width: "100%", padding: 12, borderRadius: 11, fontSize: 13.5 }} />
            </div>
          </div>
          <div>
            <label style={{ fontSize: 12.5, color: "var(--g400)", marginBottom: 6, display: "block" }}>Freelancers needed</label>
            <input placeholder="1" className="cx-input" style={{ width: 120, padding: 12, borderRadius: 11, fontSize: 13.5 }} />
          </div>
          <div style={{ border: "1.5px dashed var(--border)", borderRadius: 12, padding: 20, textAlign: "center", color: "var(--g500)", fontSize: 12.5, cursor: "pointer" }}>
            <Paperclip size={16} style={{ marginBottom: 6 }} /><br />Attach files or references
          </div>
          <button onClick={() => setPosted(true)} className="cx-btn-primary" style={{ padding: "14px 0", borderRadius: 12, fontSize: 14, marginTop: 6 }}>Publish Job</button>
        </div>
      ) : (
        <div className="cx-card cx-pop" style={{ padding: 40, borderRadius: 20, textAlign: "center" }}>
          <div style={{ width: 58, height: 58, borderRadius: "50%", background: "linear-gradient(135deg,var(--red),var(--red-deep))", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
            <Check size={26} color="#fff" strokeWidth={3} />
          </div>
          <div className="f-display" style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Job published</div>
          <div style={{ fontSize: 13.5, color: "var(--g500)", marginBottom: 22 }}>Freelancers can now see and apply to your job</div>
          <button onClick={onPosted} className="cx-btn-ghost" style={{ padding: "11px 24px", borderRadius: 10, fontSize: 13 }}>View Jobs</button>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   MESSAGES
=============================================================== */

function MessagesView({ onOpenProfile }) {
  const [active, setActive] = useState(CONVERSATIONS[0]);
  const [draft, setDraft] = useState("");
  const [thread, setThread] = useState(MESSAGES_THREAD);
  const send = () => {
    if (!draft.trim()) return;
    setThread(t => [...t, { id: Date.now(), from: "me", text: draft, time: "now" }]);
    setDraft("");
  };
  return (
    <div style={{ display: "flex", height: "100%" }}>
      <div className="cx-scrollbar" style={{ width: 300, flexShrink: 0, borderRight: "1px solid var(--border-soft)", overflowY: "auto" }}>
        <div style={{ padding: 18, fontSize: 15, fontWeight: 700 }} className="f-display">Messages</div>
        {CONVERSATIONS.map(c => (
          <div key={c.id} onClick={() => setActive(c)} style={{ display: "flex", gap: 11, padding: "12px 18px", cursor: "pointer", background: active.id === c.id ? "var(--surface2)" : "transparent" }}>
            <div onClick={(e) => { e.stopPropagation(); onOpenProfile && onOpenProfile(c.person); }} style={{ position: "relative", flexShrink: 0, cursor: "pointer" }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: c.person.avatar }} />
              {c.online && <div style={{ position: "absolute", bottom: -1, right: -1, width: 11, height: 11, borderRadius: "50%", background: "#2ecc71", border: "2px solid var(--bg)" }} />}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 6 }}>
                <span onClick={(e) => { e.stopPropagation(); onOpenProfile && onOpenProfile(c.person); }} style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", cursor: "pointer" }}>{c.person.name}</span>
                <span className="f-mono" style={{ fontSize: 10.5, color: "var(--g500)", flexShrink: 0 }}>{c.time}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 6 }}>
                <span style={{ fontSize: 12, color: "var(--g500)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.lastMsg}</span>
                {c.unread > 0 && <span className="f-mono" style={{ fontSize: 10, background: "var(--red-dim)", borderRadius: 9, width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#fff" }}>{c.unread}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 11, padding: "14px 20px", borderBottom: "1px solid var(--border-soft)", cursor: "pointer" }} onClick={() => onOpenProfile && onOpenProfile(active.person)}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: active.person.avatar }} />
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 600 }}>{active.person.name}</div>
            <div style={{ fontSize: 11.5, color: active.online ? "#2ecc71" : "var(--g500)" }}>{active.online ? "Online" : "Offline"}</div>
          </div>
        </div>
        <div className="cx-scrollbar" style={{ flex: 1, overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
          {thread.map(m => (
            <div key={m.id} style={{ display: "flex", justifyContent: m.from === "me" ? "flex-end" : "flex-start" }}>
              <div style={{ maxWidth: "70%", padding: "10px 14px", borderRadius: 16, fontSize: 13, lineHeight: 1.4, background: m.from === "me" ? "linear-gradient(135deg,var(--red),var(--red-deep))" : "var(--surface2)", borderBottomRightRadius: m.from === "me" ? 4 : 16, borderBottomLeftRadius: m.from === "me" ? 16 : 4 }}>
                {m.text}
                <div className="f-mono" style={{ fontSize: 9.5, opacity: 0.6, marginTop: 4, textAlign: "right" }}>{m.time}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: 16, borderTop: "1px solid var(--border-soft)" }}>
          <Paperclip size={17} color="var(--g500)" style={{ cursor: "pointer", flexShrink: 0 }} />
          <ImageIcon size={17} color="var(--g500)" style={{ cursor: "pointer", flexShrink: 0 }} />
          <VideoIcon size={17} color="var(--g500)" style={{ cursor: "pointer", flexShrink: 0 }} />
          <input value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Message…" className="cx-input" style={{ flex: 1, padding: "10px 14px", borderRadius: 20, fontSize: 13 }} />
          <Mic size={17} color="var(--g500)" style={{ cursor: "pointer", flexShrink: 0 }} />
          <div onClick={send} style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,var(--red),var(--red-deep))", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
            <Send size={14} color="#fff" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   NOTIFICATIONS
=============================================================== */

function NotificationsView({ onOpenProfile }) {
  const iconFor = t => ({ follow: <UserPlus size={15} />, like: <Heart size={15} fill="var(--red)" />, comment: <MessageSquare size={15} />, job: <Briefcase size={15} />, message: <MessageCircle size={15} /> }[t]);
  return (
    <div style={{ padding: "24px 22px 90px", maxWidth: 560 }}>
      <h2 className="f-display" style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>Notifications</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {NOTIFICATIONS.map(n => (
          <div key={n.id} onClick={() => onOpenProfile && onOpenProfile(n.person)} className="cx-fade-up" style={{ display: "flex", alignItems: "center", gap: 13, padding: 14, borderRadius: 14, cursor: "pointer" }} onMouseEnter={e => e.currentTarget.style.background = "var(--surface2)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: n.person.avatar }} />
              <div style={{ position: "absolute", bottom: -3, right: -3, width: 21, height: 21, borderRadius: "50%", background: "var(--surface)", border: "2px solid var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--red)" }}>{iconFor(n.type)}</div>
            </div>
            <div style={{ flex: 1, fontSize: 13, lineHeight: 1.4 }}>
              <span style={{ fontWeight: 700 }}>{n.person.name}</span> <span style={{ color: "var(--g300)" }}>{n.text}</span>
            </div>
            <span className="f-mono" style={{ fontSize: 11, color: "var(--g500)", flexShrink: 0 }}>{n.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RoleScreen({ onSelect }) {
  const [role, setRole] = useState(null);
  const cards = [
    { id: "freelancer", title: "Freelancer / Creator", desc: "I want to offer my skills, create content and work with clients.", icon: <Award size={22} /> },
    { id: "client", title: "Client / Buyer", desc: "I want to find talented people and hire them.", icon: <BriefcaseIcon size={22} /> },
  ];
  return (
    <div className="cx-bg-noise" style={{ minHeight: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 20px" }}>
      <div className="cx-fade-up" style={{ width: "100%", maxWidth: 560 }}>
        <h2 className="f-display" style={{ fontSize: 26, fontWeight: 700, textAlign: "center", marginBottom: 8 }}>What are you here for?</h2>
        <p style={{ color: "var(--g400)", fontSize: 14, textAlign: "center", marginBottom: 32 }}>You can add the other role later from settings</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 24 }}>
          {cards.map(c => (
            <div key={c.id} onClick={() => setRole(c.id)}
              className="cx-card"
              style={{
                padding: "26px 20px", borderRadius: 18, cursor: "pointer", textAlign: "left",
                borderColor: role === c.id ? "var(--red-dim)" : undefined,
                background: role === c.id ? "linear-gradient(160deg, rgba(255,46,67,.10), var(--surface))" : "var(--surface)",
                boxShadow: role === c.id ? "0 0 0 1px var(--red-dim), 0 8px 30px var(--red-glow)" : "none",
              }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: role === c.id ? "linear-gradient(135deg,var(--red),var(--red-deep))" : "var(--surface2)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16, color: role === c.id ? "#fff" : "var(--ink)" }}>
                {c.icon}
              </div>
              <div className="f-display" style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>{c.title}</div>
              <div style={{ fontSize: 13, color: "var(--g400)", lineHeight: 1.5 }}>{c.desc}</div>
            </div>
          ))}
        </div>
        <button disabled={!role} onClick={() => onSelect(role)} className="cx-btn-primary" style={{ width: "100%", padding: "15px 0", borderRadius: 14, fontSize: 15 }}>
          Continue
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   ABOUT YOU — bio + skills (freelancer) or interests (client)
=============================================================== */

const SKILL_GROUPS = [
  { group: "Design & Video", items: ["Motion Design", "Graphic Design", "Photoshop", "Illustrator", "CapCut", "Canva", "Premiere Pro", "After Effects", "DaVinci Resolve", "Figma"] },
  { group: "3D", items: ["Blender", "Unity", "3ds Max", "SketchUp", "Cinema 4D"] },
  { group: "Office", items: ["Word", "Excel", "PowerPoint"] },
  { group: "IT / Programming", items: ["Python", "JavaScript", "TypeScript", "Java", "C++", "C#", "PHP", "Swift", "Kotlin", "Go", "SQL", "React", "Node.js"] },
  { group: "Other", items: ["Copywriting", "Marketing", "Photography", "UI/UX Design", "AI Tools"] },
];

const CLIENT_NEEDS = ["Video Editing", "Motion Design", "Graphic Design", "3D Animation", "UI/UX Design", "Web Development", "Mobile Development", "Copywriting", "Marketing", "Photography", "AI Tools"];

function AboutYouScreen({ role, onDone }) {
  const [bio, setBio] = useState("");
  const [selected, setSelected] = useState([]);

  const toggle = (item) => setSelected(s => s.includes(item) ? s.filter(x => x !== item) : [...s, item]);
  const canSubmit = bio.trim().length >= 10 && selected.length > 0;

  return (
    <div className="cx-bg-noise" style={{ minHeight: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 20px" }}>
      <div className="cx-fade-up cx-scrollbar" style={{ width: "100%", maxWidth: 620, maxHeight: "88vh", overflowY: "auto", padding: "4px 4px 4px 0" }}>
        <h2 className="f-display" style={{ fontSize: 24, fontWeight: 700, textAlign: "center", marginBottom: 6 }}>
          {role === "freelancer" ? "What can you work with?" : "What are you looking to hire for?"}
        </h2>
        <p style={{ color: "var(--g400)", fontSize: 13.5, textAlign: "center", marginBottom: 26 }}>
          {role === "freelancer" ? "Select the tools and skills you use so clients can find you" : "Select the categories you're interested in — this helps us recommend the right freelancers"}
        </p>

        <label style={{ fontSize: 12.5, color: "var(--g400)", marginBottom: 6, display: "block", fontWeight: 600 }}>Short bio</label>
        <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3}
          placeholder={role === "freelancer" ? "Tell clients about your experience and what you specialize in…" : "Tell freelancers about you or your company…"}
          className="cx-input" style={{ width: "100%", padding: 12, borderRadius: 12, fontSize: 13.5, marginBottom: 22, resize: "none" }} />

        {role === "freelancer" ? (
          <>
            {SKILL_GROUPS.map(g => (
              <div key={g.group} style={{ marginBottom: 18 }}>
                <div className="f-mono" style={{ fontSize: 11, color: "var(--g500)", textTransform: "uppercase", marginBottom: 8 }}>{g.group}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {g.items.map(item => (
                    <div key={item} onClick={() => toggle(item)} className="f-mono"
                      style={{ padding: "7px 13px", borderRadius: 9, fontSize: 12, cursor: "pointer",
                        background: selected.includes(item) ? "linear-gradient(135deg,var(--red),var(--red-deep))" : "var(--surface2)",
                        border: selected.includes(item) ? "none" : "1px solid var(--border)",
                        color: selected.includes(item) ? "#fff" : "var(--g300)" }}>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>
        ) : (
          <div style={{ marginBottom: 18 }}>
            <div className="f-mono" style={{ fontSize: 11, color: "var(--g500)", textTransform: "uppercase", marginBottom: 8 }}>Categories</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {CLIENT_NEEDS.map(item => (
                <div key={item} onClick={() => toggle(item)} className="f-mono"
                  style={{ padding: "8px 14px", borderRadius: 9, fontSize: 12.5, cursor: "pointer",
                    background: selected.includes(item) ? "linear-gradient(135deg,var(--red),var(--red-deep))" : "var(--surface2)",
                    border: selected.includes(item) ? "none" : "1px solid var(--border)",
                    color: selected.includes(item) ? "#fff" : "var(--g300)" }}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        )}

        <button disabled={!canSubmit} onClick={() => onDone({ bio: bio.trim(), skills: selected })} className="cx-btn-primary" style={{ width: "100%", padding: "15px 0", borderRadius: 14, fontSize: 15, marginTop: 8 }}>
          Enter CreatorX
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   UPLOAD — video / short publishing
=============================================================== */

const THUMB_GRADIENTS = [
  "linear-gradient(135deg,#FF2E43,#8C0E22)",
  "linear-gradient(135deg,#FF6B7A,#4a0812)",
  "linear-gradient(135deg,#E11D2E,#1a0308)",
  "linear-gradient(160deg,#FF9AA6,#5c0a18)",
];

function UploadModal({ me, onClose, onPublish }) {
  const [type, setType] = useState("video");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [done, setDone] = useState(false);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => { if (previewUrl) URL.revokeObjectURL(previewUrl); };
  }, [previewUrl]);

  const pickFile = () => fileInputRef.current && fileInputRef.current.click();

  const onFileChange = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
    if (!title.trim()) setTitle(f.name.replace(/\.[^/.]+$/, ""));
  };

  const removeFile = (e) => {
    e.stopPropagation();
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const switchType = (t) => {
    setType(t);
    removeFile({ stopPropagation: () => {} });
  };

  const publish = () => {
    if (!title.trim() || !file) return;
    const thumb = THUMB_GRADIENTS[Math.floor(Math.random() * THUMB_GRADIENTS.length)];
    if (type === "video") {
      onPublish("video", {
        id: "uv" + Date.now(), creator: me, title: title.trim(), views: "0", likes: 0, comments: 0,
        duration: "0:00", thumb, fileName: file.name,
      });
    } else {
      onPublish("short", {
        id: "us" + Date.now(), creator: me, caption: title.trim() + (desc ? " — " + desc : ""), likes: 0, comments: 0, thumb, fileName: file.name,
      });
    }
    setDone(true);
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 70, padding: 20 }}>
      <div onClick={e => e.stopPropagation()} className="cx-card cx-pop" style={{ width: "100%", maxWidth: 460, padding: 26, borderRadius: 20 }}>
        {!done ? (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <div className="f-display" style={{ fontSize: 17, fontWeight: 700 }}>Upload content</div>
              <X size={18} onClick={onClose} style={{ cursor: "pointer" }} />
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
              <div onClick={() => switchType("video")} style={{ flex: 1, padding: "12px 0", borderRadius: 12, textAlign: "center", cursor: "pointer", fontSize: 13, fontWeight: 600, border: type === "video" ? "none" : "1px solid var(--border)", background: type === "video" ? "linear-gradient(135deg,var(--red),var(--red-deep))" : "var(--surface2)", color: type === "video" ? "#fff" : "var(--g300)" }}>
                <VideoIcon size={17} style={{ marginBottom: 4 }} /><br />Video
              </div>
              <div onClick={() => switchType("short")} style={{ flex: 1, padding: "12px 0", borderRadius: 12, textAlign: "center", cursor: "pointer", fontSize: 13, fontWeight: 600, border: type === "short" ? "none" : "1px solid var(--border)", background: type === "short" ? "linear-gradient(135deg,var(--red),var(--red-deep))" : "var(--surface2)", color: type === "short" ? "#fff" : "var(--g300)" }}>
                <Film size={17} style={{ marginBottom: 4 }} /><br />Short
              </div>
            </div>

            <input ref={fileInputRef} type="file" accept="video/*" onChange={onFileChange} style={{ display: "none" }} />

            {!file ? (
              <div onClick={pickFile} style={{ border: "1.5px dashed var(--border)", borderRadius: 14, padding: 26, textAlign: "center", color: "var(--g500)", fontSize: 12.5, marginBottom: 16, cursor: "pointer" }}>
                <UploadIcon size={20} style={{ marginBottom: 8 }} /><br />
                Click to browse and select your {type === "video" ? "video" : "9:16 short"} file
              </div>
            ) : (
              <div style={{ borderRadius: 14, overflow: "hidden", border: "1px solid var(--border-soft)", marginBottom: 16, position: "relative" }}>
                <video src={previewUrl} controls style={{ width: "100%", maxHeight: 220, display: "block", background: "#000" }} />
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", background: "var(--surface2)" }}>
                  <span className="f-mono" style={{ fontSize: 11, color: "var(--g400)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{file.name}</span>
                  <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
                    <span onClick={pickFile} style={{ fontSize: 11, color: "var(--red)", cursor: "pointer", fontWeight: 600 }}>Change</span>
                    <X size={14} onClick={removeFile} style={{ cursor: "pointer" }} />
                  </div>
                </div>
              </div>
            )}

            <input value={title} onChange={e => setTitle(e.target.value)} placeholder={type === "video" ? "Video title" : "Caption"} className="cx-input" style={{ width: "100%", padding: 12, borderRadius: 12, fontSize: 13.5, marginBottom: 12 }} />
            <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Description (optional)" rows={3} className="cx-input" style={{ width: "100%", padding: 12, borderRadius: 12, fontSize: 13.5, marginBottom: 18, resize: "none" }} />
            <button disabled={!title.trim() || !file} onClick={publish} className="cx-btn-primary" style={{ width: "100%", padding: "13px 0", borderRadius: 12, fontSize: 14 }}>Publish</button>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <div className="cx-pop" style={{ width: 54, height: 54, borderRadius: "50%", background: "linear-gradient(135deg,var(--red),var(--red-deep))", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <Check size={24} color="#fff" strokeWidth={3} />
            </div>
            <div className="f-display" style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{type === "video" ? "Video" : "Short"} published</div>
            <div style={{ fontSize: 13, color: "var(--g500)", marginBottom: 20 }}>It's now live on your profile and in the feed</div>
            <button onClick={onClose} className="cx-btn-ghost" style={{ width: "100%", padding: "11px 0", borderRadius: 10, fontSize: 13 }}>Done</button>
          </div>
        )}
      </div>
    </div>
  );
}


/* ============================================================
   ROOT APP
=============================================================== */

export default function App() {
  const [stage, setStage] = useState("welcome"); // welcome -> auth -> role -> about -> app
  const [tab, setTab] = useState("home");
  const [prevTab, setPrevTab] = useState("home");
  const [query, setQuery] = useState("");
  const [viewedProfile, setViewedProfile] = useState(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [videos, setVideos] = useState(VIDEOS);
  const [shorts, setShorts] = useState(SHORTS);
  const [authData, setAuthData] = useState(null);
  const [role, setRole] = useState(null);
  const [me, setMe] = useState(null);

  const openProfile = (creator) => {
    if (!creator) return;
    setViewedProfile(creator);
    setPrevTab(tab === "view-profile" ? prevTab : tab);
    setTab("view-profile");
  };

  const goTab = (id) => { setPrevTab(tab); setTab(id); };

  const handlePublish = (type, item) => {
    if (type === "video") setVideos(v => [item, ...v]);
    else setShorts(s => [item, ...s]);
  };

  const finishAuth = (data) => { setAuthData(data); setStage("role"); };
  const finishRole = (r) => { setRole(r); setStage("about"); };
  const finishAbout = ({ bio, skills }) => {
    setMe({
      name: `${authData.name} ${authData.last}`, username: authData.username,
      role, title: role === "freelancer" ? (skills[0] ? skills[0] : "Freelancer on CreatorX") : "Client on CreatorX",
      verified: false, avatar: "linear-gradient(135deg,#FF6B7A,#4a0812)", bio,
      location: "Tashkent, UZ", since: 2026, skills, needs: role === "client" ? skills : undefined,
      rating: 0, reviews: 0, followers: 0, following: 0, views: "0", completed: 0,
    });
    setStage("app");
  };

  let body = null;
  if (me) {
    if (tab === "home") body = <HomeFeed onOpenProfile={openProfile} videos={videos} />;
    else if (tab === "discover") body = <DiscoverView onOpenProfile={openProfile} />;
    else if (tab === "shorts") body = <ShortsView shorts={shorts} onOpenProfile={openProfile} />;
    else if (tab === "jobs") body = <JobsView onOpenProfile={openProfile} />;
    else if (tab === "messages") body = <MessagesView onOpenProfile={openProfile} />;
    else if (tab === "notifications") body = <NotificationsView onOpenProfile={openProfile} />;
    else if (tab === "post-job") body = <PostJobView onPosted={() => goTab("jobs")} onBack={() => goTab("home")} />;
    else if (tab === "profile") body = <ProfileView creator={me} isMe myVideos={videos.filter(v => v.creator.username === me.username)} myShorts={shorts.filter(s => s.creator.username === me.username)} onMessage={() => goTab("messages")} onUpdateCover={(cover) => setMe(m => ({ ...m, cover }))} />;
    else if (tab === "view-profile") body = <ProfileView creator={viewedProfile} isMe={viewedProfile && viewedProfile.username === me.username} myVideos={videos.filter(v => v.creator.username === (viewedProfile && viewedProfile.username))} myShorts={shorts.filter(s => s.creator.username === (viewedProfile && viewedProfile.username))} onBack={() => setTab(prevTab)} onMessage={() => goTab("messages")} />;
  }

  const sidebarTab = tab === "view-profile" ? (viewedProfile && me && viewedProfile.username === me.username ? "profile" : prevTab) : tab;

  return (
    <div className="cx-root cx-fade" style={{ width: "100%", height: "100%", minHeight: 640, overflow: "hidden", position: "relative" }}>
      <GlobalStyle />
      {stage === "welcome" && <WelcomeScreen onContinue={() => setStage("auth")} />}
      {stage === "auth" && <AuthScreen onDone={finishAuth} />}
      {stage === "role" && <RoleScreen onSelect={finishRole} />}
      {stage === "about" && <AboutYouScreen role={role} onDone={finishAbout} />}
      {stage === "app" && me && (
        <div style={{ display: "flex", height: "100%" }}>
          <div className="cx-hide-mobile" style={{ display: "flex" }}>
            <Sidebar tab={sidebarTab} setTab={goTab} me={me} onUpload={() => setUploadOpen(true)} />
          </div>
          <div className="cx-scrollbar" style={{ flex: 1, minWidth: 0, height: "100%", overflowY: "auto", display: "flex", flexDirection: "column" }}>
            {tab !== "messages" && tab !== "shorts" && <TopBar query={query} setQuery={setQuery} onProfile={() => goTab("profile")} me={me} onOpenProfile={openProfile} videos={videos} onGoJobs={() => goTab("jobs")} onGoDiscover={() => goTab("discover")} />}
            <div style={{ flex: 1, minHeight: 0 }}>{body}</div>
          </div>
        </div>
      )}
      {stage === "app" && uploadOpen && <UploadModal me={me} onClose={() => setUploadOpen(false)} onPublish={handlePublish} />}
      {stage === "app" && (
        <div className="cx-show-mobile">
          <BottomNav tab={tab} setTab={goTab} onUpload={() => setUploadOpen(true)} />
        </div>
      )}
      <style>{`
        .cx-show-mobile{ display:none; }
        @media (max-width: 860px){
          .cx-hide-mobile{ display:none !important; }
          .cx-show-mobile{ display:block; }
        }
      `}</style>
    </div>
  );
}
