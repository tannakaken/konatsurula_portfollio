import "../styles/YouTube.module.scss";
import youTubeStyles from "../styles/YouTube.module.scss";
import styles from "../styles/Home.module.scss";
import workStyles from "../styles/Work.module.scss";
import { truncateMonth, Work, WorkWithoutVideo } from "../models";
import { useCallback, useState } from "react";
import ReactModal from "react-modal";
import YouTube from "react-youtube";
import { trackingEvent } from "../helpers/ga.helper";
import { youtubeOption } from "./constants";

const className = (index: number) => {
  return index % 2 === 0
    ? "works-without-video-right"
    : "works-without-video-left";
};

const imageStyle = {
  width: "80%",
  paddingTop: 0,
} as const;

/**
 * 仕事で関わった制作物のセクション
 */
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
  const [showNotice, setShowNotice] = useState(false);
  const showedNumberOfWorksWithoutVideo = 10;
  const showedWorksWithoutVideo = worksWithoutVideo.slice(
    0,
    showedNumberOfWorksWithoutVideo
  );
  const hasMoreWorksWithoutVideo =
    worksWithoutVideo.length > showedNumberOfWorksWithoutVideo;
  const [showPastWorksWithoutVideo, setShowPastWorksWithoutVideo] =
    useState(false);
  const onAfterOpen = useCallback(() => {
    setShowNotice(true);
  }, []);
  const close = useCallback(() => {
    setSelectedWork(undefined);
    setShowNotice(false);
  }, []);
  return (
    <>
      <section className={styles.section} id="works-section">
        <section>
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
                  src={`https://img.youtube.com/vi_webp/${work.youtubeId}/hqdefault.webp`}
                  key={work.id}
                  className={styles.work + " works-image-" + (index % 4)}
                />
              )
            )}
          </div>
          <div>
            {showedWorksWithoutVideo.map((work, index) => (
              <div
                className={
                  index > showedNumberOfWorksWithoutVideo
                    ? workStyles.noShow
                    : workStyles.workWithoutVideo
                }
                key={work.id}
              >
                <div
                  className={
                    workStyles.workWithoutVideoContainer +
                    " " +
                    className(index)
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
            {hasMoreWorksWithoutVideo && (
              <div>
                <button
                  className={workStyles.showMoreWorksWithoutVideo}
                  type="button"
                  onClick={() => {
                    setShowPastWorksWithoutVideo(true);
                  }}
                >
                  全て見る...
                </button>
              </div>
            )}
          </div>
        </section>
        <section>
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
                  src={`https://img.youtube.com/vi_webp/${work.youtubeId}/hqdefault.webp`}
                  key={work.id}
                  className={styles.work + " works-image-" + (index % 4)}
                />
              )
            )}
          </div>
        </section>
      </section>
      <ReactModal
        contentLabel="YouTube Modal"
        isOpen={selectedWork !== undefined}
        shouldCloseOnEsc={true}
        onRequestClose={close}
        onAfterClose={onAfterOpen}
        closeTimeoutMS={500}
        portalClassName="YoutubeModalPortal"
      >
        <div className={youTubeStyles.header}>
          <h2>{selectedWork?.title}</h2>
          <a className={youTubeStyles.closeButton} onClick={close}>
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
                style={imageStyle}
              />
              <div>
                {showNotice && (
                  <p>無断転載禁止/Do not repost without my permission.</p>
                )}
              </div>
            </>
          ) : (
            <YouTube
              opts={youtubeOption}
              loading="lazy"
              className={youTubeStyles.iframe}
              containerClassName={youTubeStyles.youtube}
              videoId={selectedWork?.youtubeId}
            />
          ))}
      </ReactModal>
      <ReactModal
        contentLabel="Past Works Modal"
        isOpen={showPastWorksWithoutVideo}
        shouldCloseOnEsc={true}
        onRequestClose={() => {
          setShowPastWorksWithoutVideo(false);
        }}
        closeTimeoutMS={500}
        portalClassName="PastWorksModalPortal"
      >
        <div className={workStyles.pastWorksHeader}>
          <h2>過去の仕事</h2>
          <a
            className={workStyles.closeButton}
            onClick={() => {
              setShowPastWorksWithoutVideo(false);
            }}
          >
            ×close
          </a>
        </div>
        <div className={workStyles.pastWorksContainer}>
          {worksWithoutVideo.map((work) => (
            <div className={workStyles.pastwork} key={work.id}>
              <div className={workStyles.pastWorkContainer}>
                <h2 className={workStyles.pastWorkTitle}>{work.title}</h2>
                <div className={workStyles.pastWorkContent}>
                  <p className={workStyles.publishedMonth}>
                    {truncateMonth(work.publishedMonth)}
                  </p>
                  <p className={workStyles.description}>{work.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ReactModal>
    </>
  );
};

export default WorksSection;
