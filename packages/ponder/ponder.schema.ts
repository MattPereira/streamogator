import { createSchema } from "@ponder/core";

export default createSchema((p) => ({
  Builder: p.createTable({
    id: p.hex(), // the EOA address
    date: p.bigint(), // event.block.timestamp
    streamCap: p.bigint(), // in ETH
    totalCollected: p.bigint(), // updated every withdraw event
  }),
  Withdrawal: p.createTable({
    id: p.hex(), // the tx hash
    date: p.bigint(), // event.block.timestamp
    to: p.hex().references("Builder.id"),
    amount: p.bigint(), // in ETH
  }),
}));
