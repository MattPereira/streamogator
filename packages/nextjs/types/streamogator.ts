export type Builder = {
  id: `0x${string}`; // EOA address
  date: number;
  streamCap: bigint;
  streamContracts: `0x${string}`[];
  totalWithdrawals: bigint;
  withdrawalsCount: number;
};

export type Withdrawal = {
  id: `0x${string}`; // txHash
  date: number;
  to: `0x${string}`;
  amount: bigint;
  chainId: string;
  streamContract: `0x${string}`;
  reason: string;
};

export type Stream = {
  id: `0x${string}`; // contract address
  name: string;
  chainId: string;
  startBlock: number;
  buildersCount: number;
  withdrawalsCount: number;
  totalWithdrawals: bigint;
  timestamp: string;
};
