import * as React from "react";
import styles from "../styles/About.module.scss";

const About = ({ profile }: { profile: string }) => {
  const description = (
    <div
      className={styles.description}
      dangerouslySetInnerHTML={{
        __html: profile,
      }}
    ></div>
  );
  return (
    <section id="about-section">
      <div id={styles.aboutContainer}>
        <div className={styles.iconContainer + " left-about"}>
          <img
            className={styles.icon}
            src="/icon.webp"
            alt={"粉鶴亀のアイコン"}
            width={"333px"}
            height={"333px"}
            loading="lazy"
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
            src="/transparent_icon.webp"
            alt={"粉鶴亀のアイコン"}
            width={"200px"}
            height={"200px"}
            loading="lazy"
          />
        </div>
        <div className={styles.descriptionContainer}>{description}</div>
      </div>
    </section>
  );
};

export default About;
