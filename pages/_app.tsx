import "../styles/globals.scss";
import type { AppProps } from "next/app";
import Head from "next/head";

// Store
import { store } from "../fetchConfig/store";
import { Provider } from "react-redux";

import Layout from "../components/Layout/Layout";
import RouteLoading from "../components/Loaders/RouteLoading";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Head>
        <title>Michael Akinola | Home</title>
        <meta
          name="description"
          content="Michael Akinola is  a data scientist, currently deploying advanced data analytics techniques and machine learning algorithms to build predictive models for real world applications"
        />
        <link rel="icon" href="/images/logo.webp" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <RouteLoading />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  );
}
