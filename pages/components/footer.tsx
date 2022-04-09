import * as React from "react";
import styles from "../../styles/Footer.module.scss";
import { useCallback, useEffect, useMemo, useState } from "react";

const Footer = () => {
  const [animation, setAnimation] = useState<"3s linear rotation" | "unset">(
    "unset"
  );
  const toggleAnimation = useCallback(() => {
    if (animation === "unset") {
      setAnimation("3s linear rotation");
    } else {
      setAnimation("unset");
    }
  }, [animation]);
  const timeouts = useMemo(
    () => [1000 * 3, 1000 * 60, 1000 * 60 * 5, 1000 * 60 * 10, 1000 * 60 * 15],
    []
  );
  const timeout = useCallback(
    () => timeouts[Math.floor(Math.random() * timeouts.length)],
    [timeouts]
  );
  useEffect(() => {
    setTimeout(() => {
      toggleAnimation();
    }, timeout());
  }, [toggleAnimation, timeout]);
  return (
    <footer className={styles.footer}>
      <p>
        Copyright(c)2022 粉鶴亀(KONATSURUKA). All Rights Reserved{" "}
        <span className={styles.logo}>
          <img
            src="favicon.png"
            alt="ebi logo"
            width={32}
            height={32}
            style={{ animation }}
          />
        </span>
      </p>
      <p>
        Created By <a href={"https://twitter.com/tannakaken"}>Tannakaken</a>
      </p>
    </footer>
  );
};

export default Footer;
