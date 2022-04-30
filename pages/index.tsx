import styles from "../styles/Home.module.scss";
import { useEffect, useState } from "react";
import { createClient } from "microcms-js-sdk";
import YouTube from "react-youtube";
import youTubeStyles from "../styles/YouTube.module.scss";
import "../styles/YouTube.module.scss";
import ReactModal from "react-modal";
import * as React from "react";
import { ParsedUrlQuery } from "querystring";
import { GetStaticProps } from "next";
import ContactForm from "./components/contact-form";
import Footer from "./components/footer";
import Header from "./components/header";
import About from "./components/about";
import { Illustration, News, Work } from "../models";
import CustomHead from "./CustomHead";
import { useScroll, useWindowSize } from "../helpers/window.helpers";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkHtml from "remark-html";
import WorksSection from "./components/works";
import IllustrationsSection from "./components/illustrations";
import NewsSection from "./components/news";

interface Params extends ParsedUrlQuery {}

type Props = {
  profile: string;
  works: Work[];
  news: News[];
  illustrations: Illustration[];
};

export const getStaticProps: GetStaticProps<Props, Params> = async (_) => {
  const client = createClient({
    serviceDomain: "konatsuruka",
    apiKey: process.env.NEXT_PUBLIC_MICRO_CMS_API_KEY || "",
  });
  const works = (await client.get<{ contents: Work[] }>({ endpoint: "works" }))
    .contents;
  const newsContents = (await client.get<{ contents: News[] }>({ endpoint: "news" }))
    .contents;
  const profile =  String(await unified()
    .use(remarkParse)
    .use(remarkHtml)
    .process(newsContents[newsContents.length-1].content));

  const news = newsContents.slice(0, newsContents.length - 1);
  const illustrations = (
    await client.get<{ contents: Illustration[] }>({ endpoint: "illusts" })
  ).contents;

  return {
    props: {
      profile,
      works,
      news,
      illustrations,
    },
  };
};

ReactModal.setAppElement("#__next");

const headerWidth = 1500;
const headerHeight = 682;

const Home = ({ profile, works, news, illustrations }: Props) => {
  const windowSize = useWindowSize();
  const realHeaderHeight = windowSize.width / headerWidth * headerHeight;
  const [selectedNews, setSelectedNews] = useState<News | undefined>(undefined);
  const isNewsModalOpen = selectedNews !== undefined;

  useEffect(() => {
    const animate = async () => {
      const sr = (await import("scrollreveal")).default();
      sr.reveal(".works-image", { reset: true });
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
  const scroll = useScroll();

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
        <WorksSection works={works} />
        <IllustrationsSection illustrations={illustrations} />
        <ContactForm />
      </main>
      <Footer />

    </div>
  );
};

export default Home;
