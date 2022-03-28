import * as React from "react";
import { useState } from "react";
import styles from "../../styles/Home.module.scss";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

const ContactForm = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [requestType, setRequestType] = useState("MV");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const { executeRecaptcha } = useGoogleReCaptcha();
  return (
    <>
      <div>
        <label htmlFor={"email"}>メールアドレス:</label>
        <input
          name={"email"}
          type={"email"}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          style={{
            width: "300px",
          }}
        />
      </div>
      <div>
        <label htmlFor={"email"}>{"　　　　"}お名前:</label>
        <input
          name={"name"}
          type={"name"}
          value={name}
          onChange={(event) => setName(event.target.value)}
          style={{
            width: "300px",
          }}
        />
      </div>
      <div>
        <span>お仕事内容:</span>
        <input
          type="radio"
          id="MV"
          name="MV"
          value="MV"
          checked={requestType === "MV"}
          onClick={() => setRequestType("MV")}
        />
        <label htmlFor="MV">MV</label>
        <input
          type="radio"
          id="TV"
          name="TV"
          value="TV"
          checked={requestType === "TV"}
          onClick={() => setRequestType("TV")}
        />
        <label htmlFor="TV">TVアニメ</label>
        <input
          type="radio"
          id="illustration"
          name="illustration"
          value="illustration"
          checked={requestType === "illustration"}
          onClick={() => setRequestType("illustration")}
        />
        <label htmlFor="illustration">イラスト・漫画</label>
      </div>
      <div>
        <label htmlFor={"body"}>本文：</label>
        <br />
        <textarea
          name={"body"}
          value={body}
          onChange={(event) => setBody(event.target.value)}
          style={{
            maxWidth: "410px",
            height: "200px",
          }}
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
            if (email.length === 0 || name.length === 0 || body.length === 0) {
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
                  body,
                  recaptchaToken,
                }),
              }
            )
              .then(() => {
                setBody("");
                setName("");
                setRequestType("MV");
                setEmail("");
                alert("送信しました");
                setSending(false);
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
            className={styles.linkStyle}
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noreferrer"
          >
            プライバシーポリシー
          </a>
          と
          <a
            className={styles.linkStyle}
            href="https://policies.google.com/terms"
            target="_blank"
            rel="noreferrer"
          >
            利用規約
          </a>
          が適用されます。
        </p>
      </div>
    </>
  );
};

export default ContactForm;
