import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mohd. Misfar — Video Editor, UI/UX & Frontend Engineer",
  description: "Portfolio of Mohd. Misfar — Video Editor, Colorist, UI/UX Designer & Frontend Engineer based in Kerala, India.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <body className="min-h-full flex flex-col bg-[#060606] text-white selection:bg-white selection:text-black">
        {children}
      </body>
    </html>
  );
}

