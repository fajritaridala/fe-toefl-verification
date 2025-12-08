import type { Metadata } from "next";
import DashboardLayout from "@/components/layouts/Dashboard";
import AdminDashboardPage from "@features/admin/Dashboard";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard admin",
};

export default function Dashboard() {
  return (
    <DashboardLayout title="dashboard" description="Dashboard admin">
      <AdminDashboardPage />
    </DashboardLayout>
  );
}
