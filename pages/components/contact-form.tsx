import * as React from "react";
import { useCallback, useRef, useState } from "react";
import commonStyles from "../../styles/Common.module.scss";
import styles from "../../styles/Contact.module.scss";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import ReactTooltip from "react-tooltip";

type RequestType = "MV" | "TV" | "Illustration" | "Manga" | "Other";
type Detail =
  | "CharacterDesign"
  | "KeyAnimation"
  | "BetweenAnimation"
  | "CleanUp";

const ContactForm = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [requestType, setRequestType] = useState<RequestType>("MV");
  const [details, setDetails] = useState<Detail[]>([]);
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const { executeRecaptcha } = useGoogleReCaptcha();
  const tooltipRef = useRef<HTMLImageElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleDetails = useCallback(
    (detail: Detail) => {
      if (details.includes(detail)) {
        setDetails(details.filter((item) => item !== detail));
      } else {
        setDetails([detail, ...details]);
      }
    },
    [details]
  );
  return (
    <section id="contact-section" className={styles.contactSection}>
      <hr style={{ width: "90%" }} />
      <h1>☆お仕事相談所☆</h1>
      <div className={styles.contactForm}>
        <div className={styles.information}>
          <img
            ref={tooltipRef}
            src={"information.png"}
            alt={"用途、予算、納品希望日、詳細……等をご入力ください。"}
            width={"20px"}
            height={"20px"}
            data-tip={
              "<div><div><p>・用途<br />・予算<br />・納品希望日<br />・詳細…等を<br />ご入力ください。</p></div><div><img src='contact.png' alt='お気楽にご相談ください。' /></div></div>"
            }
          />
          {isMounted && (
            <ReactTooltip
              border={true}
              borderColor={"black"}
              className={styles.tooltip}
              effect={"solid"}
              clickable={true}
              place={"left"}
              html={true}
              backgroundColor={"#f7e9ba"}
              textColor={"black"}
            />
          )}
        </div>
        <div className={styles.contactMain}>
          <div>
            <label className={styles.mailAddressLabel} htmlFor={"email"}>
              メールアドレス
            </label>
            :
            <input
              className={styles.input}
              name={"email"}
              type={"email"}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div>
            <label className={styles.nameLabel} htmlFor={"name"}>
              ご所属・お名前
            </label>
            :
            <input
              className={styles.input}
              name={"name"}
              type={"name"}
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>
          <div>
            <span className={styles.requestTypeLabel}>内容</span>:
            <input
              type="radio"
              id="MV"
              name="MV"
              value="MV"
              checked={requestType === "MV"}
              readOnly
              onClick={() => setRequestType("MV")}
            />
            <label htmlFor="MV">MV</label>
            <input
              type="radio"
              id="TV"
              name="TV"
              value="TV"
              checked={requestType === "TV"}
              readOnly
              onClick={() => {
                setRequestType("TV");
                setDetails(
                  details.filter((detail) => detail === "KeyAnimation")
                );
              }}
            />
            <label htmlFor="TV">TVアニメ</label>
            <input
              type="radio"
              id="Illustration"
              name="Illustration"
              value="Illustration"
              checked={requestType === "Illustration"}
              readOnly
              onClick={() => {
                setRequestType("Illustration");
                setDetails([]);
              }}
            />
            <label htmlFor="TV">イラスト</label>
            <input
              type="radio"
              id="Manga"
              name="Manga"
              value="Manga"
              checked={requestType === "Manga"}
              readOnly
              onClick={() => {
                setRequestType("Manga");
                setDetails([]);
              }}
            />
            <label htmlFor="Manga">マンガ</label>
            <input
              type="radio"
              id="Other"
              name="Other"
              value="Other"
              checked={requestType === "Other"}
              readOnly
              onClick={() => {
                setRequestType("Other");
                setDetails([]);
              }}
            />
            <label htmlFor="Other">その他</label>
          </div>
          <div style={{ textAlign: "center" }}>
            <input
              type="checkbox"
              id="CharacterDesign"
              name="CharacterDesign"
              value="CharacterDesign"
              checked={details.includes("CharacterDesign")}
              disabled={requestType !== "MV"}
              readOnly
              onClick={() => toggleDetails("CharacterDesign")}
            />
            <label
              style={{ color: requestType !== "MV" ? "gray" : "black" }}
              htmlFor="CharacterDesign"
            >
              キャラクターデザイン
            </label>
            <input
              type="checkbox"
              id="KeyAnimation"
              name="KeyAnimation"
              value="KeyAnimation"
              checked={details.includes("KeyAnimation")}
              disabled={requestType !== "MV" && requestType !== "TV"}
              readOnly
              onClick={() => toggleDetails("KeyAnimation")}
            />
            <label
              style={{
                color:
                  requestType !== "MV" && requestType !== "TV"
                    ? "gray"
                    : "black",
              }}
              htmlFor="KeyAnimation"
            >
              原画
            </label>
            <input
              type="checkbox"
              id="BetweenAnimation"
              name="BetweenAnimation"
              value="BetweenAnimation"
              checked={details.includes("BetweenAnimation")}
              disabled={requestType !== "MV"}
              readOnly
              onClick={() => toggleDetails("BetweenAnimation")}
            />
            <label
              style={{ color: requestType !== "MV" ? "gray" : "black" }}
              htmlFor="BetweenAnimation"
            >
              動画
            </label>
            <input
              type="checkbox"
              id="CleanUp"
              name="CleanUp"
              value="CleanUp"
              checked={details.includes("CleanUp")}
              disabled={requestType !== "MV"}
              readOnly
              onClick={() => toggleDetails("CleanUp")}
            />
            <label
              style={{ color: requestType !== "MV" ? "gray" : "black" }}
              htmlFor="CleanUp"
            >
              仕上げ
            </label>
          </div>
          <div>
            <label
              htmlFor={"body"}
              onClick={() => {
                if (tooltipRef.current) {
                  ReactTooltip.show(tooltipRef.current);
                }
              }}
            >
              本文：
            </label>
            <br />
            <textarea
              name={"body"}
              value={body}
              onChange={(event) => setBody(event.target.value)}
              className={styles.contactBody}
            />
          </div>
          <div className={styles.contactButtonContainer}>
            <button
              style={{ width: "80px" }}
              id={"contact-button"}
              onClick={async () => {
                if (sending) {
                  return;
                }
                if (
                  email.length === 0 ||
                  name.length === 0 ||
                  body.length === 0
                ) {
                  alert(
                    "メールアドレス・ご所属・お名前・本文をご記入ください。"
                  );
                  return;
                }
                if (executeRecaptcha === undefined) {
                  console.warn("undefined");
                  return;
                }
                const recaptchaToken = await executeRecaptcha("contactPage");
                setSending(true);
                fetch(
                  "https://8ikmquk2i4.execute-api.ap-northeast-1.amazonaws.com/send-mail-SES",
                  {
                    method: "POST",
                    mode: "cors",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      email,
                      name,
                      requestType,
                      details,
                      body,
                      recaptchaToken,
                    }),
                  }
                )
                  .then((response) => {
                    setBody("");
                    setName("");
                    setRequestType("MV");
                    setDetails([]);
                    setEmail("");
                    setSending(false);
                    if (response.status > 500) {
                      alert("サーバー側でエラーが発生しました。");
                    } else if (response.status === 400) {
                      alert("不正なリクエストが検知されました。");
                    } else {
                      alert("送信しました");
                    }
                  })
                  .catch((error) => {
                    alert(error);
                    setSending(false);
                  });
              }}
            >
              送信
            </button>
            <p className={styles.googleRecaptchaNotice}>
              このサイトはreCAPTCHAとGoogleとによって保護されています。
              <a
                className={commonStyles.linkStyle}
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noreferrer"
              >
                プライバシーポリシー
              </a>
              と
              <a
                className={commonStyles.linkStyle}
                href="https://policies.google.com/terms"
                target="_blank"
                rel="noreferrer"
              >
                利用規約
              </a>
              が適用されます。
            </p>
          </div>
        </div>
        <img
          className={styles.contactImage}
          src={"contact.png"}
          width={"220px"}
          alt={"お気楽にご相談ください。"}
        />
      </div>
      {sending && (
        <img
          style={{ animation: "3s linear infinite rotation" }}
          className={styles.sending}
          src={"favicon.png"}
          width={"50px"}
          alt={"送信中"}
        />
      )}
    </section>
  );
};

export default ContactForm;
