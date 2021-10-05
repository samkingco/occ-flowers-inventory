import type { NextApiRequest, NextApiResponse } from "next";
import { contract } from "../../data/contract";
import rankedFlowersData from "../../data/ranked-flower-images.json";
import { Flower, FlowerResponse, isValidAddress } from "../../utils";

export interface FlowerResponseError {
  message: string;
  status: number;
}

const rankedFlowers = rankedFlowersData as Flower[];

export default async (
  req: NextApiRequest,
  res: NextApiResponse<FlowerResponse | FlowerResponseError>
) => {
  const tokenIds = req.query.tokenId;
  const limit = req.query.limit as string;
  const cursor = req.query.cursor as string;
  const walletAddress = req.query.walletAddress as string;

  if (!limit) {
    res.status(400);
    res.json({ message: "Please use a limit param.", status: 400 });
    return;
  }

  const start = cursor ? parseInt(cursor, 10) : 0;
  const end = parseInt(limit, 10) + start;

  let flowers = rankedFlowers;

  if (walletAddress && isValidAddress(walletAddress)) {
    // Get tokenIds from wallet
    let balance = await contract.balanceOf(walletAddress);
    balance = parseInt(balance.toString(), 10);

    const ownedTokenIds =
      balance > 0
        ? await Promise.all(
            Array.from({ length: balance }, (_, i) => i).map(async (i) => {
              const tokenId = await contract.tokenOfOwnerByIndex(
                walletAddress,
                i
              );
              return tokenId ? tokenId.toString() : undefined;
            })
          )
        : [];

    flowers = flowers.filter((i) =>
      ownedTokenIds.includes(i.tokenId.toString())
    );
  }

  if (tokenIds) {
    if (Array.isArray(tokenIds)) {
      flowers = flowers.filter((i) => tokenIds.includes(i.tokenId.toString()));
    } else {
      flowers = flowers.filter((i) => i.tokenId.toString() === tokenIds);
    }
  }

  const paginatedFlowers = flowers.slice(start, end);
  const hasNextPage = parseInt(limit, 10) < flowers.length;
  const nextCursor = hasNextPage ? end : null;

  res.status(200).json({
    flowers: paginatedFlowers,
    nextCursor,
    hasNextPage,
  });
};
