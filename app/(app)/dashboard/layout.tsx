export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="bg-[#efeff7] min-h-screen">{children}</div>;
}
