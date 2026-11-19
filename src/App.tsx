/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { ExperienceShowcase } from './components/ExperienceShowcase';
import { Footer } from './components/Footer';
import { GallerySection } from './components/GallerySection';
import { HeroSection } from './components/HeroSection';
import { InquiryPlanner } from './components/InquiryPlanner';
import { Navbar } from './components/Navbar';
import { TreksCatalog } from './components/TreksCatalog';
import { TREK_PACKAGES } from './data/treksData';

export default function App() {
  const [preselectedTrekId, setPreselectedTrekId] = useState(TREK_PACKAGES[0].id);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleReserveTrek = (trekId: string) => {
    setPreselectedTrekId(trekId);
    scrollToSection('plan-trek');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F7F5] text-[#111814]">
      <Navbar onPlanTrekClick={() => scrollToSection('plan-trek')} />

      <main className="flex-1">
        <HeroSection onExploreTreks={() => scrollToSection('treks')} />

        <TreksCatalog onReserveTrek={handleReserveTrek} />

        <ExperienceShowcase />

        <GallerySection />

        <InquiryPlanner preselectedTrekId={preselectedTrekId} />
      </main>

      <Footer />
    </div>
  );
}
