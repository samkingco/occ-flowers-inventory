import { useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import useSWRInfinite from "swr/infinite";
import { KeyLoader } from "swr";
import { Flower, FlowerResponse, isValidAddress } from "../utils";

interface FetchError extends Error {
  status: number;
}

async function fetcher(url: string) {
  const res = await fetch(url);
  if (!res.ok) {
    const error = new Error(
      "An error occurred while fetching the data."
    ) as FetchError;
    error.message = await res.json();
    error.status = res.status;
    throw error;
  }
  return res.json();
}

const getKey: (
  limit: number,
  tokenIds: string[],
  walletAddress: string
) => KeyLoader<FlowerResponse> =
  (limit, tokenIds, walletAddress) => (_, previousPageData) => {
    if (previousPageData && !previousPageData.hasNextPage) return null;

    const queryParams = new URLSearchParams();
    queryParams.set("limit", limit.toString());
    if (previousPageData && previousPageData.nextCursor) {
      queryParams.set("cursor", previousPageData.nextCursor.toString());
    }
    if (walletAddress && isValidAddress(walletAddress)) {
      queryParams.set("walletAddress", walletAddress);
    } else {
      tokenIds.forEach((tokenId) => {
        queryParams.append("tokenId", tokenId);
      });
    }

    return `/api/flowers?${queryParams.toString()}`;
  };

const Home: NextPage = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const validWallet = isValidAddress(walletAddress);

  const [searchTerm, setSearchTerm] = useState("");
  const tokenIds = searchTerm ? searchTerm.split(",").map((i) => i.trim()) : [];

  const PAGE_SIZE = 12;
  const { data, error, size, setSize } = useSWRInfinite<
    FlowerResponse,
    FetchError
  >(getKey(PAGE_SIZE, tokenIds, walletAddress), fetcher);

  const flowers = data
    ? data.reduce((acc: Flower[], page) => [...acc, ...page.flowers], [])
    : [];
  const isLoadingInitialData = !data && !error;
  const isLoadingMore = Boolean(
    isLoadingInitialData ||
      (size > 0 && data && typeof data[size - 1] === "undefined")
  );
  const isEmpty = data && data[0]?.flowers.length === 0;
  const hasReachedEnd =
    isEmpty || !(data && data[data.length - 1]?.hasNextPage);

  return (
    <div className="page">
      <Head>
        <title>The Garden • OCC #1 Flowers</title>
        <meta
          name="description"
          content="The garden is a WIP ranking tool for OCC#1 🌺 Flowers. On-chain flower NFTs for you to own or to share."
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </Head>

      <main className="main">
        <article className="intro">
          <h1 className="font-snell">the garden</h1>
          <p>
            The garden is a WIP rarity tool for{" "}
            <a href="https://www.occ.xyz/flowers">OCC#1 🌺 Flowers</a>.<br />
            Ranking is purely mathematical based on traits, not vibes. We think
            you should enjoy the flowers you love regardless of their rarity.
          </p>
          <p>💮👄💮</p>
          <p>
            Contribute on{" "}
            <a href="https://https://github.com/samkingco/occ-flowers-rarity">
              GitHub
            </a>
            .
          </p>
        </article>

        <div className="center-content">
          <div className="input-containers">
            <input
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.currentTarget.value)}
              placeholder="Wallet address"
            />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.currentTarget.value)}
              placeholder="Search for flower IDs"
              disabled={Boolean(walletAddress && validWallet)}
            />
          </div>
        </div>

        {isEmpty ? (
          <div className="center-content">
            <p>No flowers found :(</p>
          </div>
        ) : (
          <article className="flower-grid">
            {flowers.map((flower) => {
              const openSeaLink = `https://opensea.io/assets/0x5a876ffc6e75066f5ca870e20fca4754c1efe91f/${flower.tokenId}`;

              return (
                <div className="flower" key={flower.tokenId}>
                  <a href={openSeaLink}>
                    <img src={flower.image} alt={`Flower #${flower.tokenId}`} />
                  </a>
                  <p className="flower-meta">
                    <a href={openSeaLink}>#{flower.tokenId}</a>{" "}
                    <span className="subdued">Rank {flower.rank}</span>
                  </p>
                </div>
              );
            })}
          </article>
        )}

        {!hasReachedEnd && (
          <div className="center-content">
            <button onClick={() => setSize(size + 1)} disabled={isLoadingMore}>
              Explore more flowers
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
