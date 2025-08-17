import { describe, expect, it } from "vitest";
import { formatTime } from "./time";

describe("formatTime", () => {
  it("formats seconds only (less than 1 minute)", () => {
    expect(formatTime(0)).toBe("00:00");
    expect(formatTime(59)).toBe("00:59");
  });

  it("formats minutes and seconds (less than 1 hour)", () => {
    expect(formatTime(60)).toBe("01:00");
    expect(formatTime(599)).toBe("09:59");
  });

  it("formats hours, minutes and seconds (1 hour or more)", () => {
    expect(formatTime(3600)).toBe("1:00:00");
    expect(formatTime(3665)).toBe("1:01:05");
  });

  it("formats large time values", () => {
    expect(formatTime(36000)).toBe("10:00:00");
    expect(formatTime(359999)).toBe("99:59:59");
  });

  it("handles decimal seconds correctly", () => {
    expect(formatTime(5.5)).toBe("00:05");
    expect(formatTime(3665.7)).toBe("1:01:05");
  });
});
