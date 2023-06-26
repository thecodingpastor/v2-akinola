import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
        <div id="Modal"></div>
        <div id="Backdrop"></div>
        <div id="Toast"></div>
      </body>
    </Html>
  );
}
