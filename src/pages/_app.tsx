import Providers from "@/components/Providers";
import "@/styles/globals.css";
import { Toaster } from "react-hot-toast";

export default function App({ Component, pageProps }: any): JSX.Element {
  return (
    <Providers>
      <Component {...pageProps} />
      <Toaster />
    </Providers>
  );
}
