import Head from 'next/head';
import Link from 'next/link';
import CSS from 'csstype';
import { Link as ScrollLink } from 'react-scroll';
import * as Scroll from 'react-scroll';
import styles from '../styles/Home.module.scss';
import {useEffect, useState} from "react";
import {createClient} from "microcms-js-sdk";
import YouTube from "react-youtube";
import youTubeStyles from  '../styles/YouTube.module.scss';
import '../styles/YouTube.module.scss';
import ReactModal from "react-modal"
import * as React from "react";
import {ParsedUrlQuery} from "querystring";
import {GetStaticProps} from "next";
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

type Work = {
  id: string,
  title: string;
  youtubeId: string;
  description: string;
}

type News = {
  id: string;
  title: string;
  content: string;
  isNew: boolean;
}

type ImageData = {
  url: string;
  height: number;
  width: number;
}

type Illustration = {
  id: string;
  title: string;
  image: ImageData;
  description: string;
}

interface Params extends ParsedUrlQuery {
}

type Props = {
  works: Work[];
  news: News[];
  illustrations: Illustration[];
  illustrationStyles: CSS.Properties[];
}
type Float = "left" | "right"

const changeFloat = (float: Float): Float => {
  if (float == "left") {
    return "right";
  }
  return "left";
};

const decideStyles = (illustrations: Illustration[]): CSS.Properties[] => {
  const styles = [] as any[];
  let heightLimit = 0;
  let heightSum = 0;
  let float: Float = "left";
  for (const illustration of illustrations) {
    const height = illustration.image.height / illustration.image.width;
    styles.push({
      width: "50%",
      display: "block",
      float: float,
    })
    heightSum += height
    if (heightSum >= heightLimit) {
      heightLimit = heightSum + height - heightLimit;
      heightSum = heightLimit - height;
      float = changeFloat(float);
    }
  }
  return styles;
}

export const getStaticProps: GetStaticProps<Props, Params> = async (context) => {
  const client = createClient({
    serviceDomain: "konatsuruka",
    apiKey: process.env.NEXT_PUBLIC_MICRO_CMS_API_KEY || "",
  });
  const works = (await client.get<{contents: Work[]}>({endpoint: "works"})).contents;
  const news = (await client.get<{contents: News[]}>({endpoint: "news"})).contents
  const illustrations = (await client.get<{contents: Illustration[]}>({endpoint: "illusts"})).contents

  return { props: {
      works,
      news,
      illustrations,
      illustrationStyles: decideStyles(illustrations),
    }
  }
};

ReactModal.setAppElement('#__next')

