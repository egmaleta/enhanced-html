export function counter(initialCount = 0) {
  let count = initialCount;
  return () => count++;
}

export const newId = counter();
