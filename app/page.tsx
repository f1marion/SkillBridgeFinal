"use client";

import dynamic from "next/dynamic";

// Import your main SkillBridge UI
const SkillBridgeApp = dynamic(
  () => import("../Components/SkillBridgeApp"), // <-- matches components/skillBridgeApp.js
  { ssr: false }
);

export default function Home() {
  return (
    <main>
      <SkillBridgeApp />
    </main>
  );
}
