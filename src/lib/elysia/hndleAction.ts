export async function handleAction<T>(
  name: string | null,
  fn: () => Promise<T>,
  measureTime: boolean = true,
): Promise<T> {
  const label = name ?? "Unnamed Action";
  const start = measureTime ? performance.now() : 0;

  try {
    const result = await fn();

    if (measureTime) {
      const end = performance.now();
      console.info(`✅ ${label} completed in ${Math.round(end - start)}ms`);
    }

    return result;
  } catch (err) {
    console.error(`${label} error:`, err);
    throw err; // 🔥 Let Elysia handle this globally
  }
}
