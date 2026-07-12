/**
 * Helper untuk response Server-Sent Events (SSE) yang ringan.
 * Digunakan oleh route generate/ab agar frontend mendapat baris log
 * progres secara real-time (bukan hanya hasil akhir).
 */

export type SSEEvent =
  | { type: "log"; message: string }
  | { type: "done"; result: unknown }
  | { type: "error"; message: string };

export function createSSEStream(run: (send: (e: SSEEvent) => void) => Promise<void>) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (e: SSEEvent) =>
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(e)}\n\n`));
      try {
        await run(send);
      } catch (e: any) {
        send({ type: "error", message: e?.message || "Unknown error" });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
