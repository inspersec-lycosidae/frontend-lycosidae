'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { LayoutDashboard, Trophy, BarChart3, LogOut, User as UserIcon, ShieldAlert } from 'lucide-react';
import Logo from './ui/Logo';
import GradientDivider from './ui/GradientDivider';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Competições', href: '/competitions', icon: Trophy },
  { name: 'Scoreboard', href: '/scoreboard', icon: BarChart3 },
  { name: 'Perfil', href: '/profile', icon: UserIcon },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="w-64 bg-neutral-900 border-r border-neutral-800 flex flex-col h-screen fixed left-0 top-0 z-50">
      <div className="p-6 flex justify-center items-center">
        <Logo size="md" />
      </div>
      <GradientDivider />

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <p className="px-4 text-[10px] font-bold text-neutral-600 uppercase tracking-widest mb-4">Principal</p>
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${isActive
                  ? 'bg-red-600/10 text-red-500 border border-red-900/50'
                  : 'text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200'
                }`}
            >
              <item.icon size={18} />
              {item.name}
            </Link>
          );
        })}

        {user?.is_admin && (
          <div className="pt-4 mt-4 border-t border-neutral-800">
            <p className="px-4 text-[10px] font-bold text-neutral-600 uppercase tracking-widest mb-2">Admin</p>
            <Link
              href="/admin"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${pathname.startsWith('/admin')
                  ? 'bg-red-600/10 text-red-500 border border-red-900/50'
                  : 'text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200'
                }`}
            >
              <ShieldAlert size={18} />
              Painel Geral
            </Link>
          </div>
        )}
      </nav>

      <div className="p-4 bg-neutral-900/50">
        <GradientDivider className="mb-4" />
        <div className="bg-neutral-950 rounded-xl p-3 flex items-center gap-3 border border-neutral-800">
          <div className="h-9 w-9 rounded-full bg-red-900/20 border border-red-900/40 flex items-center justify-center text-red-500">
            <UserIcon size={18} />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-bold text-white truncate">{user?.username || 'Operador'}</p>
            <p className="text-[9px] text-neutral-500 uppercase font-mono">{user?.is_admin ? 'ADMIN' : 'USER'}</p>
          </div>
          <button onClick={logout} className="text-neutral-500 hover:text-red-500 transition-colors p-1">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}