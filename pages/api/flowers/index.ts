import type { NextApiRequest, NextApiResponse } from "next";
import { listFlowers, listFlowersInWallet } from "occ-flowers-sdk";
import { Flower } from "occ-flowers-sdk/dist/types";
import { ResponseError } from "../../../utils";

export interface FlowersResponse {
  flowers: Flower[];
  nextCursor: number | null;
  hasNextPage: boolean;
}

export default async (
  req: NextApiRequest,
  res: NextApiResponse<FlowersResponse | ResponseError>
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

  let flowers: Flower[] = [];

  if (walletAddress) {
    try {
      flowers = await listFlowersInWallet(walletAddress); 
    } catch (e) {}
  } else {
    flowers = await listFlowers()
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
