import DashboardLayout from 'components/layouts/DashboardLayout';

export const metadata = {
  title: 'Seneca | App',
  description: 'Seneca is DeFi made stable',
};

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout isDashboard>{children}</DashboardLayout>;
}
