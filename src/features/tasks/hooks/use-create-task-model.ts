"use client";
import { parseAsBoolean, parseAsString, useQueryState } from "nuqs";
import { TaskStatus } from "../types/task-status";

export function useCreateTaskModel() {
  const [isOpen, setIsOpen] = useQueryState(
    "task-creation-model",
    parseAsBoolean.withDefault(false).withOptions({
      clearOnDefault: true,
    })
  );

  const [board, setBoard] = useQueryState(
    "board",
    parseAsString.withDefault("").withOptions({
      clearOnDefault: true,
    })
  );

  function open(board: TaskStatus | null) {
    setIsOpen(true);
    setBoard(board ?? "");
  }

  function close() {
    setIsOpen(false);
  }

  return {
    isOpen,
    open,
    close,
    setIsOpen,
    board,
  };
}
