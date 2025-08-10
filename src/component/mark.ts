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
  markLoopIndex: number | null;
  startSeconds: number;
}): number {
  if (markLoopIndex === null || markLoopIndex === 0) {
    return startSeconds;
  }

  const sorted = marks.toSorted((a, b) => a - b);
  if (markLoopIndex > sorted.length) {
    return startSeconds;
  }

  return sorted[markLoopIndex - 1] ?? startSeconds;
}

export function getLoopEndTime({
  marks,
  markLoopIndex,
  endSeconds,
}: {
  marks: number[];
  markLoopIndex: number | null;
  endSeconds: number;
}): number {
  if (markLoopIndex === null) {
    return endSeconds;
  }

  const sorted = marks.toSorted((a, b) => a - b);
  if (markLoopIndex === 0) {
    return sorted[0] ?? endSeconds;
  }

  return sorted[markLoopIndex] ?? endSeconds;
}

export function getLoopRange({
  marks,
  markLoopIndex,
  startSeconds,
  endSeconds,
}: {
  marks: number[];
  markLoopIndex: number | null;
  startSeconds: number;
  endSeconds: number;
}): { start: number; end: number } | null {
  if (markLoopIndex === null || markLoopIndex > marks.length) {
    return null;
  }

  const loopStartTime = getLoopStartTime({
    marks,
    markLoopIndex,
    startSeconds,
  });

  const loopEndTime = getLoopEndTime({
    marks,
    markLoopIndex,
    endSeconds,
  });

  return {
    start: loopStartTime,
    end: loopEndTime,
  };
}

export function findPreviousMark({
  marks,
  currentTime,
  fallbackSeconds,
}: {
  marks: number[];
  currentTime: number;
  fallbackSeconds: number;
}): number {
  const previousMarks = marks.filter((mark) => mark < currentTime);
  if (previousMarks.length > 0) {
    return Math.max(...previousMarks);
  }
  return fallbackSeconds;
}

export function findNextMark({
  marks,
  currentTime,
  fallbackSeconds,
}: {
  marks: number[];
  currentTime: number;
  fallbackSeconds: number;
}): number {
  const nextMarks = marks.filter((mark) => mark > currentTime);
  if (nextMarks.length > 0) {
    return Math.min(...nextMarks);
  }
  return fallbackSeconds;
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
