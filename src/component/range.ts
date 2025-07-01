import { useCallback, useEffect, useRef, useState } from "react";

export interface RangeHandle {
  value: number;
  onKeyDownHandler: (e: React.KeyboardEvent) => void;
  onMouseDownHandler: (e: React.MouseEvent) => void;
  onTouchStart: (e: React.TouchEvent) => void;
  isActive: boolean;
}

export interface RangeTick {
  value: number;
  key: string;
  percentage: number;
}


export interface RangeInstance {
  handles: () => RangeHandle[];
  getTicks: () => RangeTick[];
  getPercentageForValue: (value: number) => number;
  sortedValues: number[];
  options: {
    min: number;
    max: number;
    stepSize: number;
  };
}

export interface UseRangeOptions {
  getRangerElement: () => HTMLElement | null;
  values: number[];
  min: number;
  max: number;
  stepSize: number;
  ticks?: number[];
  onChange: (instance: RangeInstance) => void;
}

export function useRange(options: UseRangeOptions): RangeInstance {
  const [values, setValues] = useState(options.values);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const isDragging = useRef(false);
  const startDragValue = useRef<number>(0);
  const startDragPosition = useRef<number>(0);

  const sortedValues = [...values].sort((a, b) => a - b);

  const getPercentageForValue = useCallback(
    (value: number) => {
      const { min, max } = options;
      return ((value - min) / (max - min)) * 100;
    },
    [options],
  );

  const getValueForPercentage = useCallback(
    (percentage: number) => {
      const { min, max, stepSize } = options;
      const rawValue = min + (percentage / 100) * (max - min);
      return Math.round(rawValue / stepSize) * stepSize;
    },
    [options],
  );

  const updateValue = useCallback(
    (index: number, newValue: number) => {
      const clampedValue = Math.max(
        options.min,
        Math.min(options.max, newValue),
      );
      const newValues = [...values];
      newValues[index] = clampedValue;
      setValues(newValues);

      const instance: RangeInstance = {
        handles: () => [],
        getTicks: () => [],
        getPercentageForValue,
        sortedValues: [...newValues].sort((a, b) => a - b),
        options: {
          min: options.min,
          max: options.max,
          stepSize: options.stepSize,
        },
      };
      options.onChange(instance);
    },
    [values, options, getPercentageForValue],
  );

  const handleMouseDown = useCallback(
    (index: number, e: React.MouseEvent) => {
      e.preventDefault();
      setActiveIndex(index);
      isDragging.current = true;
      startDragValue.current = values[index] ?? 0;
      startDragPosition.current = e.clientX;

      const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging.current) return;

        const element = options.getRangerElement();
        if (!element) return;

        const rect = element.getBoundingClientRect();
        const percentage = ((e.clientX - rect.left) / rect.width) * 100;
        const newValue = getValueForPercentage(
          Math.max(0, Math.min(100, percentage)),
        );
        updateValue(index, newValue);
      };

      const handleMouseUp = () => {
        isDragging.current = false;
        setActiveIndex(null);
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [values, options, getValueForPercentage, updateValue],
  );

  const handleTouchStart = useCallback(
    (index: number, e: React.TouchEvent) => {
      e.preventDefault();
      setActiveIndex(index);
      isDragging.current = true;
      startDragValue.current = values[index] ?? 0;
      startDragPosition.current = e.touches[0]?.clientX ?? 0;

      const handleTouchMove = (e: TouchEvent) => {
        if (!isDragging.current || e.touches.length === 0) return;

        const element = options.getRangerElement();
        if (!element) return;

        const rect = element.getBoundingClientRect();
        const percentage =
          (((e.touches[0]?.clientX ?? 0) - rect.left) / rect.width) * 100;
        const newValue = getValueForPercentage(
          Math.max(0, Math.min(100, percentage)),
        );
        updateValue(index, newValue);
      };

      const handleTouchEnd = () => {
        isDragging.current = false;
        setActiveIndex(null);
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
      };

      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("touchend", handleTouchEnd);
    },
    [values, options, getValueForPercentage, updateValue],
  );

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent) => {
      const { stepSize } = options;
      let newValue = values[index] ?? 0;

      switch (e.key) {
        case "ArrowLeft":
        case "ArrowDown":
          e.preventDefault();
          newValue = Math.max(options.min, (values[index] ?? 0) - stepSize);
          break;
        case "ArrowRight":
        case "ArrowUp":
          e.preventDefault();
          newValue = Math.min(options.max, (values[index] ?? 0) + stepSize);
          break;
        case "Home":
          e.preventDefault();
          newValue = options.min;
          break;
        case "End":
          e.preventDefault();
          newValue = options.max;
          break;
        default:
          return;
      }

      updateValue(index, newValue);
    },
    [values, options, updateValue],
  );

  const handles = useCallback((): RangeHandle[] => {
    return values.map((value, index) => ({
      value,
      onKeyDownHandler: (e: React.KeyboardEvent) => handleKeyDown(index, e),
      onMouseDownHandler: (e: React.MouseEvent) => handleMouseDown(index, e),
      onTouchStart: (e: React.TouchEvent) => handleTouchStart(index, e),
      isActive: activeIndex === index,
    }));
  }, [values, activeIndex, handleKeyDown, handleMouseDown, handleTouchStart]);

  const getTicks = useCallback((): RangeTick[] => {
    const tickValues = options.ticks || [];
    return tickValues.map((value, index) => ({
      value,
      key: `tick-${index}`,
      percentage: getPercentageForValue(value),
    }));
  }, [options.ticks, getPercentageForValue]);


  useEffect(() => {
    if (JSON.stringify(values) !== JSON.stringify(options.values)) {
      setValues(options.values);
    }
  }, [options.values, values]);

  return {
    handles,
    getTicks,
    getPercentageForValue,
    sortedValues,
    options: {
      min: options.min,
      max: options.max,
      stepSize: options.stepSize,
    },
  };
}
