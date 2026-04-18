export const metadata = {
  title: 'Banger',
  description: 'AI-powered meme replies for X.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
