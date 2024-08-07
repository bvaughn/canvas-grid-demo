export function assert(assertion: unknown, message: string): asserts assertion {
  if (!assertion) {
    throw new Error(message);
  }
}
