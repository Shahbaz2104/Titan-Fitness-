import { AdminLayout } from "@/components/admin/admin-layout";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Admin Panel",
  noIndex: true,
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}
