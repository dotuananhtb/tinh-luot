import type { Metadata } from "next";
import { ContentProvider } from "@/components/content-provider";
import { VoteApp } from "@/components/live/vote-app";

export const metadata: Metadata = { title: "Bỏ phiếu · Tỉnh Lướt" };

export default function VotePage() {
  return (
    <ContentProvider>
      <VoteApp />
    </ContentProvider>
  );
}
