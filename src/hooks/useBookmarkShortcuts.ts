import { useHotkeys } from "react-hotkeys-hook";

interface UseBookmarkShortcutsProps {
  focusedBookmarkId: string | null;
  deleteDialogOpen: boolean;
  editDialogOpen: boolean;
  filteredBookmarks: chrome.bookmarks.BookmarkTreeNode[];
  onEdit: (bookmark: chrome.bookmarks.BookmarkTreeNode) => void;
  onDelete: (bookmark: chrome.bookmarks.BookmarkTreeNode) => void;
}

export const useBookmarkShortcuts = ({
  focusedBookmarkId,
  deleteDialogOpen,
  editDialogOpen,
  filteredBookmarks,
  onEdit,
  onDelete,
}: UseBookmarkShortcutsProps) => {
  useHotkeys(
    "Backspace",
    (e) => {
      if (focusedBookmarkId && !deleteDialogOpen && !editDialogOpen) {
        const bookmark = filteredBookmarks.find(
          (b) => b.id === focusedBookmarkId
        );
        if (bookmark) {
          e.preventDefault();
          onDelete(bookmark);
        }
      }
    },
    {
      enableOnFormTags: false,
      enabled: !deleteDialogOpen && !editDialogOpen,
    }
  );

  useHotkeys(
    "e",
    (e) => {
      if (focusedBookmarkId && !deleteDialogOpen && !editDialogOpen) {
        const bookmark = filteredBookmarks.find(
          (b) => b.id === focusedBookmarkId
        );
        if (bookmark) {
          e.preventDefault();
          onEdit(bookmark);
        }
      }
    },
    {
      enableOnFormTags: false,
      enabled: !deleteDialogOpen && !editDialogOpen,
    }
  );
};
