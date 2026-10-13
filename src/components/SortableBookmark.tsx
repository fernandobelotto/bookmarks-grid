import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil, Trash2 } from "lucide-react";

import { useFavicons } from "../hooks/useFavicons";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "./ui/context-menu";

export const SortableBookmark = ({
  bookmark,
  handleEdit,
  handleDelete,
  setFocusedBookmarkId,
}: {
  bookmark: chrome.bookmarks.BookmarkTreeNode;
  handleEdit: (bookmark: chrome.bookmarks.BookmarkTreeNode) => void;
  handleDelete: (bookmark: chrome.bookmarks.BookmarkTreeNode) => void;
  setFocusedBookmarkId: (id: string | null) => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: bookmark.id });

  const style = {
    opacity: isDragging ? 0.5 : 1,
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const { getFaviconUrl, handleFaviconError } = useFavicons();

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div
          style={style}
          className="group flex h-[40px] w-full items-center gap-3 overflow-hidden rounded bg-white px-4 shadow-sm transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-slate-400 dark:bg-gray-800"
          onMouseEnter={() => setFocusedBookmarkId(bookmark.id)}
          onMouseLeave={() => setFocusedBookmarkId(null)}
        >
          <a
            href={bookmark.url}
            className="flex min-w-0 flex-1 items-center gap-3"
            target="_blank"
            rel="noopener noreferrer"
            onFocus={() => setFocusedBookmarkId(bookmark.id)}
            onBlur={() => setFocusedBookmarkId(null)}
          >
            <img
              src={getFaviconUrl(bookmark.url!)}
              alt=""
              className="h-5 w-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
              onError={(e) => handleFaviconError(e, bookmark.url!)}
              loading="lazy"
            />
            <span className="truncate text-sm text-gray-700 dark:text-gray-200">
              {bookmark.title}
            </span>
          </a>

          <div
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            className="flex-shrink-0 cursor-grab rounded p-1 hover:bg-gray-100 active:cursor-grabbing dark:hover:bg-gray-700"
          >
            <GripVertical className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuItem onClick={() => handleEdit(bookmark)}>
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => handleDelete(bookmark)}
          className="text-red-600 focus:text-red-600"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
