import "../styles/YouTube.module.scss";
import youTubeStyles from "../styles/YouTube.module.scss";
import styles from "../styles/Home.module.scss";
import { MyWork } from "../models";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactModal from "react-modal";
import { trackingEvent } from "../helpers/ga.helper";
import YouTube from "react-youtube";
import { youtupeOption } from "./constants";

type SurelyOnLoadImageProps = {
  alt: string;
  onClick?: () => void;
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

/**
 * 自主制作物のセクション
 */
const MyWorksSection = ({
  myYoutubes,
  myMovies,
  illustrations,
  illustrations3D,
}: {
  myYoutubes: MyWork[];
  myMovies: MyWork[];
  illustrations: MyWork[];
  illustrations3D: MyWork[];
}) => {
  const [selectedMyWork, setSelectedMyWork] = useState<MyWork | undefined>(
    undefined
  );
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
  const [showNotice, setShowNotice] = useState(false);
  const [loadingSelectedIllustration, setLoadingSelectedIllustration] =
    useState(false);
  const onAfterOpen = useCallback(() => {
    setShowNotice(true);
  }, []);
  const close = useCallback(() => {
    setSelectedMyWork(undefined);
    setShowNotice(false);
  }, []);
  const loadedSelectedIllustration = useCallback(() => {
    setLoadingSelectedIllustration(false);
  }, []);

  return (
    <>
      <section className={styles.section} id="illusts-section">
        {(myYoutubes.length > 0 || myMovies.length > 0) && (
          <section>
            <header className={styles.sectionHeader} id={styles.illustHeader}>
              <h1>自主制作動画</h1>
            </header>
            <div className={styles.sectionContainer}>
              {myYoutubes.map((youtube, index) => (
                <img
                  onClick={() => {
                    trackingEvent("Movie", youtube.title);
                    setSelectedMyWork(youtube);
                  }}
                  alt={youtube.title}
                  src={`https://img.youtube.com/vi/${youtube.youtubeId}/hqdefault.jpg`}
                  key={youtube.id}
                  className={styles.work + " works-image-" + (index % 4)}
                />
              ))}
              {myMovies.map((myMovie, index) => (
                <img
                  onClick={() => {
                    trackingEvent("Movie", myMovie.title);
                    setSelectedMyWork(myMovie);
                  }}
                  alt={myMovie.title}
                  src={myMovie.image?.url + "?w=300&fm=webp"}
                  key={myMovie.id}
                  className={
                    styles.work +
                    " works-image-" +
                    ((myYoutubes.length + index) % 4)
                  }
                />
              ))}
            </div>
          </section>
        )}
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
                    setSelectedMyWork(illustration);
                    setLoadingSelectedIllustration(true);
                  }}
                  className={styles.illustration + " illustration-image"}
                  alt={illustration.title}
                  src={illustration.image?.url + "?w=300&fm=webp"}
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
                    setSelectedMyWork(illustration);
                  }}
                  className={styles.illustration + " illustration-image-3d"}
                  alt={illustration.title}
                  src={illustration.image?.url + "?w=300&fm=webp"}
                  key={illustration.id}
                  onLoad={onLoadSingleImage}
                />
              ))}
            </div>
          </div>
        </section>
      </section>
      <ReactModal
        contentLabel="MyWork Modal"
        isOpen={
          selectedMyWork !== undefined && selectedMyWork.youtubeId === undefined
        }
        onAfterOpen={onAfterOpen}
        shouldCloseOnEsc={true}
        onRequestClose={close}
        closeTimeoutMS={500}
        portalClassName="MyWorkModalPortal"
      >
        <div className={youTubeStyles.header}>
          <h2>{selectedMyWork?.title}</h2>
          <a className={youTubeStyles.closeButton} onClick={close}>
            ×close
          </a>
        </div>
        {selectedMyWork !== undefined && (
          <div className={styles.fullIllustrationContainer}>
            {selectedMyWork.videoPath === undefined && selectedMyWork.image ? (
              <SurelyOnLoadImage
                src={selectedMyWork.image.url + "?fm=webp"}
                alt={selectedMyWork.title}
                className={styles.fullIllustration}
                onLoad={loadedSelectedIllustration}
              />
            ) : (
              <video
                className={styles.video}
                controls
                src={
                  process.env.NEXT_PUBLIC_CLOUD_FRONT_ORIGIN +
                  "/" +
                  selectedMyWork.videoPath
                }
              />
            )}
          </div>
        )}
        <div>
          {showNotice && (
            <p>無断転載禁止/Do not repost without my permission.</p>
          )}
        </div>
        {loadingSelectedIllustration && (
          <img
            style={{ animation: "3s linear infinite rotation" }}
            className={styles.loading}
            src={"favicon.webp"}
            width={"50px"}
            alt={"画像ダウンロード中"}
          />
        )}
      </ReactModal>
      <ReactModal
        contentLabel="YouTube Modal"
        isOpen={
          selectedMyWork !== undefined && selectedMyWork.youtubeId !== undefined
        }
        shouldCloseOnEsc={true}
        onRequestClose={close}
        onAfterClose={onAfterOpen}
        closeTimeoutMS={500}
        portalClassName="YoutubeModalPortal"
      >
        <div className={youTubeStyles.header}>
          <h2>{selectedMyWork?.title}</h2>
          <a className={youTubeStyles.closeButton} onClick={close}>
            ×close
          </a>
        </div>
        <p className={youTubeStyles.youtubeDescription}>
          {selectedMyWork?.description}
        </p>
        {selectedMyWork !== undefined && (
          <YouTube
            opts={youtupeOption}
            loading="lazy"
            className={youTubeStyles.iframe}
            containerClassName={youTubeStyles.youtube}
            videoId={selectedMyWork?.youtubeId}
          />
        )}
      </ReactModal>
    </>
  );
};

export default MyWorksSection;
