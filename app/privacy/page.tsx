import { readFileSync } from "fs";
import path from "path";
import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy — LM18 Construction",
  description: "Privacy Policy for the LM18 Construction Employee App.",
};

const content = readFileSync(path.join(process.cwd(), "content", "privacy.md"), "utf8");

export default function PrivacyPage() {
  return (
    <LegalPage
      content={content}
      title="Privacy Policy"
      subtitle="How LM18 Construction collects, uses, and protects your personal data."
      current="privacy"
    />
  );
}
