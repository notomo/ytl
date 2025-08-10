import { describe, expect, it } from "vitest";
import {
  addedMarks,
  deletedMarks,
  findNearestSegment,
  getLoopEndTime,
  getLoopRange,
  getLoopStartTime,
} from "./mark";

describe("addedMarks", () => {
  it("should add new mark when currentTime is not in marks", () => {
    const result = addedMarks({ marks: [10, 30], currentTime: 20 });
    expect(result).toEqual({ newMarks: [10, 20, 30], isAdded: true });
  });

  it("should not add mark when currentTime already exists", () => {
    const result = addedMarks({ marks: [10, 20, 30], currentTime: 20 });
    expect(result).toEqual({ newMarks: [10, 20, 30], isAdded: false });
  });

  it("should sort marks correctly when adding", () => {
    const result = addedMarks({ marks: [30, 10], currentTime: 20 });
    expect(result).toEqual({ newMarks: [10, 20, 30], isAdded: true });
  });

  it("should handle empty marks array", () => {
    const result = addedMarks({ marks: [], currentTime: 15 });
    expect(result).toEqual({ newMarks: [15], isAdded: true });
  });
});

describe("deletedMarks", () => {
  it("should delete the last previous mark when exists", () => {
    const result = deletedMarks({ marks: [10, 20, 30], currentTime: 25 });
    expect(result).toEqual({ newMarks: [10, 30], isDeleted: true });
  });

  it("should delete the closest previous mark", () => {
    const result = deletedMarks({ marks: [5, 15, 25], currentTime: 20 });
    expect(result).toEqual({ newMarks: [5, 25], isDeleted: true });
  });

  it("should delete the first next mark when no previous marks", () => {
    const result = deletedMarks({ marks: [20, 30, 40], currentTime: 10 });
    expect(result).toEqual({ newMarks: [30, 40], isDeleted: true });
  });

  it("should return unchanged when no marks to delete", () => {
    const result = deletedMarks({ marks: [], currentTime: 15 });
    expect(result).toEqual({ newMarks: [], isDeleted: false });
  });

  it("should handle exact match on current time", () => {
    const result = deletedMarks({ marks: [10, 20, 30], currentTime: 20 });
    expect(result).toEqual({ newMarks: [10, 30], isDeleted: true });
  });
});

describe("getLoopStartTime", () => {
  it("should return startSeconds when markLoopIndex is null", () => {
    const result = getLoopStartTime({
      marks: [10, 20, 30],
      markLoopIndex: null,
      startSeconds: 5,
    });
    expect(result).toBe(5);
  });

  it("should return startSeconds when markLoopIndex is 0", () => {
    const result = getLoopStartTime({
      marks: [10, 20, 30],
      markLoopIndex: 0,
      startSeconds: 5,
    });
    expect(result).toBe(5);
  });

  it("should return correct mark for valid index", () => {
    const result = getLoopStartTime({
      marks: [30, 10, 20],
      markLoopIndex: 2,
      startSeconds: 5,
    });
    expect(result).toBe(20);
  });

  it("should return startSeconds when index exceeds marks length", () => {
    const result = getLoopStartTime({
      marks: [10, 20],
      markLoopIndex: 5,
      startSeconds: 5,
    });
    expect(result).toBe(5);
  });
});

describe("getLoopEndTime", () => {
  it("should return endSeconds when markLoopIndex is null", () => {
    const result = getLoopEndTime({
      marks: [10, 20, 30],
      markLoopIndex: null,
      endSeconds: 40,
    });
    expect(result).toBe(40);
  });

  it("should return first mark when markLoopIndex is 0", () => {
    const result = getLoopEndTime({
      marks: [30, 10, 20],
      markLoopIndex: 0,
      endSeconds: 40,
    });
    expect(result).toBe(10);
  });

  it("should return correct mark for valid index", () => {
    const result = getLoopEndTime({
      marks: [30, 10, 20],
      markLoopIndex: 2,
      endSeconds: 40,
    });
    expect(result).toBe(30);
  });

  it("should return endSeconds when index exceeds marks length", () => {
    const result = getLoopEndTime({
      marks: [10, 20],
      markLoopIndex: 5,
      endSeconds: 40,
    });
    expect(result).toBe(40);
  });
});

describe("getLoopRange", () => {
  it("should return null when markLoopIndex is null", () => {
    const result = getLoopRange({
      marks: [10, 20, 30],
      markLoopIndex: null,
      startSeconds: 5,
      endSeconds: 40,
    });
    expect(result).toBeNull();
  });

  it("should return null when markLoopIndex exceeds marks length", () => {
    const result = getLoopRange({
      marks: [10, 20],
      markLoopIndex: 5,
      startSeconds: 5,
      endSeconds: 40,
    });
    expect(result).toBeNull();
  });

  it("should return correct range for index 0", () => {
    const result = getLoopRange({
      marks: [30, 10, 20],
      markLoopIndex: 0,
      startSeconds: 5,
      endSeconds: 40,
    });
    expect(result).toEqual({ start: 5, end: 10 });
  });

  it("should return correct range for valid index", () => {
    const result = getLoopRange({
      marks: [30, 10, 20],
      markLoopIndex: 2,
      startSeconds: 5,
      endSeconds: 40,
    });
    expect(result).toEqual({ start: 20, end: 30 });
  });
});

describe("findNearestSegment", () => {
  it("should return 0 when currentTime is before first mark", () => {
    const result = findNearestSegment({ marks: [10, 20, 30], currentTime: 5 });
    expect(result).toBe(0);
  });

  it("should return correct index when currentTime equals a mark", () => {
    const result = findNearestSegment({ marks: [10, 20, 30], currentTime: 20 });
    expect(result).toBe(1);
  });

  it("should return correct index when currentTime is between marks", () => {
    const result = findNearestSegment({ marks: [10, 20, 30], currentTime: 15 });
    expect(result).toBe(1);
  });

  it("should return marks length when currentTime is after all marks", () => {
    const result = findNearestSegment({ marks: [10, 20, 30], currentTime: 35 });
    expect(result).toBe(3);
  });

  it("should handle empty marks array", () => {
    const result = findNearestSegment({ marks: [], currentTime: 15 });
    expect(result).toBe(0);
  });

  it("should handle unsorted marks", () => {
    const result = findNearestSegment({ marks: [30, 10, 20], currentTime: 15 });
    expect(result).toBe(1);
  });
});
