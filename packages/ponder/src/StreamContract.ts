import { ponder } from "@/generated";
import { type Stream, optimismStreams, mainnetStreams } from "../ponder.config";

import { createPublicClient, http } from "viem";
import { mainnet, optimism } from "viem/chains";

const mainnetClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});

const optimismClient = createPublicClient({
  chain: optimism,
  transport: http(),
});

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

      let block;
      if (!alreadyExists) {
        if (chainId === 1) {
          block = await mainnetClient.getBlock({
            blockNumber: BigInt(stream.startBlock),
          });
        } else {
          block = await optimismClient.getBlock({
            blockNumber: BigInt(stream.startBlock),
          });
        }
        await Stream.create({
          id: stream.address,
          data: {
            name: stream.name,
            startBlock: stream.startBlock,
            timestamp: block.timestamp,
            chainId: chainId,
            buildersCount: 0,
            withdrawalsCount: 0,
            totalWithdrawals: 0n,
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
  console.log("AddBuilder", event.args);
  const { Builder } = context.db;
  // If the builder already exists ( because they belong  to more than one stream contract )
  const builder = await Builder.findUnique({
    id: event.args.to,
  });

  if (builder) {
    // Update builder record with another stream contract and add to stream cap
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
    // Create a new Builder record
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
    // And update the buildersCount for the Stream record
    const { Stream } = context.db;
    const stream = await Stream.findUnique({
      id: event.transaction.to as `0x${string}`,
    });
    if (stream) {
      await Stream.update({
        id: event.transaction.to as `0x${string}`,
        data: {
          buildersCount: stream.buildersCount + 1,
        },
      });
    }
  }
});

/**
 * Since a builder can have their stream cap updated, we need to update the builder record
 */
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

/**
 * Handle a builder who withdraws from a stream contract
 * Update the builder record for totalWithdrawals and withdrawalsCount
 */
ponder.on("StreamContract:Withdraw", async ({ event, context }) => {
  console.log("Withdrawal:", event.args);
  const streamContract = event.transaction.to as `0x${string}`;
  const amount = event.args.amount;

  // 1. Create a new Withdrawal record
  const { Withdrawal } = context.db;
  await Withdrawal.create({
    id: event.transaction.hash,
    data: {
      date: event.block.timestamp,
      to: event.args.to,
      amount,
      reason: event.args.reason,
      streamContract,
      network: context.network.chainId,
    },
  });

  // 2. Update the builder record's totalWithdrawals and withdrawalsCount
  const { Builder } = context.db;
  const builder = await Builder.findUnique({
    id: event.args.to,
  });
  if (builder) {
    await Builder.update({
      id: event.args.to,
      data: {
        totalWithdrawals: builder.totalWithdrawals + amount,
        withdrawalsCount: builder.withdrawalsCount + 1,
      },
    });
  }

  // 3. Update the Stream record's totalWithdrawals and withdrawalsCount
  const { Stream } = context.db;
  const stream = await Stream.findUnique({
    id: streamContract,
  });
  if (stream) {
    await Stream.update({
      id: streamContract,
      data: {
        totalWithdrawals: stream.totalWithdrawals + amount,
        withdrawalsCount: stream.withdrawalsCount + 1,
      },
    });
  }
});
