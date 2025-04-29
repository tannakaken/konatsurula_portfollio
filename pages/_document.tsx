import { Html, Head, Main, NextScript } from "next/document";

/**
 * next.jsでlang="ja"を指定するための_document.tsx
 * @see https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#custom-document
 */
const Document = () => {
  return (
    <Html lang="ja">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default Document;
