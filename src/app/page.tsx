import { LandingBeacon } from "@/components/attribution";
import { Hero } from "@/components/landing/hero";
import { Audience, Doctors, Evidence, Faq, HowItWorks, Plan, Privacy } from "@/components/landing/sections";
import { WaitlistSection } from "@/components/landing/waitlist-section";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";

export default function Home() {
  return (
    <>
      <LandingBeacon />
      <SiteHeader nav />
      <main id="contenido">
        <Hero />
        <Evidence />
        <HowItWorks />
        <Plan />
        <Audience />
        <Privacy />
        <WaitlistSection />
        <Faq />
        <Doctors />
      </main>
      <SiteFooter sources />
    </>
  );
}
