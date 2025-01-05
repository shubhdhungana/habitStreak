// app/layout.tsx

import "./globals.css";
/* yo line le global CSS import garcha, jun styling sabai components ma apply huncha. */

export const metadata = {
  title: "My Next.js App",
  description: "Welcome to my app",
};
/* metadata le app ko title ra description define garcha, 
   jun SEO ra browser tab ma display garna kaam lagcha. */

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  /* RootLayout component le HTML structure ko root layer define garcha. 
     children le layout bhitra aune components lai render garcha. */

  return (
    <html lang="en">
      {/* yo line le HTML ko language attribute set garcha, SEO ra accessibility ma helpful. */}
      <body>{children}</body>
      {/* body element le layout ko content display garcha. */}
    </html>
  );
}
