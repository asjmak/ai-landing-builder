/**
 * Penyimpanan kampanye sederhana berbasis file JSON (data/campaigns.json).
 * Tanpa dependency native — cukup fs. Cocok untuk tools & prototipe.
 * Menggunakan lock sederhana agar read-modify-write tidak bentrok.
 */
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";

const DATA_DIR = path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "campaigns.json");

export interface StoredCampaign {
  id: string;
  createdAt: string;
  product: string;
  mode: "single" | "ab";
  brief: Record<string, any>;
  result: {
    strategy: any;
    copy?: any;
    statuses?: any;
    html?: string;
    abData?: any;
  };
}

export type CampaignListItem = Pick<StoredCampaign, "id" | "createdAt" | "product" | "mode">;

// Lock sederhana (promise chain) untuk serialisasi write.
let chain: Promise<unknown> = Promise.resolve();
function withLock<T>(fn: () => Promise<T>): Promise<T> {
  const run = chain.then(fn, fn);
  chain = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

async function ensureFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(FILE);
  } catch {
    await fs.writeFile(FILE, "[]", "utf-8");
  }
}

async function readAll(): Promise<StoredCampaign[]> {
  await ensureFile();
  const raw = await fs.readFile(FILE, "utf-8");
  try {
    return JSON.parse(raw) as StoredCampaign[];
  } catch {
    return [];
  }
}

export async function listCampaigns(): Promise<CampaignListItem[]> {
  const arr = await readAll();
  return arr
    .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""))
    .map(({ id, createdAt, product, mode }) => ({ id, createdAt, product, mode }));
}

export async function getCampaign(id: string): Promise<StoredCampaign | null> {
  const arr = await readAll();
  return arr.find((c) => c.id === id) ?? null;
}

export async function saveCampaign(input: {
  product: string;
  mode: "single" | "ab";
  brief: Record<string, any>;
  result: StoredCampaign["result"];
}): Promise<StoredCampaign> {
  return withLock(async () => {
    const arr = await readAll();
    const campaign: StoredCampaign = {
      id: randomUUID(),
      createdAt: new Date().toISOString(),
      product: input.product,
      mode: input.mode,
      brief: input.brief,
      result: input.result,
    };
    arr.push(campaign);
    await fs.writeFile(FILE, JSON.stringify(arr, null, 2), "utf-8");
    return campaign;
  });
}

export async function deleteCampaign(id: string): Promise<boolean> {
  return withLock(async () => {
    const arr = await readAll();
    const next = arr.filter((c) => c.id !== id);
    if (next.length === arr.length) return false;
    await fs.writeFile(FILE, JSON.stringify(next, null, 2), "utf-8");
    return true;
  });
}
