import Sidebar from '@/components/Sidebar';

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="min-h-screen bg-neutral-950 flex">
			<Sidebar />
			{/* Margem à esquerda igual à largura do sidebar */}
			<main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
				<div className="max-w-7xl mx-auto">
					{children}
				</div>
			</main>
		</div>
	);
}