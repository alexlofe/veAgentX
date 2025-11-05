import { ThorClient } from "@vechain/sdk-network";

export async function getLastTransfers(address, network = process.env.VECHAIN_NETWORK) {
  const thor = ThorClient.at(network);

  const withdrawals = await thor.logs.filterTransferLogs({
    criteriaSet: [{ sender: '0x1856c533ac2d94340aaa8544d35a5c1d4a21dee7', recipient: address}],
    range: { unit: "block", from: 20_000_000,},
    options: { limit: 3 },
    order: 'desc',
  });

  return withdrawals;
}