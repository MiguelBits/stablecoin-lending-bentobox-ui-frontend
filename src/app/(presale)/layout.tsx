import GeneralLayout from '@/components/layouts/GeneralLayout';

// import DashboardLayout from 'components/layouts/DashboardLayout';

export const metadata = {
  title: 'Seneca',
  description: 'Seneca is DeFi made stable',
};

export default function PresaleRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <GeneralLayout>{children}</GeneralLayout>;
}
