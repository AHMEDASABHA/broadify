"use client";
import { parseAsBoolean, useQueryState } from "nuqs";

export function useCreateProjectModel() {
  const [isOpen, setIsOpen] = useQueryState(
    "project-creation-model",
    parseAsBoolean.withDefault(false).withOptions({
      clearOnDefault: true,

    })
  );

  function open() {
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
  }

  return {
    isOpen,
    open,
    close,
    setIsOpen,
  };
}
