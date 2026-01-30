'use client';
import Link from 'next/link';
import { LucideIcon, ArrowRight } from 'lucide-react';

interface AdminCardProps {
  title: string;
  desc: string;
  href: string;
  icon: LucideIcon;
  tag: string;
}

export default function AdminCard({ title, desc, href, icon: Icon, tag }: AdminCardProps) {
  return (
    <Link
      href={href}
      className="group bg-neutral-900/50 border border-neutral-800 p-6 rounded-xl hover:border-red-600/50 hover:bg-neutral-900 transition-all duration-300 relative overflow-hidden"
    >
      <div className="flex justify-between items-start mb-6">
        <div className="p-3 bg-red-900/10 text-red-500 rounded-lg group-hover:bg-red-600 group-hover:text-white transition-all shadow-lg">
          <Icon size={22} />
        </div>
        <span className="text-[9px] font-mono text-neutral-700 font-bold group-hover:text-red-900 transition-colors uppercase tracking-widest">
          {tag}
        </span>
      </div>

      <h3 className="text-lg font-black text-white mb-2 uppercase tracking-tight group-hover:text-red-500 transition-colors">
        {title}
      </h3>
      <p className="text-neutral-500 text-xs leading-relaxed">
        {desc}
      </p>

      <div className="mt-6 pt-4 border-t border-neutral-800 flex justify-end">
        <ArrowRight size={16} className="text-neutral-700 group-hover:text-red-600 transition-all group-hover:translate-x-1" />
      </div>
    </Link>
  );
}