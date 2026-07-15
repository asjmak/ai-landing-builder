import { NextRequest } from "next/server";
import { generateLandingPage } from "@/lib/pipeline";
import { createSSEStream } from "@/lib/stream";
import type { CampaignBrief } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  return createSSEStream(async (send) => {
    let body: any;
    try {
      body = await req.json();
    } catch {
      send({ type: "error", message: "Payload tidak valid." });
      return;
    }

    if (!body.product || !body.audience || !body.leadMagnet || !body.painPoint) {
      send({ type: "error", message: "Field wajib: product, audience, leadMagnet, painPoint." });
      return;
    }
    if (!body.modelStrategist || !body.modelDeveloper) {
      send({ type: "error", message: "Model Strategist & Developer wajib dipilih." });
      return;
    }

    const brief: CampaignBrief = {
      product: body.product,
      audience: body.audience,
      leadMagnet: body.leadMagnet,
      painPoint: body.painPoint,
      brandColor: body.brandColor,
      trafficSource: body.trafficSource,
      modelStrategist: body.modelStrategist,
      modelDeveloper: body.modelDeveloper,
      apiKey: body.apiKey,
      baseUrl: body.baseUrl,
      modular: body.modular,
      badgeStyle: body.badgeStyle,
      heroStyle: body.heroStyle,
    };

    const result = await generateLandingPage(brief, (m) => send({ type: "log", message: m }));
    send({ type: "done", result });
  });
}
