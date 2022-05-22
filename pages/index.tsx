
import styles from "../styles/Home.module.scss";
import { useEffect, useState } from "react";
import { createClient } from "microcms-js-sdk";
import ReactModal from "react-modal";
import * as React from "react";
import { ParsedUrlQuery } from "querystring";
import { GetStaticProps } from "next";
import ContactForm from "./components/contact-form";
import Footer from "./components/footer";
import Header from "./components/header";

import { Illustration, News, Work, WorkWithoutVideo } from "../models";
import CustomHead from "./CustomHead";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkHtml from "remark-html";
import About from "../static-components/about";
import WorksSection from "../static-components/works";
import IllustrationsSection from "../static-components/illustrations";
import NewsSection from "../static-components/news";

interface Params extends ParsedUrlQuery {}

type Props = {
  profile: string;
  works: Work[];
  worksWithoutVideo: WorkWithoutVideo[];
  news: News[];
  illustrations: Illustration[];
};

export const getStaticProps: GetStaticProps<Props, Params> = async (_) => {
  const client = createClient({
    serviceDomain: "konatsuruka",
    apiKey: process.env.NEXT_PUBLIC_MICRO_CMS_API_KEY || "",
  });
  const allWorks = (await client.get<{ contents: Work[] }>({ endpoint: "works?limit=100" }))
    .contents;
  const works = allWorks.filter((work) => work.youtubeId.length > 0);
  const worksWithoutVideo = allWorks.filter((work) => work.youtubeId.length === 0);
  const newsContents = (await client.get<{ contents: News[] }>({ endpoint: "news?limit=100" }))
    .contents;
  const profile =  String(await unified()
    .use(remarkParse)
    .use(remarkHtml)
    .process(newsContents[newsContents.length-1].content));

  const news = newsContents.slice(0, newsContents.length - 1);
  const illustrations = (
    await client.get<{ contents: Illustration[] }>({ endpoint: "illusts?limit=100" })
  ).contents;

  return {
    props: {
      profile,
      works,
      worksWithoutVideo,
      news,
      illustrations,
    },
  };
};

ReactModal.setAppElement("#__next");

const Home = ({ profile, works, worksWithoutVideo, news, illustrations }: Props) => {
  useEffect(() => {
    const animate = async () => {
      const sr = (await import("scrollreveal")).default();
      sr.reveal(".works-image-0", { reset: true, delay: 0 });
      sr.reveal(".works-image-1", { reset: true, delay: 100 });
      sr.reveal(".works-image-2", { reset: true, delay: 200 });
      sr.reveal(".works-image-3", { reset: true, delay: 300 });
      sr.reveal(".works-without-video-left", {
        reset: true,
        origin: "left",
        delay: 100,
        distance: "100%"
      }),
      sr.reveal(".works-without-video-right", {
        reset: true,
        origin: "right",
        delay: 100,
        distance: "100%"
      }),
      sr.reveal(".illustration-image", { reset: true });
      sr.reveal(".left-about", {
        reset: true,
        opacity: 1,
        origin: "left",
        delay: 400,
        distance: "50%",
      });
      sr.reveal(".right-about", {
        reset: true,
        opacity: 1,
        origin: "right",
        delay: 400,
        distance: "50%",
      });
    };
    animate().catch((error) => console.warn(error));
  }, []);

  return (
    <div id="container">
      <CustomHead
          title={"粉鶴亀のポートフォリオサイト"}
          description={"アニメーター粉鶴亀（こなつるか）のポートフォリオサイトです。関わったアニメ作品へのリンクやイラストなどが含まれています。このサイトから仕事の依頼をすることもできます。"}
          author={"tannakaken"}
          keyword={"アニメ,animation,MV,イラスト,illustration,マンガ,manga"}
          url={"https://www.konatsuruka.online"}
          image={"https:///www.konatsuruka.online/header.png"}
      />
      <Header />
      <main className={styles.main}>
        <div className={styles.mainHeader}>
          <div className={styles.mainHeaderPhone}>
            <div className={styles.mainHeaderPhoneClip}>
              <img src="./header.png" alt="" />
            </div>
          </div>
        </div>
        <NewsSection news={news} />
        <About profile={profile} />
        <WorksSection works={works} worksWithoutVideo={worksWithoutVideo} />
        <IllustrationsSection illustrations={illustrations} />
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
