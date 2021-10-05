import type { NextApiRequest, NextApiResponse } from 'next';
import rankedFlowers from '../../data/ranked-flower-images.json';

export type FlowerResponse = Array<{
  tokenId: number;
  image: string;
  rank: number;
}>

export default (req: NextApiRequest, res: NextApiResponse<FlowerResponse>) => {
  const limit = req.query.limit as string;
  const cursor = req.query.cursor as string;

  const start = cursor ? parseInt(cursor, 10) : 0;
  const end = limit ? parseInt(limit, 10) + start : undefined;

  const flowers = rankedFlowers as FlowerResponse;
  const paginatedFlowers = flowers.slice(start, end);
  res.status(200).json(paginatedFlowers);
}