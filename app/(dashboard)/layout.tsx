'use client';
import Sidebar from '@/components/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 selection:bg-red-600/30">
      {/* Background Decorativo Global */}
      <div className="fixed top-0 right-0 w-50 h-50 bg-red-900/5 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-0 left-64 w-25 h-25 bg-red-900/5 rounded-full blur-[100px] pointer-events-none z-0" />

      <Sidebar />

      <main className="pl-64 min-h-screen relative z-10">
        <div className="p-8 lg:p-12 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}