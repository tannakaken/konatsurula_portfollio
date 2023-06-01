import "../styles/YouTube.module.scss";
import youTubeStyles from "../styles/YouTube.module.scss";
import styles from "../styles/Home.module.scss";
import { Illustration } from "../models";
import { useCallback, useEffect, useMemo, useState } from "react";
import ReactModal from "react-modal";
import { trackingEvent } from "../helpers/ga.helper";

const IllustrationsSection = ({
  illustrations,
  illustrations3D,
}: {
  illustrations: Illustration[];
  illustrations3D: Illustration[];
}) => {
  const [selectedIllustration, setSelectedIllustration] = useState<
    Illustration | undefined
  >(undefined);
  /**
   * ここではイラストのアニメーションはさせる。
   * scrollrevealのアニメーションのためにはエレメントの高さなどが必要だが
   * ロードが終わらないと高さが決まらない。
   * なのでロード後にアニメーションを開始する。
   * see https://github.com/jlmakes/scrollreveal/issues/298
   */
  const animate = useCallback(async () => {
    const sr = (await import("scrollreveal")).default();
    sr.reveal(".illustration-image", {
      reset: true,
      scale: 0.5,
    });
    sr.reveal(".illustration-image-3d", {
      reset: true,
      scale: 0.8,
      rotate: {
        y: 180,
      },
      duration: 2000,
    });
  }, []);
  useEffect(() => {
    animate().catch((error) => console.warn(error));
  }, [animate]);
  const onLoadSingleImage = useCallback(() => {
    animate().catch((error) => console.warn(error));
  }, [animate]);
  return (
    <>
      <section className={styles.section} id="illusts-section">
        {/* <header className={styles.sectionHeader} id={styles.illustHeader}>
          <h1>自主制作</h1>
        </header> */}
        <section>
          <header className={styles.sectionHeader} id={styles.illustHeader}>
            <h1>イラスト</h1>
          </header>
          <div className={styles.sectionContainer}>
            <div className={styles.illustrations}>
              {illustrations.map((illustration) => (
                <img
                  onClick={() => {
                    trackingEvent("Illustration", illustration.title);
                    setSelectedIllustration(illustration);
                  }}
                  className={styles.illustration + " illustration-image"}
                  alt={illustration.title}
                  src={illustration.image.url + "?w=300&fm=webp"}
                  key={illustration.id}
                  onLoad={onLoadSingleImage}
                />
              ))}
            </div>
          </div>
        </section>
        <section>
          <header className={styles.sectionHeader} id={styles.illustHeader}>
            <h1>3Dイラスト</h1>
          </header>
          <div className={styles.sectionContainer}>
            <div className={styles.illustrations}>
              {illustrations3D.map((illustration) => (
                <img
                  onClick={() => {
                    trackingEvent("Illustration3D", illustration.title);
                    setSelectedIllustration(illustration);
                  }}
                  className={styles.illustration + " illustration-image-3d"}
                  alt={illustration.title}
                  src={illustration.image.url + "?w=300&fm=webp"}
                  key={illustration.id}
                  onLoad={onLoadSingleImage}
                />
              ))}
            </div>
          </div>
        </section>
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
        <div>
          <p>無断転載禁止/Do not repost without my permission.</p>
        </div>
      </ReactModal>
    </>
  );
};

export default IllustrationsSection;
