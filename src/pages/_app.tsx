import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import { AuthProvider } from "../contexts/AuthContext";
import "../styles/globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <div className={`${inter.variable} font-sans`}>
        <Component {...pageProps} />
      </div>
    </AuthProvider>
  );
}
