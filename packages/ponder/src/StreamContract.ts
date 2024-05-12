import { ponder } from "@/generated";

ponder.on("StreamContract:AddBuilder", async ({ event, context }) => {
  console.log("Indexing Builder...");

  const { Builder } = context.db;

  // If the builder already exists because he belongs to more than one stream contract
  const builder = await Builder.findUnique({
    id: event.args.to,
  });
  if (builder) {
    // Update to record Builder's highest stream cap (or add it?)
    await Builder.update({
      id: event.args.to,
      data: {
        streamCap: event.args.amount + builder.streamCap,
      },
    });
  } else {
    // Otherwise, create a new Builder record
    await Builder.create({
      id: event.args.to,
      data: {
        date: event.block.timestamp,
        contract: event.transaction.from,
        streamCap: event.args.amount,
        totalWithdrawals: 0n,
        withdrawalsCount: 0,
      },
    });
  }
});

// ponder.on("YourContract:OwnershipTransferred", async ({ evesnt, context }) => {
//   console.log(event.args);
// });

ponder.on("StreamContract:UpdateBuilder", async ({ event, context }) => {
  console.log("Updating Builder...");

  const { Builder } = context.db;

  await Builder.update({
    id: event.args.to,
    data: {
      streamCap: event.args.amount,
    },
  });
});

ponder.on("StreamContract:Withdraw", async ({ event, context }) => {
  console.log("Indexing Withdrawal...");

  const { Withdrawal } = context.db;

  await Withdrawal.create({
    id: event.transaction.hash,
    data: {
      date: event.block.timestamp,
      to: event.args.to,
      amount: event.args.amount,
      gas: event.transaction.gas,
      contract: event.transaction.to as `0x${string}` | undefined,
      network: context.network.chainId,
    },
  });

  const { Builder } = context.db;

  const builder = await Builder.findUnique({
    id: event.args.to,
  });

  if (builder) {
    await Builder.update({
      id: event.args.to,
      data: {
        totalWithdrawals: builder.totalWithdrawals + event.args.amount,
        withdrawalsCount: builder.withdrawalsCount + 1,
      },
    });
  }
});
