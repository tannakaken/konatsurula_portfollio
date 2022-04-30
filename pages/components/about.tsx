import * as React from "react";
import styles from "../../styles/About.module.scss";
import commonStyles from "../../styles/Common.module.scss";

const About = ({profile}: {profile: string}) => {
  const description = (
    <div className={styles.description} dangerouslySetInnerHTML={{
      __html: profile
    }}>
      {/* <p>アニメーター・イラストレーター</p>
      <p className={styles.name}>粉鶴亀（KONATSURUKA）</p>
      <p>主な仕事</p>
      <ul>
        <li>ミュージックビデオ作画全般</li>
        <li>テレビアニメ原画</li>
        <li>イラスト・マンガ作画</li>
      </ul>
      <p>
        Twitter
        :
        <a
          className={commonStyles.linkStyle}
          href="https://twitter.com/sashimi0404"
        >
          @sashimi0404
        </a>
      </p> */}
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
