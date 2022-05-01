import "../styles/YouTube.module.scss";
import youTubeStyles from "../styles/YouTube.module.scss";
import styles from "../styles/Home.module.scss";
import { Work } from "../models";
import { useState } from "react";
import ReactModal from "react-modal";
import YouTube from "react-youtube";

const WorksSection = ({works}: {works: Work[]}) => {
    const [selectedWork, setSelectedWork] = useState<Work | undefined>(undefined);
    return (<>
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
        {selectedWork !== undefined && (
          <YouTube
            opts={{ playerVars: { autoplay: 1 } }}
            loading="lazy"
            className={youTubeStyles.iframe}
            containerClassName={youTubeStyles.youtube}
            videoId={selectedWork?.youtubeId}
          />
        )}
        <p className={youTubeStyles.youtubeDescription}>{selectedWork?.description}</p>
      </ReactModal>
    </>);
};

export default WorksSection;