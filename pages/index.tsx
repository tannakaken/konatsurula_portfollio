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

import { MyWork, News, Work, WorkWithoutVideo } from "../models";
import CustomHead from "./components/CustomHead";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkHtml from "remark-html";
import About from "../static-components/about";
import WorksSection from "../static-components/works";
import MyWorksSection from "../static-components/myworks";
import NewsSection from "../static-components/news";
import { pageView } from "../helpers/ga.helper";

interface Params extends ParsedUrlQuery {}

type Props = {
  profile: string;
  works: Work[];
  skebWorks: Work[];
  worksWithoutVideo: WorkWithoutVideo[];
  news: News[];
  myYoutubes: MyWork[];
  myMovies: MyWork[];
  illustrations: MyWork[];
  illustrations3D: MyWork[];
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
  const sortWork = (a: Work, b: Work) => {
    if (a.publishedMonth === undefined) {
      if (b.publishedMonth === undefined) {
        return 0;
      }
      return -1;
    }
    if (b.publishedMonth === undefined) {
      return 1;
    }
    const aDate = new Date(a.publishedMonth);
    const bDate = new Date(b.publishedMonth);
    return bDate.getTime() - aDate.getTime();
  };
  works.sort(sortWork);
  const skebWorks = worksWithVideo.filter((work) => work.isSkeb);
  const worksWithoutVideo = allWorks.filter(
    (work) =>
      (work.youtubeId === undefined || work.youtubeId.length === 0) &&
      work.gifImage === undefined
  );
  worksWithoutVideo.sort(sortWork);
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
  const allMyWorks = (
    await client.get<{ contents: MyWork[] }>({
      endpoint: "myworks?limit=100",
    })
  ).contents;
  const myYoutubes = allMyWorks.filter((item) => item.youtubeId);
  const myMovies = allMyWorks.filter((item) => item.videoPath);
  const illustrations = allMyWorks.filter(
    (item) => !item.youtubeId && !item.videoPath && !item.is3D
  );
  const illustrations3D = allMyWorks.filter(
    (item) => !item.youtubeId && !item.videoPath && item.is3D
  );

  return {
    props: {
      profile,
      works,
      skebWorks,
      worksWithoutVideo,
      news,
      myYoutubes,
      myMovies,
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
  myYoutubes,
  myMovies,
  illustrations,
  illustrations3D,
}: Props) => {
  useEffect(() => {
    const animate = async () => {
      // nextで動かすために必要な処置
      // ScrollRevealパッケージのインポートにはwindowの横幅縦幅などの情報が必要だが
      // ssrやssgを行うときにはそれらの情報はまだない。
      // なのでこのタイミングでインポートする必要がある。
      // see https://qiita.com/syo2255/items/d0c79157b065398bb8cc
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
      // ここではイラストのアニメーションはしない
      // scrollrevealのアニメーションのためにはエレメントの高さなどが必要だが
      // ロードが終わらないと高さが決まらない。
      // なのでロード後にアニメーションを開始する。
      // see https://github.com/jlmakes/scrollreveal/issues/298
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
        image={"https:///www.konatsuruka.online/header2.webp"}
      />
      <Header />
      <main className={styles.main}>
        <div className={styles.mainHeader}>
          <div className={styles.mainHeaderPhone}>
            <div className={styles.mainHeaderPhoneClip}>
              <img src={"./header.webp"} alt="" />
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
        <MyWorksSection
          myYoutubes={myYoutubes}
          myMovies={myMovies}
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
