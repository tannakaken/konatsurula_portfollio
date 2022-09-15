import "../styles/YouTube.module.scss";
import youTubeStyles from "../styles/YouTube.module.scss";
import styles from "../styles/Home.module.scss";
import workStyles from "../styles/Work.module.scss";
import { truncateMonth, Work, WorkWithoutVideo } from "../models";
import { useState } from "react";
import ReactModal from "react-modal";
import YouTube from "react-youtube";
import { trackingEvent } from "../helpers/ga.helper";

const className = (index: number) => {
  return index % 2 === 0
    ? "works-without-video-right"
    : "works-without-video-left";
};

const WorksSection = ({
  works,
  skebWorks,
  worksWithoutVideo,
}: {
  works: Work[];
  skebWorks: Work[];
  worksWithoutVideo: WorkWithoutVideo[];
}) => {
  const [selectedWork, setSelectedWork] = useState<Work | undefined>(undefined);
  return (
    <>
      <section className={styles.section} id="works-section">
        <header className={styles.sectionHeader} id={styles.worksHeader}>
          <h1>お仕事</h1>
        </header>
        <div className={styles.sectionContainer}>
          {works.map((work, index) =>
            work.gifImage !== undefined ? (
              <img
                onClick={() => {
                  setSelectedWork(work);
                  trackingEvent("Movie", work.title);
                }}
                alt={work.title}
                src={work.gifImage.url + "?w=300&fm=webp"}
                key={work.id}
                className={styles.work + " works-image-" + (index % 4)}
              />
            ) : (
              <img
                onClick={() => {
                  setSelectedWork(work);
                  trackingEvent("Movie", work.title);
                }}
                alt={work.title}
                src={`https://img.youtube.com/vi/${work.youtubeId}/hqdefault.jpg`}
                key={work.id}
                className={styles.work + " works-image-" + (index % 4)}
              />
            )
          )}
        </div>
        <div>
          {worksWithoutVideo.map((work, index) => (
            <div className={workStyles.workWithoutVideo} key={work.id}>
              <div
                className={
                  workStyles.workWithoutVideoContainer + " " + className(index)
                }
              >
                <h2 className={workStyles.title}>{work.title}</h2>
                <div className={workStyles.content}>
                  <p className={workStyles.publishedMonth}>
                    {truncateMonth(work.publishedMonth)}
                  </p>
                  <p className={workStyles.description}>{work.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <header className={styles.sectionHeader} id={styles.worksHeader}>
          <h1>SKEB</h1>
        </header>
        <div className={styles.sectionContainer}>
          {skebWorks.map((work, index) =>
            work.gifImage !== undefined ? (
              <img
                onClick={() => {
                  setSelectedWork(work);
                  trackingEvent("Movie", work.title);
                }}
                alt={work.title}
                src={work.gifImage.url + "?w=300&fm=webp"}
                key={work.id}
                className={styles.work + " works-image-" + (index % 4)}
              />
            ) : (
              <img
                onClick={() => {
                  setSelectedWork(work);
                  trackingEvent("Movie", work.title);
                }}
                alt={work.title}
                src={`https://img.youtube.com/vi/${work.youtubeId}/hqdefault.jpg`}
                key={work.id}
                className={styles.work + " works-image-" + (index % 4)}
              />
            )
          )}
        </div>
      </section>
      <ReactModal
        contentLabel="YouTube Modal"
        isOpen={selectedWork !== undefined}
        shouldCloseOnEsc={true}
        onRequestClose={() => setSelectedWork(undefined)}
        closeTimeoutMS={500}
        portalClassName="YoutubeModalPortal"
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
        <p>{truncateMonth(selectedWork?.publishedMonth)}</p>
        <p className={youTubeStyles.youtubeDescription}>
          {selectedWork?.description}
        </p>
        {selectedWork !== undefined &&
          (selectedWork.gifImage !== undefined ? (
            <>
              <img
                alt={selectedWork.title}
                src={selectedWork.gifImage.url}
                className={youTubeStyles.youtube}
                style={{
                  width: "80%",
                  paddingTop: 0,
                }}
              />
              <div>
                <p>無断転載禁止/Do not repost without my permission.</p>
              </div>
            </>
          ) : (
            <YouTube
              opts={{ playerVars: { autoplay: 1 } }}
              loading="lazy"
              className={youTubeStyles.iframe}
              containerClassName={youTubeStyles.youtube}
              videoId={selectedWork?.youtubeId}
            />
          ))}
      </ReactModal>
    </>
  );
};

export default WorksSection;
