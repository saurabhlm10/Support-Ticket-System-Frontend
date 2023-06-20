import { UserContext, UserContextProvider } from "@/context/UserContext";
import { store } from "@/redux/store";
import "@/styles/globals.css";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";

export default function App({ Component, pageProps }) {
  return (

    <UserContextProvider>
      <Provider store={store}>
        <Component {...pageProps} />
        <Toaster />
      </Provider>
    </UserContextProvider>
  );
}

