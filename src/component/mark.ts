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

export function getLoopStartTime({
  marks,
  markLoopIndex,
  startSeconds,
}: {
  marks: number[];
  markLoopIndex?: number | null;
  startSeconds?: number;
}): number {
  if (markLoopIndex == null) {
    return startSeconds ?? 0;
  }

  const sorted = marks.toSorted((a, b) => a - b);

  if (markLoopIndex === 0) {
    return startSeconds ?? 0;
  }

  if (markLoopIndex < 0 || markLoopIndex > sorted.length) {
    return startSeconds ?? 0;
  }

  return sorted[markLoopIndex - 1] ?? startSeconds ?? 0;
}

export function getLoopEndTime({
  marks,
  markLoopIndex,
  endSeconds,
}: {
  marks: number[];
  markLoopIndex?: number | null;
  endSeconds?: number;
}): number {
  if (markLoopIndex == null) {
    return endSeconds ?? 0;
  }

  const sorted = marks.toSorted((a, b) => a - b);

  if (markLoopIndex < 0 || markLoopIndex > sorted.length) {
    return endSeconds ?? 0;
  }

  if (markLoopIndex === 0) {
    return sorted.length > 0
      ? (sorted[0] ?? endSeconds ?? 0)
      : (endSeconds ?? 0);
  }

  if (markLoopIndex === sorted.length) {
    return endSeconds ?? 0;
  }

  return sorted[markLoopIndex] ?? endSeconds ?? 0;
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
