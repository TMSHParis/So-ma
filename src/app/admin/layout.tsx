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
    <div className="flex h-[100dvh] bg-cream">
      <AdminSidebar isSuperAdmin={isSuperAdmin} />

      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        <AdminMobileHeader isSuperAdmin={isSuperAdmin} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="max-w-6xl mx-auto p-4 md:p-8 pb-[max(1rem,env(safe-area-inset-bottom))]">{children}</div>
        </main>
      </div>
    </div>
  );
}
