import { TerminalHero } from "@/components/TerminalHero";
import { TrainingSection } from "@/components/TrainingSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { BlogSection } from "@/components/BlogSection";
import { ShopSection } from "@/components/ShopSection";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <>
      <TerminalHero />
      <div id="training-section">
        <TrainingSection />
      </div>
      <div id="projects-section">
        <ProjectsSection />
      </div>
      <div id="blog-section">
        <BlogSection />
      </div>
      <div id="shop-section">
        <ShopSection />
      </div>
    </>
  );
}
