import type { Metadata } from "next";
import { CallToAction } from "@/components/marketing/call-to-action";
import { Faq } from "@/components/marketing/faq";
import { Features } from "@/components/marketing/features";
import { Hero } from "@/components/marketing/hero";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { Showcase } from "@/components/marketing/showcase";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { Sources } from "@/components/marketing/sources";

export const metadata: Metadata = {
  title: { absolute: "Brief: every story that matters, summarised" },
  description:
    "Brief reads 60+ trusted news feeds every hour, groups each story across outlets and condenses it into a three-sentence summary.",
  openGraph: {
    title: "Brief: every story that matters, summarised",
    description: "Catch up on world, India, business, tech, sports, cricket and Bangla news in minutes.",
    type: "website",
  },
};

export default function LandingPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <Sources />
        <Features />
        <HowItWorks />
        <Showcase />
        <Faq />
        <CallToAction />
      </main>
      <SiteFooter />
    </>
  );
}
