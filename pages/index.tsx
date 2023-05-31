import styles from "../styles/Home.module.scss";
import { useEffect } from "react";
import { createClient } from "microcms-js-sdk";
import ReactModal from "react-modal";
import * as React from "react";
import { ParsedUrlQuery } from "querystring";
import { GetStaticProps } from "next";
import ContactForm from "./components/contact-form";
import Footer from "./components/footer";
import Header from "./components/header";

import { Illustration, News, Work, WorkWithoutVideo } from "../models";
import CustomHead from "./components/CustomHead";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkHtml from "remark-html";
import About from "../static-components/about";
import WorksSection from "../static-components/works";
import IllustrationsSection from "../static-components/illustrations";
import NewsSection from "../static-components/news";
import { pageView } from "../helpers/ga.helper";

interface Params extends ParsedUrlQuery {}

type Props = {
  profile: string;
  works: Work[];
  skebWorks: Work[];
  worksWithoutVideo: WorkWithoutVideo[];
  news: News[];
  illustrations: Illustration[];
  illustrations3D: Illustration[];
};

export const getStaticProps: GetStaticProps<Props, Params> = async (_) => {
  const client = createClient({
    serviceDomain: "konatsuruka",
    apiKey: process.env.NEXT_PUBLIC_MICRO_CMS_API_KEY || "",
  });
  const allWorks = (
    await client.get<{ contents: Work[] }>({ endpoint: "works?limit=100" })
  ).contents;
  const worksWithVideo = allWorks.filter(
    (work) =>
      (work.youtubeId !== undefined && work.youtubeId.length > 0) ||
      work.gifImage !== undefined
  );
  const works = worksWithVideo.filter((work) => !work.isSkeb);
  const skebWorks = worksWithVideo.filter((work) => work.isSkeb);
  const worksWithoutVideo = allWorks.filter(
    (work) =>
      (work.youtubeId === undefined || work.youtubeId.length === 0) &&
      work.gifImage === undefined
  );
  const newsContents = (
    await client.get<{ contents: News[] }>({ endpoint: "news?limit=100" })
  ).contents;
  const profile = String(
    await unified()
      .use(remarkParse)
      .use(remarkHtml)
      .process(newsContents[newsContents.length - 1].content)
  );

  const news = newsContents.slice(0, newsContents.length - 1);
  const allIllustrations = (
    await client.get<{ contents: Illustration[] }>({
      endpoint: "illusts?limit=100",
    })
  ).contents;
  const illustrations = allIllustrations.filter((item) => !item.is3D);
  const illustrations3D = allIllustrations.filter((item) => item.is3D);

  return {
    props: {
      profile,
      works,
      skebWorks,
      worksWithoutVideo,
      news,
      illustrations,
      illustrations3D,
    },
  };
};

ReactModal.setAppElement("#__next");

const Home = ({
  profile,
  works,
  skebWorks,
  worksWithoutVideo,
  news,
  illustrations,
  illustrations3D,
}: Props) => {
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
        distance: "100%",
      });
      sr.reveal(".works-without-video-right", {
        reset: true,
        origin: "right",
        delay: 100,
        distance: "100%",
      });
      sr.reveal(".illustration-image", {
        reset: true,
        viewFactor: 0.3,
      });
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
  useEffect(() => {
    pageView("メインページ", "/");
  }, []);

  return (
    <div id="container">
      <CustomHead
        title={"粉鶴亀のポートフォリオサイト"}
        description={
          "アニメーター粉鶴亀（こなつるか）のポートフォリオサイトです。関わったアニメ作品へのリンクやイラストなどが含まれています。このサイトから仕事の依頼をすることもできます。"
        }
        author={"tannakaken"}
        keyword={"アニメ,animation,MV,イラスト,illustration,マンガ,manga"}
        domain={"www.konatsuruka.online"}
        url={"https://www.konatsuruka.online"}
        image={"https:///www.konatsuruka.online/header.webp"}
      />
      <Header />
      <main className={styles.main}>
        <div className={styles.mainHeader}>
          <div className={styles.mainHeaderPhone}>
            <div className={styles.mainHeaderPhoneClip}>
              <img src="./header.webp" alt="" />
            </div>
          </div>
        </div>
        <NewsSection news={news} />
        <About profile={profile} />
        <WorksSection
          works={works}
          skebWorks={skebWorks}
          worksWithoutVideo={worksWithoutVideo}
        />
        <IllustrationsSection
          illustrations={illustrations}
          illustrations3D={illustrations3D}
        />
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
