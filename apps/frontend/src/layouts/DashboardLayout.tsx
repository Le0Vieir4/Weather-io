import { Outlet } from "react-router-dom";
import Header from "@/components/Header";

export function DashboardLayout() {
  return (
    <div className="min-h-screen relative">
      
      <Header />
      <main className="relative z-10">
        <Outlet />
      </main>
    </div>
  );
}
