import type { Metadata } from "next";
import { EditorGate } from "@/components/editor-gate";
import { AdminApp } from "@/components/admin/admin-app";

export const metadata: Metadata = { title: "Quản trị · Tỉnh Lướt", robots: { index: false, follow: false } };

export default function AdminPage() {
  return (
    <EditorGate title="Quản trị nội dung">
      <AdminApp />
    </EditorGate>
  );
}
