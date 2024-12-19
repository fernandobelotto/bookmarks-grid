import { useHotkeys } from "react-hotkeys-hook";

type UseBookmarkShortcutsProps = {
  focusedBookmarkId: string | null;
  deleteDialogOpen: boolean;
  editDialogOpen: boolean;
  filteredBookmarks: chrome.bookmarks.BookmarkTreeNode[];
  onEdit: (bookmark: chrome.bookmarks.BookmarkTreeNode) => void;
  onDelete: (bookmark: chrome.bookmarks.BookmarkTreeNode) => void;
};

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
      enabled: !deleteDialogOpen && !editDialogOpen,
      enableOnFormTags: false,
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
      enabled: !deleteDialogOpen && !editDialogOpen,
      enableOnFormTags: false,
    }
  );
};
