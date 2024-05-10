import { createConfig } from "@ponder/core";
import { http } from "viem";

import { StreamContractAbi } from "./abis/StreamContractAbi";

export default createConfig({
  networks: {
    mainnet: { chainId: 1, transport: http(process.env.PONDER_RPC_URL_1) },
    optimism: { chainId: 10, transport: http(process.env.PONDER_RPC_URL_10) },
  },
  contracts: {
    StreamContract: {
      abi: StreamContractAbi,
      network: {
        mainnet: {
          address: [
            "0x2634aF3E799D3E17C6cf30bCF1275A7e3808F0df", // 1. ENS Cohort // 18393793
            "0x2Be18e07C7be0a2CC408C9E02C90203B2052D7DE", // 2. Main Hacker House (Jessy's) // 16992407
            "0x502730421b796baeeB9D907d88685234dDb44750", // 4. Infrastructure (Jessy's) // 17184155
            "0xA90F607224A0236B08Ae02178AB57aef712f86D3", // 7. Sanctum Cohort // 18523293
          ],
          startBlock: 16992407,
        },
        optimism: {
          address: [
            "0x3E920e4a1C26a9c6488c3E5c7CB1e91a179927F5", // 3. Play Full // 101774522
            "0x751e87af85b97054b30aD822291696482625e947", // 5. Launch Pod // 113444951
            "0x964d0C9a421953F95dAF3A5c5406093a3014A5D8", // 6. Sand Garden // 113132153
          ],
          startBlock: 101774522,
        },
      },
    },
  },
});
