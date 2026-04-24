import { auth } from "@/lib/auth";
import { isSuperAdminEmail } from "@/lib/super-admin";
import { AdminSidebar, AdminMobileHeader } from "./AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const isSuperAdmin = isSuperAdminEmail(session?.user?.email);

  return (
    <div className="flex h-screen bg-cream">
      <AdminSidebar isSuperAdmin={isSuperAdmin} />

      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminMobileHeader isSuperAdmin={isSuperAdmin} />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto p-4 md:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
