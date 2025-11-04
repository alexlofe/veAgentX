import { character } from "./character.ts";
import { getAccountBalances } from "../vechain/account.js";

// extract 0x... address
function extractAddress(raw: string): string | null {
  const text = (raw || "").trim();
  const m =
    text.match(/\bbalance\s+(0x[a-fA-F0-9]{40})\b/i) ||
    text.match(/\b(0x[a-fA-F0-9]{40})\b/);
  return m ? m[1].replace(/[.,;:!?)]*$/g, "") : null;
}

// Minimal Action
const vechainBalanceAction: any = {
  name: "VECHAIN_WALLET_BALANCE",
  similes: ["VET_BALANCE", "CHECK_BALANCE", "BALANCE"],
  description: "Return VET and VTHO balances for a VeChain address",
  validate: async (_runtime: any, message: any) => {
    const text = message?.content?.text || "";
    const hasAddr = /\b0x[a-fA-F0-9]{40}\b/.test(text);
    const hasKeyword = /\b(balance|vechain|vet|vtho)\b/i.test(text);
    return hasAddr || hasKeyword;
  },
  handler: async (_runtime: any, message: any, _state: any, _options: any, callback: any) => {
    const text = message?.content?.text || "";
    console.log("[mention]", text);

    const addr = extractAddress(text);
    if (!addr) {
      await callback({ text: "Provide an address. Try: balance 0xYourAddress" });
      return true;
    }
    try {
      const res = await getAccountBalances(addr);
      console.log("[balance]", addr, res.vet, "VET", res.vtho, "VTHO");
      await callback({ text: `Balance for ${addr}\nVET: ${res.vet}\nVTHO: ${res.vtho}` });
    } catch (e: any) {
      console.error("[balance error]", e?.message || e);
      await callback({ text: "Could not fetch that balance right now. Please try again shortly." });
    }
    return true;
  },
  examples: [
    [
      { user: "user", content: { text: "balance 0x01d6b50b31c18d7f81ede43935cadf79901b0ea0" } },
      { user: "assistant", content: { text: "Balance for 0x... VET: 123 VTHO: 4" } }
    ]
  ],
};

// Mandatory init that registers the action
const initCharacter = ({ runtime }: { runtime: any }) => {
  console.log("Initializing character:", character?.name);
  runtime.registerAction(vechainBalanceAction);
};

// Define agent and project with the exact shapes the loader looks for
export const projectAgent: any = {
  character,
  init: async (runtime: any) => await initCharacter({ runtime }),
};

export const project: any = {
  agents: [projectAgent], // <-- must be non-empty
};

// Export both a named and the default project to satisfy all loaders
export { character } from "./character.ts";
export default project;
