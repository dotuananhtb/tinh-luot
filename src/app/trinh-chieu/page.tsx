import type { Metadata } from "next";
import { ContentProvider } from "@/components/content-provider";
import { EditorGate } from "@/components/editor-gate";
import { PresenterApp } from "@/components/live/presenter-app";

export const metadata: Metadata = { title: "Trình chiếu · Tỉnh Lướt", robots: { index: false, follow: false } };

export default function PresenterPage() {
  return (
    <EditorGate title="Trình chiếu">
      <ContentProvider>
        <PresenterApp />
      </ContentProvider>
    </EditorGate>
  );
}