const Home = ({works, news, illustrations, illustrationStyles}: Props) => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [selectedWork, setSelectedWork] = useState<Work | undefined>(undefined);
  const isModalOpen = selectedWork !== undefined;

  useEffect(() => {
    const animate = async () => {
      const sr = (await import("scrollreveal")).default()
      sr.reveal(".works-image", {reset: true});
      sr.reveal(".illusts-image", {reset: true});
      sr.reveal(".left-about", {
        reset: true,
        opacity: 1,
        origin: "left",
        delay: 400,
        distance: "50%"
      });
      sr.reveal(".right-about", {
        reset: true,
        opacity: 1,
        origin: "right",
        delay: 400,
        distance: "50%"
      });
    };
    animate().then(() => console.log("animate")).catch((error) => console.warn(error));
  }, []);
  const [checked, setChecked] = useState(false);
  useEffect(() => {
    const Events = Scroll.Events;
    Events.scrollEvent.register("end", () => {
      setChecked(false);
    });
    return () => {
      Events.scrollEvent.remove("end");
    }
  }, []);
  const [email, setEmail] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);

  return (
    <div className={styles.container}>
      <Head>
        <title>粉鶴亀のポートフォリオサイト</title>
        <meta name="description" content="アニメーター粉鶴亀（こなつるか）のポートフォリオサイトです。関わったアニメ作品へのリンクやイラストなどが含まれています。このサイトから仕事の依頼をすることもできます。" />
        <meta name="author" content="tannakaken" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <input id={styles.drawerInput} className={styles.drawerHidden} type="checkbox" checked={checked} onChange={() => setChecked(!checked)} />
      <header className={styles.header}>
        <h1 id="title" className={styles.headerTitle}>
          <Link href="/">粉鶴亀のポートフォリオサイト</Link>
        </h1>
        <nav className={styles.globalNavi}>
          <ul>
            <li className={styles.navItem}><ScrollLink to="news-section" smooth={true}>NEWS</ScrollLink></li>
            <li className={styles.navItem}><ScrollLink to="about-section" smooth={true}>ABOUT</ScrollLink></li>
            <li className={styles.navItem}><ScrollLink to="works-section" smooth={true}>WORKS</ScrollLink></li>
            <li className={styles.navItem}><ScrollLink to="illusts-section" smooth={true}>ILLUST</ScrollLink></li>
            <li className={styles.navItem}><ScrollLink to="contact-section" smooth={true}>CONTACT</ScrollLink></li>
          </ul>
        </nav>
        <label htmlFor={styles.drawerInput} className={styles.drawerOpen}><span /></label>
      </header>
      <nav className={styles.globalNaviPhone}>
        <ul>
          <li className={styles.navItem}><ScrollLink to="news-section" smooth={true} onSetActive={() => console.warn("hello")} >NEWS</ScrollLink></li>
          <li className={styles.navItem}><ScrollLink to="about-section" smooth={true}>ABOUT</ScrollLink></li>
          <li className={styles.navItem}><ScrollLink to="works-section" smooth={true}>WORKS</ScrollLink></li>
          <li className={styles.navItem}><ScrollLink to="illusts-section" smooth={true}>ILLUST</ScrollLink></li>
          <li className={styles.navItem}><ScrollLink to="contact-section" smooth={true}>CONTACT</ScrollLink></li>
        </ul>
      </nav>
      <main className={styles.main}>
        <div>
          <img className={styles.mainHeader} src="./header.png" alt={"粉鶴亀のポートフォリオサイト"} />
        </div>
        <section className={styles.section} id="news-section">
          <header className={styles.sectionHeader} id={styles.newsHeader}>
            <h1>NEWS</h1>
          </header>
          <div className={styles.sectionContainer}>
            <ul>{news.map((newsContent) => (
                <li key={newsContent.id}>
                  {newsContent.isNew && (<img alt="it's new" src="./new.gif" />)}{newsContent.title}
                </li>
            ))}</ul>
          </div>
        </section>
        <section id="about-section">
          <div id={styles.aboutContainer}>
            <div className={styles.iconContainer + " left-about"}>
              <img className={styles.icon} src="./icon.jpeg" alt={"粉鶴亀のアイコン"}/>
            </div>
            <div className={styles.descriptionContainer + " right-about"}>
              <div className={styles.description}>
                <p>粉鶴亀（こなつるか）</p>
                <p>アニメーター</p>
                <p>MP・TVアニメ</p>
                <p>イラスト・マンガ</p>
              </div>
              <div className={styles.description}>
                <p>主な仕事：<br />
                  <a href="https://www.youtube.com/watch?v=ENcnYh79dUY">ヨルシカ「思想犯」</a><br />
                  <a href="https://www.youtube.com/watch?v=kzdJkT4kp-A">YOASOBI「ハルジオン」</a>
                </p>
                <p>連絡先：...@gmail.com</p>
                <p>Twitter:<a href="https://twitter.com/sashimi0404">@sashimi0404</a></p>
              </div>
            </div>
          </div>
          <div id={styles.aboutContainerPhone}>
            <div className={styles.iconContainer}>
              <img className={styles.icon} src="./icon.jpeg" alt={"粉鶴亀のアイコン"}/>
            </div>
            <div className={styles.descriptionContainer}>
              <div className={styles.description}>
                <p>粉鶴亀（こなつるか）</p>
                <p>アニメーター</p>
                <p>MP・TVアニメ</p>
                <p>イラスト・マンガ</p>
              </div>
              <div className={styles.description}>
                <p>主な仕事：<br />
                  <a href="https://www.youtube.com/watch?v=ENcnYh79dUY">ヨルシカ「思想犯」</a><br />
                  <a href="https://www.youtube.com/watch?v=kzdJkT4kp-A">YOASOBI「ハルジオン」</a>
                </p>
                <p>連絡先：...@gmail.com</p>
                <p>Twitter:<a href="https://twitter.com/sashimi0404">@sashimi0404</a></p>
              </div>
            </div>
          </div>
        </section>
        <section className={styles.section} id="works-section">
          <header className={styles.sectionHeader} id={styles.worksHeader}>
            <h1>WORKS</h1>
          </header>
          <div className={styles.sectionContainer}>
            {works.map((work) => (
              <img
                  onClick={() => setSelectedWork(work)}
                  key={work.id}
                  className={styles.work + " works-image"}
                  alt={work.title}
                  src={`https://img.youtube.com/vi/${work.youtubeId}/default.jpg`} />))}
          </div>
        </section>
        <section className={styles.section} id="illusts-section">
          <header className={styles.sectionHeader} id={styles.illustHeader}>
            <h1>ILLUST</h1>
          </header>
          <div className={styles.sectionContainer}>
            <div className={styles.illusts}>
              {illustrations.map((illust, index) => (
              <img
                  style={illustrationStyles[index]}
                  className={"illustration-image"}
                  key={illust.id}
                  alt={illust.title}
                  src={illust.image.url} />
            ))}
            </div>
          </div>
        </section>
        <section id="contact-section" style={{display: "flex", flexDirection: "column", alignItems: "center", width: "100%"}}>
          <h1>CONTACT</h1>
          <div>
            <label htmlFor={"email"}>メールアドレス:</label>
            <input
                name={"email"}
                type={"email"}
                 value={email}
                 onChange={(event) => setEmail(event.target.value)}
                   style={{
                     width: "300px"
                   }}
          />
          </div>
          <div>
            <label htmlFor={"body"}>本文：</label><br />
            <textarea
                name={"body"}
                value={body}
                onChange={(event) => setBody(event.target.value)}
                style={{
                  width: "410px",
                  height: "200px",
                }}

          />
          </div>
          <div style={{display: "flex", flexDirection: "column", justifyContent: "end", width: "410px"}}>
            <button style={{width: "80px"}} id={"contact-button"}
                onClick={async () => {
                  if (sending) {
                    return;
                  }
                  if (email.length === 0 || body.length === 0) {
                    return;
                  }
                  if (executeRecaptcha === undefined) {
                    console.warn("undefined");
                    return;
                  }
                  const recaptchaToken = await executeRecaptcha('contactPage');
                  setSending(true);
                  fetch("https://8ikmquk2i4.execute-api.ap-northeast-1.amazonaws.com/send-mail-SES", {
                    method: "POST",
                    mode: 'cors',
                    headers: {
                      "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                      email,
                      body,
                      recaptchaToken,
                    })
                  }).then(() => {
                    setBody("");
                    setEmail("");
                    alert('送信しました');
                    setSending(false);
                  }).catch((error) => {
                    alert(error);
                    setSending(false);
                  })
                }}>
              送信
            </button>
            <p className={styles.googleRecaptchaNotice}>
          このサイトはreCAPTCHAとGoogleとによって保護されています。
          <a className={styles.linkStyle} href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">プライバシーポリシー</a>と
          <a className={styles.linkStyle} href="https://policies.google.com/terms" target="_blank" rel="noreferrer">利用規約</a>が適用されます。
        </p>
          </div>
        </section>
      </main>
      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <img src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
      <ReactModal
          contentLabel="YouTube Modal"
          isOpen={isModalOpen}
          shouldCloseOnEsc={true}
          onRequestClose={() => setSelectedWork(undefined)}
          closeTimeoutMS={500}
      >
        <div className={youTubeStyles.header}>
          <h2>{selectedWork?.title}</h2>
          <a className={youTubeStyles.closeButton} onClick={() => setSelectedWork(undefined)}>×close</a>
        </div>
        {selectedWork !== undefined && (
            <YouTube
              opts={{playerVars: {autoplay: 1}}}
              loading="lazy"
              className={youTubeStyles.iframe}
              containerClassName={youTubeStyles.youtube}
              videoId={selectedWork?.youtubeId} />
        )}
        <p className={youTubeStyles.description}>{selectedWork?.description}</p>
      </ReactModal>
    </div>
  )
}

export default Home;
