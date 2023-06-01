import "../styles/YouTube.module.scss";
import youTubeStyles from "../styles/YouTube.module.scss";
import styles from "../styles/Home.module.scss";
import { Illustration } from "../models";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactModal from "react-modal";
import { trackingEvent } from "../helpers/ga.helper";

type SurelyOnLoadImageProps = {
  alt: string;
  onClick: () => void;
  className: string;
  src: string;
  onLoad: () => void;
};

/**
 * 画像をロードしたらonLoadがcallされるが、
 * 画像をブラウザがキャッシュしていた場合onLoadは呼ばれない。
 * その時は、レンダリング時にすでに画像の高さが分かっているので、
 * それによってonLoadを発火させる。
 * onLoadは一度しか発火しない。
 */
const SurelyOnLoadImage = ({
  onClick,
  onLoad,
  className,
  alt,
  src,
}: SurelyOnLoadImageProps) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);
  const onLoadAndSetLoaded = useCallback(() => {
    if (!loaded) {
      onLoad();
      setLoaded(true);
    }
  }, [onLoad, loaded]);
  useEffect(() => {
    if (imageRef.current?.height) {
      onLoadAndSetLoaded();
    }
  }, [onLoadAndSetLoaded]);
  return (
    <img
      ref={imageRef}
      onClick={onClick}
      className={className}
      alt={alt}
      src={src}
      onLoad={onLoadAndSetLoaded}
    />
  );
};

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
  const [loadedImageCount, setLoadedImageCount] = useState(0);
  useEffect(() => {
    // 全ての画像がロード後にアニメーションを開始する。
    if (loadedImageCount === illustrations.length + illustrations3D.length) {
      animate().catch((error) => console.warn(error));
    }
  }, [loadedImageCount, animate, illustrations, illustrations3D]);
  /**
   * 画像をロードしたら、ロードした画像のカウントを一つ増やす
   */
  const onLoadSingleImage = useCallback(() => {
    setLoadedImageCount((prev) => prev + 1);
  }, []);
  const close = useCallback(() => {
    setSelectedIllustration(undefined);
  }, []);

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
                <SurelyOnLoadImage
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
                <SurelyOnLoadImage
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
        onRequestClose={close}
        closeTimeoutMS={500}
        portalClassName="IllustrationModalPortal"
      >
        <div className={youTubeStyles.header}>
          <h2>{selectedIllustration?.title}</h2>
          <a className={youTubeStyles.closeButton} onClick={close}>
            ×close
          </a>
        </div>
        {selectedIllustration !== undefined && (
          <div className={styles.fullIllustrationContainer}>
            <img
              src={selectedIllustration.image.url + "?fm=webp"}
              alt={selectedIllustration.title}
              className={styles.fullIllustration}
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
