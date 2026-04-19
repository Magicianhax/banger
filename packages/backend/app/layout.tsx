import './globals.css';

export const metadata = {
  title: 'Banger — AI meme replies for X',
  description: 'AI-powered meme reply suggestions for X. Built on GIPHY.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
