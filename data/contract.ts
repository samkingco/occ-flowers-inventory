import { ethers } from "ethers";
import abi from "./abi.json";

export const address = "0x5A876ffc6E75066f5ca870e20FCa4754C1EfE91F";
export const rpc = new ethers.providers.JsonRpcProvider(
  process.env.NEXT_PUBLIC_ETH_ENDPOINT
);
export const contract = new ethers.Contract(address, abi, rpc);
export const totalFlowers = 4096;
export const tokenIds = Array.from({ length: totalFlowers }, (_, i) => i + 1);
