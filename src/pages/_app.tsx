import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import { AuthProvider } from "../contexts/AuthContext";
import { ThemeProvider } from "../contexts/ThemeContext";
import Head from "next/head";
import "../styles/globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Head>
          <link
            href="https://fonts.googleapis.com/icon?family=Material+Icons"
            rel="stylesheet"
          />
        </Head>
        <div className={`${inter.variable} font-sans`}>
          <Component {...pageProps} />
        </div>
      </ThemeProvider>
    </AuthProvider>
  );
}
