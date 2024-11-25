"use client";

import { cn } from "@/lib/utils";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Chapter } from "@prisma/client";
import { Grip, Pencil } from "lucide-react";
import { useEffect, useState } from "react";

interface ChaptersListProps {
  items: Chapter[];
  onEdit: (id: string) => void;
  onReordered: (updateData: { id: string; position: number }[]) => void;
}

export const ChaptersList = ({
  items,
  onEdit,
  onReordered,
}: ChaptersListProps) => {
  const [chapters, setChapters] = useState(items);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setChapters(items);
  }, [items]);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) {
    return null;
  }

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(chapters);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setChapters(items);

    const startIndex = Math.min(result.source.index, result.destination.index);
    const endIndex = Math.max(result.source.index, result.destination.index);

    const updatedData = items.slice(startIndex, endIndex + 1);
    const bulkUpdatedData = updatedData.map((chapter) => ({
      id: chapter.id,
      position: items.findIndex((item) => item.id === chapter.id),
    }));

    onReordered(bulkUpdatedData);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="chapter">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-1"
          >
            {chapters.map((chapter, index) => (
              <Draggable
                draggableId={chapter.id}
                key={chapter.id}
                index={index}
              >
                {(provided) => (
                  <div
                    {...provided.draggableProps}
                    ref={provided.innerRef}
                    className="flex items-center w-full gap-2 border py-2 px-3 rounded-md text-sm text-slate-700 bg-white"
                  >
                    <div {...provided.dragHandleProps}>
                      <Grip className="size-4 text-slate-500" />
                    </div>
                    {chapter.title}
                    <div className="ml-auto flex items-center gap-2">
                      {chapter.isFree && (
                        <div className="text-red-700 font-semibold text-xs">
                          무료!
                        </div>
                      )}
                      <div
                        className={cn(
                          "text-xs font-semibold py-1 px-2 rounded-full bg-slate-500 text-white",
                          chapter.isPublished && "bg-sky-600"
                        )}
                      >
                        {chapter.isPublished ? "Published" : "Draft"}
                      </div>
                      <Pencil
                        className="size-4 cursor-pointer"
                        onClick={() => onEdit(chapter.id)}
                      />
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
