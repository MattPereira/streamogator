import { formatEther } from "viem";

export const timestampToDate = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  const isoString = date.toISOString();
  return isoString.split("T")[0];
};

export const abbreviateHex = (string: string) => {
  return `${string.slice(0, 5)}...${string.slice(-4)}`;
};

export const customFormatEther = (amount: bigint) => {
  return `Ξ ${Number(formatEther(amount)).toFixed(2)}`;
};

type StreamDirectory = {
  [key: string]: {
    name: string;
    startBlock: number;
    chainId: number;
  };
};

export const streamDirectory: StreamDirectory = {
  "0x2634af3e799d3e17c6cf30bcf1275a7e3808f0df": {
    name: "ENS Cohort",
    startBlock: 18393793,
    chainId: 1,
  },
  "0x2be18e07c7be0a2cc408c9e02c90203b2052d7de": {
    name: "Main Hacker House",
    startBlock: 16992407,
    chainId: 1,
  },
  "0x502730421b796baeeb9d907d88685234ddb44750": {
    name: "Infrastructure",
    startBlock: 17184155,
    chainId: 1,
  },
  "0xa90f607224a0236b08ae02178ab57aef712f86d3": {
    name: "Sanctum Cohort",
    startBlock: 18523293,
    chainId: 1,
  },
  "0xe54f8b7fddf75257c7f248a197553ac467296053": {
    name: "BG Outreach",
    startBlock: 17980218,
    chainId: 1,
  },
  "0xf32409271be1bb02f15922a6ea38be79e664a247": {
    name: "Balancer Cohort",
    startBlock: 18394911,
    chainId: 1,
  },
  "0xacc9cc4983d57cea0748b8cd1adb87ada5b1a67c": {
    name: "Not Just NotFellows",
    startBlock: 17424349,
    chainId: 1,
  },
  "0xaf18f0f1f096fac34e816c7409348d313ef7c84f": {
    name: "Security & Optimizooors",
    startBlock: 17177802,
    chainId: 1,
  },
  "0xcb59f4bab420abdb3c6ae0997cc9ac7526d5e163": {
    name: "Autonomous Worlds",
    startBlock: 17184322,
    chainId: 1,
  },
  "0xfe2d6743d7180e07be769bf59d3c0f560b199434": {
    name: "ZK & Cryptography",
    startBlock: 17184307,
    chainId: 1,
  },
  "0x3e920e4a1c26a9c6488c3e5c7cb1e91a179927f5": {
    name: "Play Full",
    startBlock: 101774522,
    chainId: 10, // Assuming 'Optimism' chainId
  },
  "0x751e87af85b97054b30ad822291696482625e947": {
    name: "Launch Pod",
    startBlock: 113444951,
    chainId: 10, // Assuming 'Optimism' chainId
  },
  "0x964d0c9a421953f95daf3a5c5406093a3014a5d8": {
    name: "Sand Garden",
    startBlock: 113132153,
    chainId: 10, // Assuming 'Optimism' chainId
  },
};
