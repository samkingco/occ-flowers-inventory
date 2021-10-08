import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/dist/client/router";
import { fetcher, FetchError } from "../../utils";
import { FlowerResponse } from "../api/flowers/[tokenId]";

const Flower: NextPage = () => {
  const router = useRouter();
  const tokenIdFromRouter = router.query.tokenId;
  const { data, error } = useSWR<FlowerResponse, FetchError>(
    `/api/flowers/${tokenIdFromRouter}`,
    fetcher
  );

  const isLoading = !data && !error;
  const flower = data;
  const openSeaLink = `https://opensea.io/assets/0x5a876ffc6e75066f5ca870e20fca4754c1efe91f/${
    flower && flower.tokenId
  }`;

  return (
    <div className="page">
      <Head>
        <title>Flower #{tokenIdFromRouter} • OCC #1 Flowers</title>
        <meta
          name="description"
          content="The garden is a WIP ranking tool for OCC#1 🌺 Flowers. On-chain flower NFTs for you to own or to share."
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </Head>

      <main className="main">
        {!flower ? (
          <div className="center-content">
            {isLoading ? <p>Loading…</p> : <p>No flower found :(</p>}
          </div>
        ) : (
          <>
            <article className="flower-detail">
              <a href={openSeaLink} className="flower">
                <img
                  src={flower.image.base64}
                  alt={`Flower #${flower.tokenId}`}
                />
              </a>

              <div className="flower-attributes">
                <h1 className="font-snell flower-page-title">
                  #{flower.tokenId}
                </h1>
                <p className="subdued">Rank {flower.rank}</p>

                <dl>
                  <dt>Petal style</dt>
                  <dd>{flower.attributes["petal-style"]}</dd>
                  <dt>Petal color</dt>
                  <dd>{flower.attributes["petal-color"]}</dd>
                  <dt>No. of petals</dt>
                  <dd>{flower.attributes["no-of-petals"]}</dd>
                  <dt>Core size</dt>
                  <dd>{flower.attributes["core-size"]}</dd>
                  <dt>Background color</dt>
                  <dd>{flower.attributes["bg-color"]}</dd>
                  <dt>Background overlay</dt>
                  <dd>{flower.attributes["bg-overlay"]}</dd>
                  <dt>Background type</dt>
                  <dd>{flower.attributes["bg-type"]}</dd>
                  <dt>Mutation</dt>
                  <dd>{flower.attributes.mutation}</dd>
                  <dt>Spins?</dt>
                  <dd>{flower.attributes.spin ? "Yes" : "No"}</dd>
                </dl>

                <a className="button" href={openSeaLink}>
                  View on OpenSea
                </a>
              </div>
            </article>
          </>
        )}
      </main>
    </div>
  );
};

export default Flower;
