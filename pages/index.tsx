import { useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import useSWR from "swr";
import { FlowerResponse } from "./api/flowers";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

// const getKey = (pageIndex: number, previousPageData) => {
//   if (previousPageData && !previousPageData.length) return null // reached the end
//   return `/users?page=${pageIndex}&limit=10`                    // SWR key
// }

interface ResultsPageProps {
  index: number;
  pageSize: number;
}

function ResultsPage({ index, pageSize }: ResultsPageProps) {
  const { data } = useSWR<FlowerResponse>(
    `/api/flowers?limit=${pageSize}&cursor=${index * pageSize}`,
    fetcher
  );

  if (!data) {
    // TODO: handle loading state
    return null;
  }

  return (
    <>
      {data.map((result) => {
        const openSeaLink = `https://opensea.io/assets/0x5a876ffc6e75066f5ca870e20fca4754c1efe91f/${result.tokenId}`;

        return (
          <div className="flower" key={result.tokenId}>
            <a href={openSeaLink}>
              <img src={result.image} />
            </a>
            <p className="flower-meta">
              <a href={openSeaLink}>#{result.tokenId}</a>{" "}
              <span className="subdued">Rank {result.rank}</span>
            </p>
          </div>
        );
      })}
    </>
  );
}

const Home: NextPage = () => {
  const [pageCount, setPageCount] = useState(1);

  const pages = [];
  for (let i = 0; i < pageCount; i++) {
    pages.push(<ResultsPage key={i} index={i} pageSize={60} />);
  }

  return (
    <div className="page">
      <Head>
        <title>Flower garden</title>
        <meta
          name="description"
          content="All the on chain flowers with their ranks"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="main">
        <article className="intro">
          <h1 className="font-snell">the garden</h1>
          <p>
            The garden is a WIP ranking tool for{" "}
            <a href="https://www.occ.xyz/flowers">OCC#1 🌺 Flowers</a>. Filters
            and search coming soon. Ranks are based on the probability of each
            flower's traits. Contribute on{" "}
            <a href="https://https://github.com/samkingco/occ-flowers-rarity">
              GitHub
            </a>
            .
          </p>
        </article>

        <article className="flower-grid">{pages}</article>

        <div className="center-content">
          <button onClick={() => setPageCount(pageCount + 1)}>Load More</button>
        </div>
      </main>
    </div>
  );
};

export default Home;
