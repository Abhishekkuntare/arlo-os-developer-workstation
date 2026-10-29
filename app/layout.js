import Script from "next/script";
import { readFileSync } from "node:fs";
import path from "node:path";
import "../styles.css";
import "../showcase.css";

const mediaManifest = JSON.parse(
  readFileSync(path.join(process.cwd(), "public", "media-manifest.json"), "utf8")
);

export const metadata = {
  metadataBase: new URL("https://arloos.vercel.app/"),
  title: "ARLO OS — Modern Windows Desktop",
  description:
    "Discover ARLO OS, a modern, customizable Windows desktop with built-in apps, developer tools and optional Ghost AI. macOS and Linux releases are coming soon.",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    siteName: "ARLO OS",
    title: "ARLO OS — Modern Windows Desktop",
    description:
      "A modern, customizable Windows desktop with built-in apps, developer tools and optional Ghost AI. macOS and Linux releases are coming soon.",
    url: "/",
    images: [
      {
        url: "/images/Screenshot%20%28439%29.png",
        alt: "ARLO OS desktop environment and workspace"
      }
    ],
    locale: "en_IN"
  },
  twitter: {
    card: "summary_large_image",
    title: "ARLO OS — Modern Windows Desktop",
    description:
      "Discover the customizable ARLO OS desktop, built-in apps, developer tools and optional Ghost AI. macOS and Linux releases are coming soon.",
    images: ["/images/Screenshot%20%28439%29.png"]
  },
  icons: {
    icon: "/images/arlo-favicon.png",
    apple: "/images/arlo-favicon.png"
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#08090d" />
        <meta name="arlo-media-version" content={mediaManifest.version} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <Script
          src="https://unpkg.com/lenis@1.3.26/dist/lenis.min.js"
          strategy="afterInteractive"
        />
        <Script
          src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"
          strategy="afterInteractive"
        />
        <Script
          src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js"
          strategy="afterInteractive"
        />
        <Script src="/site/script.js" strategy="afterInteractive" />
        <Script src="/site/showcase.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
