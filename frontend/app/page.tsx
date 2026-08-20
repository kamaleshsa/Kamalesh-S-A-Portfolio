'use client';

import IdentityScroll from "@/components/IdentityScroll";
import { ContentSections } from "@/components/ContentSections";
import ChatWidget from "@/components/ChatWidget";
import LiveAnalytics from "@/components/LiveAnalytics";
import { useAnalytics } from "@/hooks/useAnalytics";

export default function Home() {
  // Track analytics
  useAnalytics();

  return (
    <main className="bg-[#0a0a0a] min-h-screen text-white">
      <IdentityScroll />
      <ContentSections />
      <LiveAnalytics />
      <ChatWidget />
      {/* Fixed looping video - bottom left, above all sections */}
      <video
        src="/corner-video.webm"
        autoPlay
        loop
        muted
        playsInline
        className="fixed bottom-4 -left-8 z-[9999] w-32 md:w-44 pointer-events-none"
      />
    </main>
  );
}
