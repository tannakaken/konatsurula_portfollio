import "../styles/YouTube.module.scss";
import youTubeStyles from "../styles/YouTube.module.scss";
import styles from "../styles/Home.module.scss";
import { Illustration } from "../models";
import { useState } from "react";
import ReactModal from "react-modal";
import { trackingEvent } from "../helpers/ga.helper";

const IllustrationsSection = ({
  illustrations,
}: {
  illustrations: Illustration[];
}) => {
  const [selectedIllustration, setSelectedIllustration] = useState<
    Illustration | undefined
  >(undefined);
  return (
    <>
      <section className={styles.section} id="illusts-section">
        <header className={styles.sectionHeader} id={styles.illustHeader}>
          <h1>イラスト</h1>
        </header>
        <div className={styles.sectionContainer}>
          <div className={styles.illustrations}>
            {illustrations.map((illustration, index) => (
              <img
                onClick={() => {
                  trackingEvent("Illustration", illustration.title);
                  setSelectedIllustration(illustration);
                }}
                className={styles.illustration + " illustration-image"}
                alt={illustration.title}
                src={illustration.image.url}
                key={illustration.id}
                style={{ cursor: "pointer" }}
              />
            ))}
          </div>
        </div>
      </section>
      <ReactModal
        contentLabel="Illustration Modal"
        isOpen={selectedIllustration !== undefined}
        shouldCloseOnEsc={true}
        onRequestClose={() => setSelectedIllustration(undefined)}
        closeTimeoutMS={500}
        portalClassName="IllustrationModalPortal"
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
              style={{ maxHeight: "80vh", maxWidth: "80vw" }}
            />
          </div>
        )}
      </ReactModal>
    </>
  );
};

export default IllustrationsSection;
