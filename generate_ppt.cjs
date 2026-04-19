const pptxgen = require("pptxgenjs");
let pptx = new pptxgen();

pptx.layout = 'LAYOUT_16x9';
pptx.title = "AstraRent Platform Architecture";

// Premium Color Palette
const BG_DARK = "0f172a";
const ACCENT = "6366f1"; // Indigo
const ACCENT2 = "ec4899"; // Pink
const TEXT_H = "ffffff";
const TEXT_P = "cbd5e1";

// Define Master Slide for a sleek, cohesive theme
pptx.defineSlideMaster({
  title: "MASTER_DARK",
  background: { color: BG_DARK },
  objects: [
    { rect: { x: 0, y: 0, w: "100%", h: 0.1, fill: { color: ACCENT } } }, // Top brand bar
    { line: { x: 0.5, y: 5.2, w: 9, h: 0, line: { color: "334155", width: 1 } } }, // Footer divider
    { text: { text: "ASTRARENT PLATFORM", options: { x: 0.5, y: 5.3, w: 2, h: 0.3, fontSize: 10, color: "64748b" } } }
  ]
});

// 1. Title Slide
let slide1 = pptx.addSlide({ masterName: "MASTER_DARK" });
slide1.addShape(pptx.ShapeType.rect, { x: 0.5, y: 1.5, w: 0.1, h: 2, fill: { color: ACCENT } });
slide1.addText("AstraRent", { x: 0.8, y: 1.5, w: '80%', h: 1, fontSize: 64, bold: true, color: TEXT_H, fontFace: "Segoe UI" });
slide1.addText("Enterprise Hardware Leasing out on the Edge", { x: 0.8, y: 2.5, w: '80%', h: 0.8, fontSize: 28, color: ACCENT2, fontFace: "Segoe UI" });
slide1.addText("Modern architecture for the modern corporate fleet.", { x: 0.8, y: 3.2, w: '80%', h: 0.5, fontSize: 18, color: TEXT_P, fontFace: "Segoe UI" });

// 2. Introduction
let slide2 = pptx.addSlide({ masterName: "MASTER_DARK" });
slide2.addText("Introduction", { x: 0.5, y: 0.5, w: "90%", fontSize: 36, bold: true, color: TEXT_H, fontFace: "Segoe UI" });
slide2.addShape(pptx.ShapeType.rect, { x: 0.5, y: 1.3, w: 8.5, h: 1.6, fill: { color: "1e293b" } });
slide2.addText("What is AstraRent?\nA fully decentralized edge application designed for seamless IT hardware leasing. We remove the friction from massive enterprise fleet deployments.", { x: 0.8, y: 1.5, w: 8, h: 1.2, fontSize: 20, color: TEXT_P });
slide2.addShape(pptx.ShapeType.rect, { x: 0.5, y: 3.1, w: 8.5, h: 1.6, fill: { color: "1e293b" } });
slide2.addText("Who is it for?\nEnterprise operators, IT administrators, and corporate users needing instant remote deployment across the world.", { x: 0.8, y: 3.3, w: 8, h: 1.2, fontSize: 20, color: TEXT_P });

// 3. The Problem
let slide3 = pptx.addSlide({ masterName: "MASTER_DARK" });
slide3.addText("The Problem", { x: 0.5, y: 0.5, fontSize: 36, bold: true, color: TEXT_H });
slide3.addShape(pptx.ShapeType.rect, { x: 6, y: 1.5, w: 3.5, h: 3.5, fill: { color: ACCENT } });
slide3.addText("Currently,\nenterprise rental\nis a bottleneck.", { x: 6.2, y: 2.2, w: 3.1, h: 2, fontSize: 28, bold: true, color: "ffffff", align: "center", fontFace: "Segoe UI" });
slide3.addText([
  { text: "Manual verification workflows take 24-48 hours." },
  { text: "Fragmented database systems for tracking hardware." },
  { text: "Poor UI/UX experiences lower conversion rates." }
], { x: 0.5, y: 1.5, w: 5, fontSize: 22, color: TEXT_P, bullet: { code: '26A0', color: ACCENT2 }, lineSpacing: 40 });

