import Navbar from './components/Navbar.tsx';
import Hero from './components/Hero.tsx';
import KineticMarquee from './components/KineticMarquee.tsx';
import SpatialTunnel from './components/SpatialTunnel.tsx';
import CaseStudies from './components/CaseStudies.tsx';
import AgencyShowcase from './components/AgencyShowcase.tsx';
import BriefModule from './components/BriefModule.tsx';
import CommandPalette from './components/CommandPalette.tsx';
import Footer from './components/Footer.tsx';
import CustomCursor from './components/CustomCursor.tsx';
import { useLenisGsap } from './hooks/useLenisGsap.ts';

export default function App() {
  // Initialize Lenis + GSAP Ticker Synchronization with lagSmoothing(0) & A11y checks
  const telemetry = useLenisGsap();

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#e2e8f0] flex flex-col selection:bg-white selection:text-black">
      {/* Awwwards Custom Magnetic Spring Physics Cursor (Desktop fine-pointer only) */}
      <CustomCursor />

      {/* FAZ 1: SLISS (AI Core & Linear-Style Command Palette) */}
      <CommandPalette onNavigate={scrollToSection} />

      {/* 3-Zone Strict Top Bar Contract */}
      <Navbar onNavigate={scrollToSection} />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* 1. Hero & Typographic Editorial Manifesto */}
        <Hero onNavigate={scrollToSection} />

        {/* 2. Velocity-Responsive Kinetic Typography Marquee */}
        <KineticMarquee />

        {/* 3. Agency Background & Open-Source Repositories */}
        <AgencyShowcase />

        {/* 4. FAZ 2: 3D Z-Axis Uzay Portalı (Spatial Tunnel Navigation) */}
        <SpatialTunnel />

        {/* 5. Selected Works: GSAP ScrollTrigger Horizontal Pinning */}
        <CaseStudies />

        {/* 6. Cyber-Tactile Technical Brief Engine */}
        <div data-cursor="INITIATE">
          <BriefModule />
        </div>
      </main>

      {/* Footer */}
      <Footer onNavigate={scrollToSection} />
    </div>
  );
}
