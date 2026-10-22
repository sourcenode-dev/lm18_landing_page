import { readFileSync } from "fs";
import path from "path";
import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service — LM18 Construction",
  description: "Terms of Service for the LM18 Construction Employee App.",
};

const content = readFileSync(path.join(process.cwd(), "content", "tos.md"), "utf8");

export default function TermsPage() {
  return (
    <LegalPage
      content={content}
      title="Terms of Service"
      subtitle="The rules for using the LM18 Construction Employee App."
      current="terms"
    />
  );
}
