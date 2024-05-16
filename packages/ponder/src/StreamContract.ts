import { ponder } from "@/generated";
import { type Stream, optimismStreams, mainnetStreams } from "../ponder.config";

/**
 * Setup runs before all the event indexing to create table of stream contract information
 */
ponder.on("StreamContract:setup", async ({ context }) => {
  console.log("Initializing stream contracts in db...");

  const { Stream } = context.db;

  async function initializeStreams(streams: Stream[], chainId: number) {
    for (const stream of streams) {
      const alreadyExists = await Stream.findUnique({
        id: stream.address,
      });
      if (!alreadyExists) {
        await Stream.create({
          id: stream.address,
          data: {
            name: stream.name,
            startBlock: stream.startBlock,
            chainId: chainId,
          },
        });
      }
    }
  }

  // Initialize Mainnet streams with chainId 1
  await initializeStreams(mainnetStreams, 1);

  // Initialize Optimism streams with chainId 10
  await initializeStreams(optimismStreams, 10);
});

/**
 * Handle a builder who is added to multiple stream contracts
 */
ponder.on("StreamContract:AddBuilder", async ({ event, context }) => {
  // console.log("Adding Builder...");
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

/**
 * Since a builder can have their stream cap updated, we need to update the builder record
 */
ponder.on("StreamContract:UpdateBuilder", async ({ event, context }) => {
  // console.log("Updating Builder...");
  const { Builder } = context.db;

  await Builder.update({
    id: event.args.to,
    data: {
      streamCap: event.args.amount,
    },
  });
});

/**
 * Handle a builder who withdraws from a stream contract
 * Update the builder record for totalWithdrawals and withdrawalsCount
 */
ponder.on("StreamContract:Withdraw", async ({ event, context }) => {
  // console.log("Withdrawal Event...");
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