// 4. The Solution
let slide4 = pptx.addSlide({ masterName: "MASTER_DARK" });
slide4.addText("The Solution", { x: 0.5, y: 0.5, fontSize: 36, bold: true, color: TEXT_H });
slide4.addText([
  { text: "Zero-Friction Glassmorphism UI", options: { bold: true, color: "ffffff" } },
  { text: "Reduces bounce rates and ensures a premium user journey.", options: { indentLevel: 1 } },
  { text: "Instant AI Verification", options: { bold: true, color: "ffffff" } },
  { text: "Drops onboarding processing time from days to mere milliseconds.", options: { indentLevel: 1 } },
  { text: "Globally Distributed Backend", options: { bold: true, color: "ffffff" } },
  { text: "Live fleet updates everywhere simultaneously, worldwide.", options: { indentLevel: 1 } },
], { x: 0.5, y: 1.5, w: "90%", fontSize: 20, color: TEXT_P, bullet: { color: ACCENT, code: '25FC' }, lineSpacing: 30 });

// 5. Skills Used
let slide5 = pptx.addSlide({ masterName: "MASTER_DARK" });
slide5.addText("Technologies & Skills Used", { x: 0.5, y: 0.5, fontSize: 36, bold: true, color: TEXT_H });
slide5.addShape(pptx.ShapeType.rect, { x: 0.5, y: 1.5, w: 2.5, h: 1.2, fill: { color: "1e293b" } });
slide5.addText("React + Vite", { x: 0.5, y: 1.5, w: 2.5, h: 1.2, fontSize: 24, bold: true, color: ACCENT, align: "center" });
slide5.addShape(pptx.ShapeType.rect, { x: 3.5, y: 1.5, w: 2.5, h: 1.2, fill: { color: "1e293b" } });
slide5.addText("Firebase Cloud", { x: 3.5, y: 1.5, w: 2.5, h: 1.2, fontSize: 20, bold: true, color: ACCENT2, align: "center" });
slide5.addShape(pptx.ShapeType.rect, { x: 6.5, y: 1.5, w: 2.5, h: 1.2, fill: { color: "1e293b" } });
slide5.addText("Tesseract.js (OCR)", { x: 6.5, y: 1.5, w: 2.5, h: 1.2, fontSize: 20, bold: true, color: "38bdf8", align: "center" });
slide5.addShape(pptx.ShapeType.rect, { x: 2.0, y: 3.2, w: 2.5, h: 1.2, fill: { color: "1e293b" } });
slide5.addText("EmailJS Crypto", { x: 2.0, y: 3.2, w: 2.5, h: 1.2, fontSize: 20, bold: true, color: "fbbf24", align: "center" });
slide5.addShape(pptx.ShapeType.rect, { x: 5.0, y: 3.2, w: 2.5, h: 1.2, fill: { color: "1e293b" } });
slide5.addText("Vercel Edge API", { x: 5.0, y: 3.2, w: 2.5, h: 1.2, fontSize: 20, bold: true, color: "ffffff", align: "center" });

// 6. Checkout Funnel & AI
let slide6 = pptx.addSlide({ masterName: "MASTER_DARK" });
slide6.addText("The Checkout Funnel & AI Validation", { x: 0.5, y: 0.5, fontSize: 36, bold: true, color: TEXT_H });
slide6.addShape(pptx.ShapeType.rect, { x: 0.5, y: 1.5, w: 8.5, h: 0.8, fill: { color: ACCENT } });
slide6.addText("Step 1: Document Upload directly to Client-Side AI Engine", { x: 0.5, y: 1.5, w: 8.5, h: 0.8, fontSize: 22, color: "ffffff", align: "center", bold: true });
slide6.addShape(pptx.ShapeType.rect, { x: 0.5, y: 2.5, w: 8.5, h: 0.8, fill: { color: "1e293b" } });
slide6.addText("Step 2: Neural Net vector matching processes within browser sandbox.", { x: 0.5, y: 2.5, w: 8.5, h: 0.8, fontSize: 20, color: TEXT_H, align: "center" });
slide6.addShape(pptx.ShapeType.rect, { x: 0.5, y: 3.5, w: 8.5, h: 0.8, fill: { color: ACCENT2 } });
slide6.addText("Step 3: Secure TLS dispatch of cryptographic OTP via EmailJS", { x: 0.5, y: 3.5, w: 8.5, h: 0.8, fontSize: 22, color: "ffffff", align: "center", bold: true });

