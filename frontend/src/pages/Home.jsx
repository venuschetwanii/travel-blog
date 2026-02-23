import React from 'react';
import HeroSection from '../components/HeroSection';
import StatsBar from '../components/StatsBar';
import BlogListing from '../components/BlogListing';
import AuthorSection from '../components/AuthorSection';
import BudgetBattleSection from '../components/BudgetBattleSection';
import CardFanSection from '../components/CardFanSection';

export default function Home() {
  return (
    <main className="home-page golden lumen-inspired">
      <HeroSection />
      <AuthorSection />
      <CardFanSection />
      <BlogListing />
      <BudgetBattleSection />
      <StatsBar />
    </main>
  );
}
