import { createSchema } from "@ponder/core";

export default createSchema((p) => ({
  Builder: p.createTable({
    id: p.hex(), // the EOA address
    date: p.bigint(), // event.block.timestamp
    streamCap: p.bigint(), // in ETH
    streamContracts: p.hex().list(), // event.transaction.from (the stream contract address)
    totalWithdrawals: p.bigint(), // updated every withdraw event
    withdrawalsCount: p.int(), // updated every withdraw event
  }),
  Withdrawal: p.createTable({
    id: p.hex(), // the tx hash
    date: p.bigint(), // event.block.timestamp
    to: p.hex().references("Builder.id"),
    amount: p.bigint(), // in ETH
    reason: p.string(), // event.transaction.gas
    streamContract: p.hex(), // event.transaction.from (the stream contract address)
    network: p.int(), // context.network.chainId
  }),
}));
