const USER_AGENT = "Mozilla/5.0 (compatible; BriefNewsBot/1.0)";

interface FetchTextOptions {
  timeoutMs: number;
  maxBytes: number;
  accept: string;
}

export class FetchError extends Error {
  constructor(
    message: string,
    readonly url: string,
  ) {
    super(message);
    this.name = "FetchError";
  }
}

async function readCapped(body: ReadableStream<Uint8Array>, maxBytes: number): Promise<Buffer> {
  const reader = body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;

  while (size < maxBytes) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    size += value.byteLength;
  }

  await reader.cancel().catch(() => undefined);
  return Buffer.concat(chunks).subarray(0, maxBytes);
}

function charsetOf(contentType: string | null): string {
  const match = contentType?.match(/charset=["']?([\w-]+)/i);
  const charset = match?.[1]?.toLowerCase() ?? "utf-8";
  try {
    new TextDecoder(charset);
    return charset;
  } catch {
    return "utf-8";
  }
}

export async function fetchText(url: string, options: FetchTextOptions): Promise<string> {
  const response = await fetch(url, {
    redirect: "follow",
    signal: AbortSignal.timeout(options.timeoutMs),
    headers: { "user-agent": USER_AGENT, accept: options.accept },
  });

  if (!response.ok || !response.body) {
    await response.body?.cancel().catch(() => undefined);
    throw new FetchError(`Request failed with status ${response.status}`, url);
  }

  const contentType = response.headers.get("content-type");
  const bytes = await readCapped(response.body, options.maxBytes);
  return new TextDecoder(charsetOf(contentType)).decode(bytes);
}
