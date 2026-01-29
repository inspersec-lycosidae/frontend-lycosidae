'use client';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: boolean;
}

export default function Input({ label, error, ...props }: InputProps) {
  return (
    <div className="space-y-1 w-full">
      <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider ml-1">
        {label}
      </label>
      <input
        {...props}
        className={`w-full bg-neutral-950 border text-neutral-200 rounded-lg p-3 focus:outline-none focus:ring-1 transition-all placeholder-neutral-700 ${error
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50'
            : 'border-neutral-800 focus:border-red-600 focus:ring-red-600/50'
          }`}
      />
    </div>
  );
}