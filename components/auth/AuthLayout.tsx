'use client';
import Logo from '../ui/Logo';

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  maxWidth?: string;
}

export default function AuthLayout({ children, title, subtitle, maxWidth = "max-w-md" }: AuthLayoutProps) {
  const hasHeaderContent = title || subtitle;

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4 py-12 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-red-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className={`w-full ${maxWidth} bg-neutral-900/80 backdrop-blur-md rounded-xl border border-neutral-800 shadow-2xl shadow-red-900/10 p-8 relative z-10 transition-all duration-300`}>
        <div className={`flex flex-col items-center text-center ${hasHeaderContent ? 'mb-6' : 'mb-8'}`}>
          <Logo size="lg" />
        </div>
        {hasHeaderContent && (
          <div className="text-center mb-8 animate-in fade-in slide-in-from-top-2">
            {title && <h2 className="text-2xl font-bold text-white tracking-tight">{title}</h2>}
            {subtitle && <p className="text-neutral-400 text-sm mt-1">{subtitle}</p>}
          </div>
        )}
        <div>
          {children}
        </div>
      </div>
    </div>
  );
}