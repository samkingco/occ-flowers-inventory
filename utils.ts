import { ethers } from "ethers";

export interface Flower {
  tokenId: number;
  attributes: FlowerAttributes;
  image: {
    base64: string;
    html?: string;
  };
  rank?: number;
}

export interface FlowerAttributes {
  "petal-style": string;
  "petal-color": string;
  "core-size": number;
  "no-of-petals": number;
  "bg-color": string;
  "bg-overlay": string;
  mutation: string;
  spin: boolean;
  "bg-type": string;
}

export function isValidAddress(address: string) {
  try {
    ethers.utils.getAddress(address);
  } catch (e) {
    return false;
  }
  return true;
}

export interface ResponseError {
  message: string;
  status: number;
}

export interface FetchError extends Error {
  status: number;
}

export async function fetcher(url: string) {
  const res = await fetch(url);
  if (!res.ok) {
    const error = new Error(
      "An error occurred while fetching the data."
    ) as FetchError;
    error.message = await res.json();
    error.status = res.status;
    throw error;
  }
  return res.json();
}
