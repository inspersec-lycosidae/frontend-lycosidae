'use client';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: 'primary' | 'secondary';
}

export default function Button({ children, loading, variant = 'primary', ...props }: ButtonProps) {
  const baseStyles = "w-full font-bold py-3 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white shadow-red-900/30",
    secondary: "bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700"
  };

  return (
    <button {...props} className={`${baseStyles} ${variants[variant]}`}>
      {loading ? 'Processando...' : children}
    </button>
  );
}