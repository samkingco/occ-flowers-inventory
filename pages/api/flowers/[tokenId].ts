import type { NextApiRequest, NextApiResponse } from "next";
import flowersData from "../../../data/ranked-flower-images.json";
import { Flower, ResponseError } from "../../../utils";

export interface FlowerResponse extends Flower {}

const flowers = flowersData as Flower[];

export default async (
  req: NextApiRequest,
  res: NextApiResponse<FlowerResponse | ResponseError>
) => {
  const tokenId = req.query.tokenId as string;
  const flower = flowers.find((i) => i.tokenId.toString() === tokenId);

  if (!flower) {
    res.status(404).json({
      message: `No flower found with 'tokenId' ${tokenId}`,
      status: 404,
    });
    return;
  }

  const { base64 } = flower.image;
  const html = Buffer.from(base64.substring(26), "base64").toString();

  res.status(200).json({
    ...flower,
    image: {
      html,
      base64,
    },
  });
};
