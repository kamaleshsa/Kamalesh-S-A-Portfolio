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
    </main>
  );
}
