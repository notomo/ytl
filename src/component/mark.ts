export function addedMarks({
  marks,
  currentTime,
}: {
  marks: number[];
  currentTime: number;
}): { newMarks: number[]; isAdded: boolean } {
  if (!marks.includes(currentTime)) {
    const newMarks = [...marks, currentTime].sort((a, b) => a - b);
    return { newMarks, isAdded: true };
  }
  return { newMarks: marks, isAdded: false };
}

export function deletedMarks({
  marks,
  currentTime,
}: {
  marks: number[];
  currentTime: number;
}): { newMarks: number[]; isDeleted: boolean } {
  const previousMarks = marks.filter((mark) => mark <= currentTime);

  if (previousMarks.length > 0) {
    const lastMark = Math.max(...previousMarks);
    const newMarks = marks.filter((mark) => mark !== lastMark);
    return { newMarks, isDeleted: true };
  }

  const nextMarks = marks.filter((mark) => mark > currentTime);
  if (nextMarks.length > 0) {
    const firstMark = Math.min(...nextMarks);
    const newMarks = marks.filter((mark) => mark !== firstMark);
    return { newMarks, isDeleted: true };
  }

  return { newMarks: marks, isDeleted: false };
}

export function findNearestSegment({
  marks,
  currentTime,
}: {
  marks: number[];
  currentTime: number;
}): number {
  const sorted = marks.toSorted((a, b) => a - b);

  for (const [index, mark] of sorted.entries()) {
    if (currentTime <= mark) {
      return index;
    }
  }

  return sorted.length;
}
