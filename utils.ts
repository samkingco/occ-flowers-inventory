import { ethers } from "ethers";

export interface Flower {
  tokenId: number;
  image: string;
  rank: number;
}

export interface FlowerResponse {
  readonly flowers: Flower[];
  readonly nextCursor: number | null;
  readonly hasNextPage: boolean;
}
export function isValidAddress(address: string) {
  try {
    ethers.utils.getAddress(address);
  } catch (e) {
    return false;
  }
  return true;
}
