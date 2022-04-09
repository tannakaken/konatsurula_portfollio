import * as React from "react";
import styles from "../../styles/About.module.scss";
import commonStyles from "../../styles/Common.module.scss";

const About = () => {
  const description = (
    <div className={styles.description}>
      <p>アニメーター・イラストレーター</p>
      <p className={styles.name}>粉鶴亀（KONATSURUKA）</p>
      <p>ミュージックビデオ作画全般</p>
      <p>テレビアニメ原画</p>
      <p>イラスト・マンガ作画</p>
      <p>
        連絡先:
        <a
          className={commonStyles.linkStyle}
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
          className={commonStyles.linkStyle}
          href="https://twitter.com/sashimi0404"
        >
          @sashimi0404
        </a>
      </p>
      <p>
        Pixiv（版権絵置き場）:
        <a
          className={commonStyles.linkStyle}
          href="https://www.pixiv.net/users/2157406"
        >
          海老蔵
        </a>
      </p>
    </div>
  );
  return (
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
          {description}
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
        <div className={styles.descriptionContainer}>{description}</div>
      </div>
    </section>
  );
};

export default About;
