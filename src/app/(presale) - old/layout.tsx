import DashboardLayout from 'components/layouts/DashboardLayout';

export const metadata = {
  title: 'Seneca',
  description: 'Seneca is DeFi made stable',
};

export default function PresaleRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
