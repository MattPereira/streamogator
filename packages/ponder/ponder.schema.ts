import { createSchema } from "@ponder/core";

export default createSchema((p) => ({
  Builder: p.createTable({
    id: p.hex(), // the EOA address
    streamCap: p.bigint(),
    totalCollected: p.bigint(), // updated every withdraw event
  }),
  Withdraw: p.createTable({
    id: p.hex(), // the tx hash
    to: p.hex().references("Builder.id"),
    amount: p.bigint(), // of ETH
    date: p.bigint(), // event.block.timestamp
  }),
}));
