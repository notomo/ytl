export const getNumber = (v: string | null) => {
  if (v === null) {
    return undefined;
  }
  const n = Number(v);
  if (Number.isNaN(n)) {
    return undefined;
  }
  return n;
};
