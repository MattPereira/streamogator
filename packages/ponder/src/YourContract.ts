import { ponder } from "@/generated";

ponder.on("YourContract:AddBuilder", async ({ event, context }) => {
  console.log(event.args);

  const { Builder } = context.db;

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
});

// ponder.on("YourContract:OwnershipTransferred", async ({ evesnt, context }) => {
//   console.log(event.args);
// });

ponder.on("YourContract:UpdateBuilder", async ({ event, context }) => {
  console.log(event.args);

  const { Builder } = context.db;

  await Builder.update({
    id: event.args.to,
    data: {
      streamCap: event.args.amount,
    },
  });
});

ponder.on("YourContract:Withdraw", async ({ event, context }) => {
  console.log(event.transaction.hash);

  const { Withdrawal } = context.db;

  await Withdrawal.create({
    id: event.transaction.hash,
    data: {
      date: event.block.timestamp,
      to: event.args.to,
      amount: event.args.amount,
      gas: event.transaction.gas,
      contract: event.transaction.from,
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
