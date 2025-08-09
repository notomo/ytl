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

export const getNumbers = (v: string | null) => {
  return (v?.split(",") ?? [])
    .map((m) => getNumber(m))
    .filter((n) => typeof n === "number");
};
