import { createConfig } from "@ponder/core";
import { http } from "viem";

import { YourContractAbi } from "./abis/YourContractAbi";

export default createConfig({
  networks: {
    mainnet: { chainId: 1, transport: http(process.env.PONDER_RPC_URL_1) },
  },
  contracts: {
    YourContract: {
      abi: YourContractAbi,
      address: [
        "0xA90F607224A0236B08Ae02178AB57aef712f86D3", // Sanctum Cohort // 18523293
        "0x2Be18e07C7be0a2CC408C9E02C90203B2052D7DE", // Jessy's Hacker House // 16992407
        "0x2634aF3E799D3E17C6cf30bCF1275A7e3808F0df", // ENS Cohort // 18393793
        "0xE54F8B7FDdf75257c7F248a197553Ac467296053", // Launch Pod // 17980218
      ],
      network: "mainnet",
      startBlock: 16992407,
    },
  },
});
