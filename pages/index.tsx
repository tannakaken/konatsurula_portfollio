import Head from "next/head";
import Link from "next/link";
import { Link as ScrollLink } from "react-scroll";
import * as Scroll from "react-scroll";
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

type Work = {
  id: string;
  title: string;
  youtubeId: string;
  description: string;
};

type News = {
  id: string;
  title: string;
  content: string;
  isNew: boolean;
};

type ImageData = {
  url: string;
  height: number;
  width: number;
};

type Illustration = {
  id: string;
  title: string;
  image: ImageData;
  description: string;
};

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
    animate()
      .then(() => console.log("animate"))
      .catch((error) => console.warn(error));
  }, []);
  const [checked, setChecked] = useState(false);
  useEffect(() => {
    const Events = Scroll.Events;
    Events.scrollEvent.register("end", () => {
      setChecked(false);
    });
    return () => {
      Events.scrollEvent.remove("end");
    };
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
      <Head>
        <title>粉鶴亀のポートフォリオサイト</title>
        <meta
          name="description"
          content="アニメーター粉鶴亀（こなつるか）のポートフォリオサイトです。関わったアニメ作品へのリンクやイラストなどが含まれています。このサイトから仕事の依頼をすることもできます。"
        />
        <meta name="author" content="tannakaken" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <input
        id={styles.drawerInput}
        className={styles.drawerHidden}
        type="checkbox"
        checked={checked}
        onChange={() => setChecked(!checked)}
      />
      <header className={styles.header}>
        <h1 id="title" className={styles.headerTitle}>
          <Link href="/">粉鶴亀のポートフォリオサイト</Link>
        </h1>
        <nav className={styles.globalNavi}>
          <ul>
            <li className={styles.navItem}>
              <ScrollLink to="news-section" smooth={true}>
                ニュース
              </ScrollLink>
            </li>
            <li className={styles.navItem}>
              <ScrollLink to="about-section" smooth={true}>
                アバウト
              </ScrollLink>
            </li>
            <li className={styles.navItem}>
              <ScrollLink to="works-section" smooth={true}>
                お仕事
              </ScrollLink>
            </li>
            <li className={styles.navItem}>
              <ScrollLink to="illusts-section" smooth={true}>
                イラスト
              </ScrollLink>
            </li>
            <li className={styles.navItem}>
              <ScrollLink to="contact-section" smooth={true}>
                お仕事相談所
              </ScrollLink>
            </li>
          </ul>
        </nav>
        <label htmlFor={styles.drawerInput} className={styles.drawerOpen}>
          <span />
        </label>
      </header>
      <nav className={styles.globalNaviPhone}>
        <ul>
          <li className={styles.navItem}>
            <ScrollLink
              to="news-section"
              smooth={true}
              onSetActive={() => console.warn("hello")}
            >
              ニュース
            </ScrollLink>
          </li>
          <li className={styles.navItem}>
            <ScrollLink to="about-section" smooth={true}>
              アバウト
            </ScrollLink>
          </li>
          <li className={styles.navItem}>
            <ScrollLink to="works-section" smooth={true}>
              お仕事
            </ScrollLink>
          </li>
          <li className={styles.navItem}>
            <ScrollLink to="illusts-section" smooth={true}>
              イラスト
            </ScrollLink>
          </li>
          <li className={styles.navItem}>
            <ScrollLink to="contact-section" smooth={true}>
              お仕事相談所
            </ScrollLink>
          </li>
        </ul>
      </nav>
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
        <section id="about-section">
          <div id={styles.aboutContainer}>
            <div className={styles.iconContainer + " left-about"}>
              <img
                className={styles.icon}
                src="/icon.png"
                alt={"粉鶴亀のアイコン"}
                width={"333px"}
                height={"333px"}
              />
            </div>
            <div className={styles.descriptionContainer + " right-about"}>
              <div className={styles.description}>
                <p>粉鶴亀（こなつるか）</p>
                <p>アニメーター</p>
                <p>MV・TVアニメ</p>
                <p>イラスト・マンガ（海老蔵名義）</p>
              </div>
              <div className={styles.link}>
                <p>
                  主な仕事：
                  <br />
                  <a href="https://www.youtube.com/watch?v=ENcnYh79dUY">
                    ヨルシカ「思想犯」
                  </a>
                  <br />
                  <a href="https://www.youtube.com/watch?v=kzdJkT4kp-A">
                    YOASOBI「ハルジオン」
                  </a>
                </p>
                <p>
                  連絡先:
                  <a
                    className={styles.linkStyle}
                    href={"mailto:ebizosui2017wishrimp@gmail.com"}
                  >
                    ebizosui2017wishrimp@gmail.com
                  </a>
                </p>
                <p>
                  Twitter
                  <img
                    alt="twitter account"
                    src={"/Twitter.png"}
                    width={"15px"}
                    height={"15px"}
                  />
                  :
                  <a
                    className={styles.linkStyle}
                    href="https://twitter.com/sashimi0404"
                  >
                    @sashimi0404
                  </a>
                </p>
                <p>
                  Pixiv（版権絵置き場）:
                  <a
                    className={styles.linkStyle}
                    href="https://www.pixiv.net/users/2157406"
                  >
                    海老蔵
                  </a>
                </p>
              </div>
            </div>
          </div>
          <div id={styles.aboutContainerPhone}>
            <div className={styles.iconContainer}>
              <img
                className={styles.icon}
                src="/transparent_icon.png"
                alt={"粉鶴亀のアイコン"}
                width={"200px"}
                height={"200px"}
              />
            </div>
            <div className={styles.descriptionContainer}>
              <div className={styles.description}>
                <p>粉鶴亀（こなつるか）</p>
                <p>アニメーター</p>
                <p>MP・TVアニメ</p>
                <p>
                  イラスト・マンガ
                  <br />
                  （海老蔵名義）
                </p>
              </div>
              <div className={styles.link}>
                <p>
                  主な仕事：
                  <br />
                  <a href="https://www.youtube.com/watch?v=ENcnYh79dUY">
                    ヨルシカ「思想犯」
                  </a>
                  <br />
                  <a href="https://www.youtube.com/watch?v=kzdJkT4kp-A">
                    YOASOBI「ハルジオン」
                  </a>
                </p>
                <p>
                  連絡先:
                  <br />
                  <a
                    className={styles.linkStyle}
                    href={"mailti:ebizosui2017wishrimp@gmail.com"}
                  >
                    ebizosui2017wishrimp@gmail.com
                  </a>
                </p>
                <p>
                  Twitter
                  <img
                    alt="twitter account"
                    src={"/Twitter.png"}
                    width={"15px"}
                    height={"15px"}
                  />
                  :<br />
                  <a
                    className={styles.linkStyle}
                    href="https://twitter.com/sashimi0404"
                  >
                    @sashimi0404
                  </a>
                </p>
                <p>
                  Pixiv（版権絵置き場）:
                  <br />
                  <a
                    className={styles.linkStyle}
                    href="https://www.pixiv.net/users/2157406"
                  >
                    海老蔵
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>
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
        <section
          id="contact-section"
          className={styles.contactSection}
        >
          <h1>☆お仕事相談所☆</h1>
          <ContactForm />
        </section>
      </main>
      <footer className={styles.footer}>
        <p>
          Copyright(c)2022 粉鶴亀(KONATSURUKA). All Rights Reserved{" "}
          <span className={styles.logo}>
            <img src="favicon.png" alt="ebi logo" width={32} height={32} />
          </span>
        </p>
        <p>
          Created By <a href={"https://twitter.com/tannakaken"}>Tannakaken</a>
        </p>
      </footer>
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
              style={{ maxHeight: "85vh", maxWidth: "90vw" }}
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
