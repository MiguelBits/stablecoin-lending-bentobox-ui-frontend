import GeneralLayout from 'components/layouts/GeneralLayout';

export const metadata = {
  title: 'Seneca',
  description: 'Seneca is DeFi made stable',
};

export default function PasswordProtectRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <GeneralLayout>{children}</GeneralLayout>;
}
