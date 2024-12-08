import { useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";

export const useSearchShortcut = () => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  useHotkeys("meta+k, ctrl+k", (e) => {
    e.preventDefault();
    searchInputRef.current?.focus();
  });

  return {
    searchInputRef,
  };
};
