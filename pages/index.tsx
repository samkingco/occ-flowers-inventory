import { useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import useSWRInfinite from "swr/infinite";
import { KeyLoader } from "swr";
import { fetcher, FetchError, isValidAddress } from "../utils";
import { FlowersResponse } from "./api/flowers";
import { Flower } from "occ-flowers-sdk/dist/types";

const getKey: (
  limit: number,
  tokenIds: string[],
  walletAddress: string
) => KeyLoader<FlowersResponse> =
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

  const PAGE_SIZE = 60;
  const { data, error, size, setSize } = useSWRInfinite<
    FlowersResponse,
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
            <a href="https://www.occ.xyz/flowers">OCC#1 🌺 Flowers</a>.
          </p>
          <p>
            Ranking is purely mathematical based on traits, not vibes. We think
            you should enjoy the flowers you love regardless of their rarity.
          </p>
          <p>💮👄💮</p>
          <p>
            Contribute on{" "}
            <a href="https://github.com/samkingco/occ-flowers-rarity">GitHub</a>
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
            {flowers.map((flower) => (
              <div className="flower" key={flower.tokenId}>
                <Link href={`/flowers/${flower.tokenId}`}>
                  <a>
                    <img
                      src={`https://ipfs.io/ipfs/${flower.image.svg}`}
                      alt={`Flower #${flower.tokenId}`}
                      width="500"
                      height="500"
                    />
                  </a>
                </Link>
                <p className="flower-meta">
                  <Link href={`/flowers/${flower.tokenId}`}>
                    <a>Flower #{flower.tokenId}</a>
                  </Link>
                </p>
                <p className="flower-meta subdued">
                  Rank {flower.rarity.probability.rank}
                </p>
              </div>
            ))}
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
