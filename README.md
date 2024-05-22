# 🐊 StreamoGator

Data indexing for all Buidl Guidl stream cohort contracts deployed on Ethereum and Optimism using Ponder framework to create a GraphQL server and PSQL database. The front-end uses Apollo Client to fetch, paginate, and sort data.

## 🛣️ Roadmap

- [x] Click on a table row to see full details for a single transaction, builder, and stream
- [ ] Search functionality with input that accepts ENS and hex address
- [ ] Add all the solo stream contracts for full data set
- [ ] Sort withdrawals by gas used
- [ ] Sort builders by total gas spent
- [ ] Show ETH balance in each contract

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
