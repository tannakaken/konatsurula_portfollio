import * as React from "react";
import Head from "next/head";
import Script from "next/script";

interface Props {
  title: string;
  author: string;
  description: string;
  keyword: string;
  image: string;
  domain: string;
  url: string;
}

const CustomHead = ({
  title,
  description,
  keyword,
  image,
  domain,
  url,
}: Props): JSX.Element => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta name="keywords" content={keyword} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={image} />
        <meta property="og:site_name" content={title} />
        <meta property="og:locale" content="ja_JP" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@sashimi0404" />
        <meta name="twitter:creator" content="@tannakaken" />
        <meta name="twitter:domain" content={domain} />
        <meta name="twitter:url" content={url} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
        <link rel="canonical" href={url} />
        <link rel="icon" href={"https://www.konatsuruka.online/favicon.ico"} />
        <link
          rel="shortcut icon"
          href={"https://www.konatsuruka.online/favicon.ico"}
        />
        <link
          rel="apple-touch-icon"
          href={"https://www.konatsuruka.online/favicon.png"}
        />
      </Head>
      {process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID && (
        <>
          <Script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID}`}
          ></Script>
          <Script
            id="google-analytics-inline-script"
            dangerouslySetInnerHTML={{
              __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID}');
      `,
            }}
          />
        </>
      )}
    </>
  );
};

export default CustomHead;
