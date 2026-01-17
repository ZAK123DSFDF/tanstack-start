export interface CloudflareEnv {
  MY_KV: KVNamespace;
}
export interface TanStackStartContext {
  request: Request;
  context: {
    cloudflare?: {
      env: CloudflareEnv;
      context: any;
    };
  };
  params: Record<string, string>;
}
