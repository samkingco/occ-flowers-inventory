import type { NextApiRequest, NextApiResponse } from "next";
import { getFlower } from "occ-flowers-sdk";
import { Flower } from "occ-flowers-sdk/dist/types";
import { ResponseError } from "../../../utils";

export interface FlowerResponse extends Flower {}

export default async (
  req: NextApiRequest,
  res: NextApiResponse<FlowerResponse | ResponseError>
) => {
  const tokenId = req.query.tokenId as string;
  let flower;

  try {
    flower = await getFlower(parseInt(tokenId));
  } catch (e) {
    res.status(404).json({
      message: `No flower found with 'tokenId' ${tokenId}`,
      status: 404,
    });
    return;
  }
  
  res.status(200).json(flower);
};
