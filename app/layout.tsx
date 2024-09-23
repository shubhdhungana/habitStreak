// app/layout.tsx
import './globals.css';

export const metadata = {
  title: 'My Next.js App',
  description: 'Welcome to my app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
