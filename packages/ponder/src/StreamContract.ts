import { ponder } from "@/generated";

ponder.on("StreamContract:AddBuilder", async ({ event, context }) => {
  console.log("Indexing Builder...");

  const { Builder } = context.db;

  // If the builder already exists ( because they belong  to more than one stream contract )
  const builder = await Builder.findUnique({
    id: event.args.to,
  });
  if (builder) {
    // Update to record with another stream contract and stream cap
    await Builder.update({
      id: event.args.to,
      data: {
        streamCap: builder.streamCap + event.args.amount,
        streamContracts: [
          ...builder.streamContracts,
          event.transaction.to as `0x${string}`,
        ],
      },
    });
  } else {
    // Otherwise, create a new Builder record
    await Builder.create({
      id: event.args.to,
      data: {
        date: event.block.timestamp,
        streamContracts: [event.transaction.to as `0x${string}`],
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
      reason: event.args.reason,
      streamContract: event.transaction.to as `0x${string}`,
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
