import { createClient } from "microcms-js-sdk";
import { GetStaticProps } from "next";
import { ParsedUrlQuery } from "querystring";
import * as React from "react";
import { Illustration } from "../models";
import CustomHead from "./components/CustomHead";
import Header from "./components/header";
import styles from "../styles/Home.module.scss";
import IllustrationsSection from "../static-components/illustrations";
import Footer from "./components/footer";
import ContactForm from "./components/contact-form";
import { useEffect } from "react";
import { pageView } from "../helpers/ga.helper";

interface Params extends ParsedUrlQuery {}

type Props = {
  illustrations: Illustration[];
  illustrations3D: Illustration[];
};

export const getStaticProps: GetStaticProps<Props, Params> = async (_) => {
  const client = createClient({
    serviceDomain: "konatsuruka",
    apiKey: process.env.NEXT_PUBLIC_MICRO_CMS_API_KEY || "",
  });
  const allIllustrations = (
    await client.get<{ contents: Illustration[] }>({
      endpoint: "illusts?limit=1000",
    })
  ).contents;
  const illustrations = allIllustrations.filter((item) => !item.is3D);
  const illustrations3D = allIllustrations.filter((item) => item.is3D);

  return {
    props: {
      illustrations,
      illustrations3D,
    },
  };
};

const MyWorks = ({ illustrations, illustrations3D }: Props) => {
  useEffect(() => {
    const animate = async () => {
      const sr = (await import("scrollreveal")).default();
      sr.reveal(".illustration-image", { reset: true });
    };
    animate().catch((error) => console.warn(error));
  }, []);
  useEffect(() => {
    pageView("自主制作ページ", "/");
  }, []);
  return (
    <div id="container">
      <CustomHead
        title={"粉鶴亀のポートフォリオサイト"}
        description={
          "アニメーター粉鶴亀（こなつるか）のポートフォリオサイトです。関わったアニメ作品へのリンクやイラストなどが含まれています。このサイトから仕事の依頼をすることもできます。"
        }
        author={"tannakaken"}
        keyword={"アニメ,animation,MV,イラスト,illustration,マンガ,manga"}
        domain={"www.konatsuruka.online"}
        url={"https://www.konatsuruka.online"}
        image={"https:///www.konatsuruka.online/header.webp"}
      />
      <Header />
      <main className={styles.main}>
        <div className={styles.mainHeader}>
          <div className={styles.mainHeaderPhone}>
            <div className={styles.mainHeaderPhoneClip}>
              <img src="./header.webp" alt="" />
            </div>
          </div>
        </div>
        <IllustrationsSection
          illustrations={illustrations}
          illustrations3D={illustrations3D}
        />
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
};

export default MyWorks;
