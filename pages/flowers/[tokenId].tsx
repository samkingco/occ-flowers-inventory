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
          <div className="intro">
            {isLoading ? <p>Loading…</p> : <p>No flower found :(</p>}
          </div>
        ) : (
          <>
            <div className="intro">
              <h1 className="flower-page-title">Flower #{flower.tokenId}</h1>
              <p className="subdued">Rank {flower.rarity.probability.rank}</p>
            </div>
            <article className="flower-detail">
              <a href={openSeaLink} className="flower">
                <img
                  src={`https://ipfs.io/ipfs/${flower.image.svg}`}
                  alt={`Flower #${flower.tokenId}`}
                  width="500"
                  height="500"
                />
              </a>

              <dl className="flower-attributes">
                <div>
                  <dt>Petal style</dt>
                  <dd>{flower.attributes.petalStyle}</dd>
                </div>
                <div>
                  <dt>Petal color</dt>
                  <dd>{flower.attributes.petalColor}</dd>
                </div>
                <div>
                  <dt>No. of petals</dt>
                  <dd>{flower.attributes.noOfPetals}</dd>
                </div>
                <div>
                  <dt>Core size</dt>
                  <dd>{flower.attributes.coreSize}</dd>
                </div>
                <div>
                  <dt>Mutation</dt>
                  <dd>{flower.attributes.mutation}</dd>
                </div>
                <div>
                  <dt>Background type</dt>
                  <dd>{flower.attributes.bgType}</dd>
                </div>
                <div>
                  <dt>Background color</dt>
                  <dd>{flower.attributes.bgColor}</dd>
                </div>
                <div>
                  <dt>Background overlay</dt>
                  <dd>{flower.attributes.bgOverlay}</dd>
                </div>
                <div>
                  <dt>Spins?</dt>
                  <dd>{flower.attributes.spin ? "Yes" : "No"}</dd>
                </div>
              </dl>

              <div
                className={`flower-buttons ${
                  flower.image.gif ? "has-gif" : ""
                }`}
              >
                <a
                  className="button"
                  href={`https://ipfs.io/ipfs/${flower.image.png}`}
                  target="_blank"
                  download={`${flower.tokenId}.png`}
                >
                  PNG
                </a>

                {flower.image.gif && (
                  <a
                    className="button"
                    href={`https://ipfs.io/ipfs/${flower.image.gif}`}
                    target="_blank"
                    download={`${flower.tokenId}.gif`}
                  >
                    GIF
                  </a>
                )}

                <a className="button" href={openSeaLink}>
                  OpenSea
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
