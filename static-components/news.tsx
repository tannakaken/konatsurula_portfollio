import "../styles/YouTube.module.scss";
import youTubeStyles from "../styles/YouTube.module.scss";
import styles from "../styles/Home.module.scss";
import { News } from "../models";
import { useState } from "react";
import { useScroll, useWindowSize } from "../helpers/window.helpers";
import ReactModal from "react-modal";

const headerWidth = 1500;
const headerHeight = 682;

const NewsSection = ({ news }: { news: News[] }) => {
  const windowSize = useWindowSize();
  const scroll = useScroll();
  const realHeaderHeight = (windowSize.width / headerWidth) * headerHeight;
  const [selectedNews, setSelectedNews] = useState<News | undefined>(undefined);

  return (
    <>
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
                  src="/new.webp"
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
                  top: 60 + realHeaderHeight - scroll.y,
                  objectPosition: `0px ${scroll.y - realHeaderHeight}px`,
                  height: "100vh",
                }}
                src={"./header_nega.webp"}
                alt={""}
              />
            </div>
          </div>
        </div>
      </section>
      <ReactModal
        contentLabel="News Modal"
        isOpen={selectedNews !== undefined}
        shouldCloseOnEsc={true}
        onRequestClose={() => setSelectedNews(undefined)}
        closeTimeoutMS={500}
        portalClassName="NewsModalPortal"
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
          <p className={youTubeStyles.description}>{selectedNews.content}</p>
        )}
      </ReactModal>
    </>
  );
};

export default NewsSection;
