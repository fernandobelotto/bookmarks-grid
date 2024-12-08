import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil, Trash2 } from "lucide-react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "./ui/context-menu";
import { useFavicons } from "../hooks/useFavicons";

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
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const { getFaviconUrl, handleFaviconError } = useFavicons();

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div
          style={style}
          className="group bg-white dark:bg-gray-800 h-[40px] w-full rounded shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-3 px-4 overflow-hidden focus:outline-none focus:ring-2 focus:ring-slate-400"
          onMouseEnter={() => setFocusedBookmarkId(bookmark.id)}
          onMouseLeave={() => setFocusedBookmarkId(null)}
        >
          <a
            href={bookmark.url}
            className="flex items-center gap-3 min-w-0 flex-1"
            target="_blank"
            rel="noopener noreferrer"
            onFocus={() => setFocusedBookmarkId(bookmark.id)}
            onBlur={() => setFocusedBookmarkId(null)}
          >
            <img
              src={getFaviconUrl(bookmark.url!)}
              alt=""
              className="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform duration-200"
              onError={(e) => handleFaviconError(e, bookmark.url!)}
              loading="lazy"
            />
            <span className="text-sm text-gray-700 dark:text-gray-200 truncate">
              {bookmark.title}
            </span>
          </a>

          <div
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded flex-shrink-0"
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
