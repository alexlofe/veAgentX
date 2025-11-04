import { ThorClient } from "@vechain/sdk-network";

const VECHAIN_NETWORK = process.env.VECHAIN_NETWORK;

export async function getAccountBalances(address, rpcUrl = VECHAIN_NETWORK) {
  const thor = ThorClient.at(rpcUrl);

  const account = await thor.accounts.getAccount(address);

  // Convert raw balances (in wei) to readable VET and VTHO
  const vetBalance = BigInt(account.balance) / 1000000000000000000n;
  const vthoBalance = BigInt(account.energy) / 1000000000000000000n;

  return {
    address,
    vet: vetBalance.toString(),
    vtho: vthoBalance.toString(),
  };
}