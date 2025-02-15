"use client";
import { parseAsString, useQueryState } from "nuqs";

export function useEditTaskModel() {
  const [taskId, setTaskId] = useQueryState("task-edit-model", parseAsString);

  function open(id: string) {
    setTaskId(id);
  }

  function close() {
    setTaskId(null);
  }

  return {
    taskId,
    open,
    close,
    setTaskId,
  };
}
