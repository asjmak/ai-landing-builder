import { NextRequest, NextResponse } from "next/server";
import { getCampaign, deleteCampaign } from "@/lib/store";

export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const campaign = await getCampaign(params.id);
    if (!campaign) {
      return NextResponse.json({ error: "Kampanye tidak ditemukan." }, { status: 404 });
    }
    return NextResponse.json(campaign);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Internal error" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const ok = await deleteCampaign(params.id);
    if (!ok) {
      return NextResponse.json({ error: "Kampanye tidak ditemukan." }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Internal error" }, { status: 500 });
  }
}
