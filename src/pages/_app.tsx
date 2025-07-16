import type { AppProps } from "next/app";

// import UnsupportedMobileMessage from "@/components/unsopprtedDevice";

// import "@/styles/global.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div>
      <Component {...pageProps} />
    </div>
  );
}
