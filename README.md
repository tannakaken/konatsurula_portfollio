This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## ヘッダー画像の加工

ヘッダー画像の加工は

    convert header.PNG header.webp
    convert header_nochar.PNG header_nochar.webp
    convert header_nochar.PNG -colorspace GRAY header_gray.webp
    convert header_grat.PNG -negate header_nega.webp

と行う。

## loading="lazy"について

使用している scrollreveal と loading="lazy"の相性が悪いので、設定していない。

# scrollreveal のライセンスについて

scrollreveal は商用利用で、ソースコードをプライベートにするためには料金を払う必要がある。

しかし、ソースコードを GNU General Public License 3.0 で公開すれば無料で使える。

https://github.com/jlmakes/scrollreveal
