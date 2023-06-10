import * as React from "react";
import styles from "../../styles/Header.module.scss";
import Link from "next/link";
import { Link as ScrollLink } from "react-scroll/modules";
import { useEffect, useState } from "react";
import * as Scroll from "react-scroll";

const Header = () => {
  const [checked, setChecked] = useState(false);
  useEffect(() => {
    const Events = Scroll.Events;
    Events.scrollEvent.register("end", () => {
      setChecked(false);
    });
    return () => {
      Events.scrollEvent.remove("end");
    };
  }, []);
  const links = (
    <ul>
      <li className={styles.navItem}>
        <ScrollLink to="news-section" smooth={true}>
          ニュース
        </ScrollLink>
      </li>
      <li className={styles.navItem}>
        <ScrollLink to="about-section" smooth={true}>
          アバウト
        </ScrollLink>
      </li>
      <li className={styles.navItem}>
        <ScrollLink to="works-section" smooth={true}>
          お仕事
        </ScrollLink>
      </li>
      <li className={styles.navItem}>
        <ScrollLink to="illusts-section" smooth={true}>
          自主制作
        </ScrollLink>
      </li>
      <li className={styles.navItem}>
        <ScrollLink to="contact-section" smooth={true}>
          お仕事相談所
        </ScrollLink>
      </li>
    </ul>
  );
  return (
    <>
      <input
        id={styles.drawerInput}
        className={styles.drawerHidden}
        type="checkbox"
        checked={checked}
        onChange={() => setChecked(!checked)}
      />
      <header className={styles.header}>
        <h1 id="title" className={styles.headerTitle}>
          <Link href="/">粉鶴亀のポートフォリオサイト</Link>
        </h1>
        <nav className={styles.globalNavi}>{links}</nav>
        <label htmlFor={styles.drawerInput} className={styles.drawerOpen}>
          <span />
        </label>
      </header>
      <nav className={styles.globalNaviPhone}>{links}</nav>
    </>
  );
};

export default Header;