// 7. Cloud
let slide7 = pptx.addSlide({ masterName: "MASTER_DARK" });
slide7.addText("Multi-Tenant Cloud Architecture", { x: 0.5, y: 0.5, fontSize: 36, bold: true, color: TEXT_H });
slide7.addText([
  { text: "Serverless Live Database:", options: { bold: true, color: ACCENT2 } },
  { text: "Highly scalable NoSQL layer mapping real-time hardware data.", options: { indentLevel: 1 } },
  { text: "Live WebSocket Tunnels:", options: { bold: true, color: ACCENT2 } },
  { text: "onSnapshot listeners guarantee sub-second visual updates across devices.", options: { indentLevel: 1 } },
  { text: "JWT Auth Matrix:", options: { bold: true, color: ACCENT2 } },
  { text: "Strict Firestore Security Rules protect enterprise component isolation.", options: { indentLevel: 1 } }
], { x: 0.5, y: 1.5, w: "90%", fontSize: 22, color: TEXT_P, bullet: { color: ACCENT }, lineSpacing: 30 });

// 8. Command Center
let slide8 = pptx.addSlide({ masterName: "MASTER_DARK" });
slide8.addText("The Executive Command Center", { x: 0.5, y: 0.5, fontSize: 36, bold: true, color: TEXT_H });
slide8.addShape(pptx.ShapeType.rect, { x: 0.5, y: 1.5, w: 4, h: 3.5, fill: { color: "1e293b" } });
slide8.addText("Admin Operations Portal\n\n• Live Telemetry Stream\n• Identity Verification Queue\n• Gross Processed Revenue\n• Authentic User Count\n• 1-Click CSV Log Export", { x: 0.8, y: 1.8, w: 3.5, h: 2.9, fontSize: 20, color: TEXT_P, align: "left" });
slide8.addShape(pptx.ShapeType.rect, { x: 5, y: 1.5, w: 4, h: 3.5, fill: { color: "1e293b" } });
slide8.addText("Why It Matters:\n\nExecutives have a real-time birds-eye view completely untethered from legacy VPN, tracking exact hardware locations securely.", { x: 5.3, y: 1.8, w: 3.5, h: 2.9, fontSize: 20, color: ACCENT, align: "left", bold: true });

// 9. Live Demo
let slide9 = pptx.addSlide({ masterName: "MASTER_DARK" });
slide9.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: '100%', fill: { color: ACCENT } });
slide9.addText("LIVE DEMONSTRATION", { x: 0.5, y: 2, w: "90%", fontSize: 55, bold: true, color: "ffffff", align: "center", fontFace: "Segoe UI" });
slide9.addText("Scanning the Edge. Stand by.", { x: 0.5, y: 3.5, w: "90%", fontSize: 24, color: "e0e7ff", align: "center" });

// 10. Future
let slide10 = pptx.addSlide({ masterName: "MASTER_DARK" });
slide10.addText("Future Roadmap", { x: 0.5, y: 0.5, fontSize: 36, bold: true, color: TEXT_H });
slide10.addShape(pptx.ShapeType.rect, { x: 0.5, y: 1.6, w: 8.5, h: 0.9, fill: { color: "1e293b" } });
slide10.addShape(pptx.ShapeType.rect, { x: 0.5, y: 2.8, w: 8.5, h: 0.9, fill: { color: "1e293b" } });
slide10.addShape(pptx.ShapeType.rect, { x: 0.5, y: 4.0, w: 8.5, h: 0.9, fill: { color: "1e293b" } });
slide10.addText("B2B Fleet Subscriptions (100+ hardware nodes per query)", { x: 0.8, y: 1.6, w: 8, h: 0.9, fontSize: 20, color: TEXT_P });
slide10.addText("Native Stripe API & Webhook Integration for Subscriptions", { x: 0.8, y: 2.8, w: 8, h: 0.9, fontSize: 20, color: TEXT_P });
slide10.addText("Physical Courier / Drone Dispatch Hardware Pipelines", { x: 0.8, y: 4.0, w: 8, h: 0.9, fontSize: 20, color: TEXT_P });

// 11. Q&A
let slide11 = pptx.addSlide({ masterName: "MASTER_DARK" });
slide11.addShape(pptx.ShapeType.rect, { x: 0, y: 2, w: '100%', h: 1.5, fill: { color: "1e293b" } });
slide11.addText("Thank You.", { x: 0.5, y: 2.1, w: "90%", fontSize: 48, bold: true, color: TEXT_H, align: "center" });
slide11.addText("Floor is open for Questions.", { x: 0.5, y: 2.8, w: "90%", fontSize: 24, color: ACCENT, align: "center" });

pptx.writeFile({ fileName: "AstraRent_HighEnd_Presentation.pptx" }).then(fileName => {
    console.log(`created file: ${fileName}`);
});
