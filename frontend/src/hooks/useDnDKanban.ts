import { useState, useCallback } from 'react';
import {
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';

export interface UseDnDKanbanOptions {
  onDragEnd?: (event: DragEndEvent) => void;
  onDragOver?: (event: DragOverEvent) => void;
  onDragStart?: (event: DragStartEvent) => void;
}

export const useDnDKanban = (options: UseDnDKanbanOptions = {}) => {
  const [activeId, setActiveId] = useState<string | number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      setActiveId(event.active.id);
      options.onDragStart?.(event);
    },
    [options]
  );

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      options.onDragOver?.(event);
    },
    [options]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveId(null);
      options.onDragEnd?.(event);
    },
    [options]
  );

  return {
    sensors,
    activeId,
    handlers: {
      onDragStart: handleDragStart,
      onDragOver: handleDragOver,
      onDragEnd: handleDragEnd,
    },
  };
};
