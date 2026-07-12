import { NextRequest, NextResponse } from "next/server";
import { analyzeAudience } from "@/lib/pipeline";
import { GatewayError } from "@/lib/openrouter";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { product, trafficSource, leadMagnet, modelStrategist, apiKey, baseUrl } = body as {
      product?: string;
      trafficSource?: string;
      leadMagnet?: string;
      modelStrategist?: string;
      apiKey?: string;
      baseUrl?: string;
    };

    if (!product) {
      return NextResponse.json({ error: "Field wajib: product." }, { status: 400 });
    }
    if (!modelStrategist) {
      return NextResponse.json({ error: "Model Strategist wajib dipilih." }, { status: 400 });
    }

    const result = await analyzeAudience({
      product,
      trafficSource,
      leadMagnet,
      model: modelStrategist,
      apiKey,
      baseUrl,
    });
    return NextResponse.json(result);
  } catch (e: any) {
    if (e instanceof GatewayError) {
      return NextResponse.json({ error: e.message }, { status: e.status || 500 });
    }
    return NextResponse.json({ error: e?.message || "Internal error" }, { status: 500 });
  }
}
