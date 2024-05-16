# 🐊 StreamoGator

Data analytics for all Buidl Guidl stream contracts deployed on Ethereum and Optimism.

## 🏁 Getting Started

1. Clone the repo

```bash
git clone https://github.com/MattPereira/streamogator.git
```

2. Install dependencies

```bash
yarn install
```

3. Add environment variables to `./packages/ponder/.env.local`

```
PONDER_RPC_URL_1=https://eth-mainnet.alchemyapi.io/v2/...
PONDER_RPC_URL_10=https://opt-mainnet.g.alchemy.com/v2/...
```

4. Start the ponder backend framework

```bash
yarn ponder:dev
```

5. Start the frontend

```bash
yarn start
```

## 🛣️ Roadmap

- Click on a table row to see full details for transaction or builder in a modal pop up or details page
- Sort withdrawals by gas used
- Sort builders by total gas spent
- Show amount of ETH in each contract
