import { ponder } from "@/generated";

ponder.on("YourContract:AddBuilder", async ({ event, context }) => {
  console.log(event.args);

  const { Builder } = context.db;

  await Builder.create({
    id: event.args.to,
    data: {
      streamCap: event.args.amount,
      totalCollected: 0n,
    },
  });
});

// ponder.on("YourContract:OwnershipTransferred", async ({ event, context }) => {
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
  console.log(event.args);

  const { Withdraw } = context.db;

  await Withdraw.create({
    id: event.transaction.hash,
    data: {
      to: event.args.to,
      amount: event.args.amount,
      date: event.block.timestamp,
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
        totalCollected: builder.totalCollected + event.args.amount,
      },
    });
  }
});
