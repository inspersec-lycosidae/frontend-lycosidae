'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { LayoutDashboard, Trophy, Sword, BarChart3, LogOut, User as UserIcon, ShieldAlert } from 'lucide-react'; // Adicione ShieldAlert

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Competições', href: '/competitions', icon: Trophy },
  // { name: 'Arena (Exercícios)', href: '/exercises', icon: Sword },
  { name: 'Scoreboard', href: '/scoreboard', icon: BarChart3 },
  { name: 'Perfil', href: '/profile', icon: UserIcon },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="w-64 bg-neutral-900 border-r border-neutral-800 flex flex-col h-screen fixed left-0 top-0 z-50">
      {/* Logo */}
      <div className="p-6 border-b border-neutral-800">
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <span className="text-red-600 text-3xl">⸎</span> Lycosidae
        </h1>
        <p className="text-xs text-neutral-500 mt-1 uppercase tracking-widest">CTF Platform</p>
      </div>

      {/* Navegação */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
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
              <item.icon size={20} />
              {item.name}
            </Link>
          );
        })}

        {/* SEÇÃO ADMIN - Só renderiza se for admin */}
        {user?.is_admin && (
          <div className="pt-4 mt-4 border-t border-neutral-800">
            <p className="px-4 text-[10px] font-bold text-neutral-600 uppercase tracking-widest mb-2">Administração</p>
            <Link
              href="/admin"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${pathname.startsWith('/admin')
                  ? 'bg-red-600/10 text-red-500 border border-red-900/50'
                  : 'text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200'
                }`}
            >
              <ShieldAlert size={20} />
              Painel Admin
            </Link>
          </div>
        )}
      </nav>

      {/* Footer do Usuário (igual ao anterior) */}
      <div className="p-4 border-t border-neutral-800">
        <div className="bg-neutral-950 rounded-xl p-3 flex items-center gap-3 border border-neutral-800">
          <div className="h-10 w-10 rounded-full bg-red-900/30 flex items-center justify-center text-red-500">
            <UserIcon size={20} />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-bold text-white truncate">{user?.username || '...'}</p>
            <p className="text-[10px] text-neutral-500 uppercase">{user?.is_admin ? 'Administrador' : 'Aluno'}</p>
          </div>
          <button onClick={logout} className="text-neutral-500 hover:text-red-500 transition-colors" title="Sair">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
}