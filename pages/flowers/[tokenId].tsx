import type { NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import Head from "next/head";
import useSWR from "swr";
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

  // TODO: Figure out how to render animated svgs into canvas
  // const canvasRef = useRef<HTMLCanvasElement>(null);
  // const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

  // useEffect(() => {
  //   const image = new Image(2000, 2000);

  //   if (canvasRef.current && flower) {
  //     const renderCtx = canvasRef.current.getContext("2d");
  //     image.onload = draw;
  //     image.src = flower.image.base64;

  //     if (renderCtx) {
  //       setContext(renderCtx);
  //     }
  //   }

  //   function draw() {
  //     if (context) {
  //       // draw the ting
  //       context.drawImage(image, 0, 0, 500, 500);
  //     }
  //   }
  // }, [context, flower]);

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
              {/* <canvas
                className="hidden"
                ref={canvasRef}
                width={500}
                height={500}
              /> */}

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
