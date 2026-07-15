import { NextRequest, NextResponse } from "next/server";
import { renderLandingPage } from "@/lib/pipeline";
import { GatewayError } from "@/lib/openrouter";
import type { StrategyOutput, CopyOutput, StatusMap } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { strategy, copy, statuses, brandColor, modelDeveloper, apiKey, baseUrl } = body as {
      strategy: StrategyOutput;
      copy: CopyOutput;
      statuses: StatusMap;
      brandColor?: string;
      modelDeveloper: string;
      apiKey?: string;
      baseUrl?: string;
    };

    if (!strategy || !copy || !statuses || !modelDeveloper) {
      return NextResponse.json(
        { error: "Field wajib: strategy, copy, statuses, modelDeveloper." },
        { status: 400 },
      );
    }

    const html = await renderLandingPage({ strategy, copy, statuses, brandColor, modelDeveloper, apiKey, baseUrl, modular: body.modular, badgeStyle: body.badgeStyle, heroStyle: body.heroStyle });
    return NextResponse.json({ html });
  } catch (e: any) {
    if (e instanceof GatewayError) {
      return NextResponse.json({ error: e.message }, { status: e.status || 500 });
    }
    return NextResponse.json({ error: e?.message || "Internal error" }, { status: 500 });
  }
}
