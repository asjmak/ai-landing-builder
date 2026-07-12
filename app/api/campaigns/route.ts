import { NextRequest, NextResponse } from "next/server";
import { listCampaigns, saveCampaign } from "@/lib/store";

export const runtime = "nodejs";

export async function GET() {
  try {
    const list = await listCampaigns();
    return NextResponse.json(list);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Internal error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { product, mode, brief, result } = body as {
      product?: string;
      mode?: "single" | "ab";
      brief?: Record<string, any>;
      result?: any;
    };

    if (!product || !brief || !result) {
      return NextResponse.json(
        { error: "Field wajib: product, brief, result." },
        { status: 400 },
      );
    }

    // Jangan simpan API key ke disk.
    const { apiKey, ...safeBrief } = brief;
    void apiKey;

    const saved = await saveCampaign({
      product,
      mode: mode === "ab" ? "ab" : "single",
      brief: safeBrief,
      result,
    });
    return NextResponse.json({ id: saved.id, createdAt: saved.createdAt });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Internal error" }, { status: 500 });
  }
}
