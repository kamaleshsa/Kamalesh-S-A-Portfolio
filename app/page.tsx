
import IdentityScroll from "@/components/IdentityScroll";
import { ContentSections } from "@/components/ContentSections";

export default function Home() {
  return (
    <main className="bg-[#0a0a0a] min-h-screen text-white">
      <IdentityScroll />
      <ContentSections />
    </main>
  );
}
