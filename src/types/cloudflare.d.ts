declare module "cloudflare:workers" {
  export interface Env {
    MY_KV: KVNamespace;
  }
}
