import Head from "next/head";
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

interface Params extends ParsedUrlQuery {}

type Props = {
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
  const news = (await client.get<{ contents: News[] }>({ endpoint: "news" }))
    .contents;
  const illustrations = (
    await client.get<{ contents: Illustration[] }>({ endpoint: "illusts" })
  ).contents;

  return {
    props: {
      works,
      news,
      illustrations,
    },
  };
};

ReactModal.setAppElement("#__next");

const Home = ({ works, news, illustrations }: Props) => {
  const [selectedNews, setSelectedNews] = useState<News | undefined>(undefined);
  const isNewsModalOpen = selectedNews !== undefined;
  const [selectedIllustration, setSelectedIllustration] = useState<
    Illustration | undefined
  >(undefined);
  const isIllustrationModalOpen = selectedIllustration !== undefined;
  const [selectedWork, setSelectedWork] = useState<Work | undefined>(undefined);
  const isYoutubeModalOpen = selectedWork !== undefined;

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
  const [scrollY, setScrollY] = useState(0);

  const handleScroll = () => {
    setScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={styles.container}>
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
        <section className={styles.section} id="news-section">
          <div className={styles.newsContainer} id={styles.newsHeader}>
            <h2>ニュース</h2>
            <ul>
              {news.map((newsContent) => (
                <li
                  key={newsContent.id}
                  onClick={() => setSelectedNews(newsContent)}
                >
                  <img
                    className={newsContent.isNew ? undefined : styles.oldNews}
                    alt="it's new"
                    src="/new.gif"
                    width={"36px"}
                    height={"13px"}
                  />
                  {newsContent.title}
                </li>
              ))}
            </ul>
            <div className={styles.newsContainerAttachment}>
              <div className={styles.newsContainerClip}>
                <img
                  style={{
                    top: 248 - scrollY,
                    objectPosition: `0px ${scrollY - 186}px`,
                  }}
                  src={"./header_nega.png"}
                  alt={""}
                />
              </div>
            </div>
          </div>
        </section>
        <About />
        <section className={styles.section} id="works-section">
          <header className={styles.sectionHeader} id={styles.worksHeader}>
            <h1>お仕事</h1>
          </header>
          <div className={styles.sectionContainer}>
            {works.map((work) => (
              <img
                onClick={() => setSelectedWork(work)}
                alt={work.title}
                src={`https://img.youtube.com/vi/${work.youtubeId}/sddefault.jpg`}
                key={work.id}
                className={styles.work + " works-image"}
              />
            ))}
          </div>
        </section>
        <section className={styles.section} id="illusts-section">
          <header className={styles.sectionHeader} id={styles.illustHeader}>
            <h1>イラスト</h1>
          </header>
          <div className={styles.sectionContainer}>
            <div className={styles.illustrations}>
              {illustrations.map((illustration, index) => (
                <img
                  onClick={() => setSelectedIllustration(illustration)}
                  className={styles.illustration + " illustration-image"}
                  alt={illustration.title}
                  src={illustration.image.url}
                  key={illustration.id}
                />
              ))}
            </div>
          </div>
        </section>
        <ContactForm />
      </main>
      <Footer />
      <ReactModal
        contentLabel="News Modal"
        isOpen={isNewsModalOpen}
        shouldCloseOnEsc={true}
        onRequestClose={() => setSelectedNews(undefined)}
        closeTimeoutMS={500}
      >
        <div className={youTubeStyles.header}>
          <h2>{selectedNews?.title}</h2>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
          }}
        >
          <a
            className={youTubeStyles.closeButton}
            onClick={() => setSelectedNews(undefined)}
          >
            ×close
          </a>
        </div>
        {selectedNews !== undefined && (
          <p style={{ whiteSpace: "pre" }}>{selectedNews.content}</p>
        )}
      </ReactModal>
      <ReactModal
        contentLabel="Illustration Modal"
        isOpen={isIllustrationModalOpen}
        shouldCloseOnEsc={true}
        onRequestClose={() => setSelectedIllustration(undefined)}
        closeTimeoutMS={500}
      >
        <div className={youTubeStyles.header}>
          <h2>{selectedIllustration?.title}</h2>
          <a
            className={youTubeStyles.closeButton}
            onClick={() => setSelectedIllustration(undefined)}
          >
            ×close
          </a>
        </div>
        {selectedIllustration !== undefined && (
          <div style={{ textAlign: "center" }}>
            <img
              src={selectedIllustration.image.url}
              alt={selectedIllustration.title}
              style={{ maxHeight: "85vh", maxWidth: "85vw" }}
            />
          </div>
        )}
        <p className={youTubeStyles.description}>
          {selectedIllustration?.description}
        </p>
      </ReactModal>
      <ReactModal
        contentLabel="YouTube Modal"
        isOpen={isYoutubeModalOpen}
        shouldCloseOnEsc={true}
        onRequestClose={() => setSelectedWork(undefined)}
        closeTimeoutMS={500}
      >
        <div className={youTubeStyles.header}>
          <h2>{selectedWork?.title}</h2>
          <a
            className={youTubeStyles.closeButton}
            onClick={() => setSelectedWork(undefined)}
          >
            ×close
          </a>
        </div>
        {selectedWork !== undefined && (
          <YouTube
            opts={{ playerVars: { autoplay: 1 } }}
            loading="lazy"
            className={youTubeStyles.iframe}
            containerClassName={youTubeStyles.youtube}
            videoId={selectedWork?.youtubeId}
          />
        )}
        <p className={youTubeStyles.description}>{selectedWork?.description}</p>
      </ReactModal>
    </div>
  );
};

export default Home;
