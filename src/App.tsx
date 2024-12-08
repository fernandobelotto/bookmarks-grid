import { useBookmarks } from "./hooks/useBookmarks";
import { useFavicons } from "./hooks/useFavicons";
import { useSearchShortcut } from "./hooks/useSearchShortcut";
import { useBookmarkShortcuts } from "./hooks/useBookmarkShortcuts";
import { useDarkMode } from "./hooks/useDarkMode";
import { Tabs, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "./components/ui/context-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from "./components/ui/dialog";
import { Pencil, Trash2, Moon, Sun } from "lucide-react";
import { useState } from "react";

type EditBookmarkData = {
  id: string;
  title: string;
  url: string;
};

type DeleteBookmarkData = {
  id: string;
  title: string;
};

const App = () => {
  const {
    folders,
    selectedFolder,
    setSelectedFolder,
    searchQuery,
    setSearchQuery,
    filteredBookmarks,
    refreshBookmarks,
  } = useBookmarks();

  const { getFaviconUrl, handleFaviconError } = useFavicons();
  const { searchInputRef } = useSearchShortcut();
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingBookmark, setEditingBookmark] =
    useState<EditBookmarkData | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingBookmark, setDeletingBookmark] =
    useState<DeleteBookmarkData | null>(null);
  const [focusedBookmarkId, setFocusedBookmarkId] = useState<string | null>(
    null
  );

  const handleEdit = (bookmark: chrome.bookmarks.BookmarkTreeNode) => {
    setEditingBookmark({
      id: bookmark.id,
      title: bookmark.title,
      url: bookmark.url || "",
    });
    setEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (editingBookmark) {
      chrome.bookmarks.update(
        editingBookmark.id,
        {
          title: editingBookmark.title,
          url: editingBookmark.url,
        },
        () => {
          setEditDialogOpen(false);
          setEditingBookmark(null);
          refreshBookmarks();
        }
      );
    }
  };

  const handleDelete = (bookmark: chrome.bookmarks.BookmarkTreeNode) => {
    setDeletingBookmark({
      id: bookmark.id,
      title: bookmark.title,
    });
    setDeleteDialogOpen(true);
  };

  useBookmarkShortcuts({
    focusedBookmarkId,
    deleteDialogOpen,
    editDialogOpen,
    filteredBookmarks,
    onEdit: handleEdit,
    onDelete: handleDelete,
  });

  const handleConfirmDelete = () => {
    if (deletingBookmark) {
      chrome.bookmarks.remove(deletingBookmark.id, () => {
        setDeleteDialogOpen(false);
        setDeletingBookmark(null);
        refreshBookmarks();
      });
    }
  };

  return (
    <div className="min-h-screen h-screen w-screen bg-gray-50 dark:bg-gray-900 flex flex-col overflow-hidden">
      <div className="w-full h-full p-4 flex flex-col">
        {/* Header with Tabs, Search, and Dark Mode Toggle */}
        <div className="flex-none">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <Tabs
                value={selectedFolder}
                onValueChange={setSelectedFolder}
                className="bg-transparent"
              >
                <TabsList className="w-full justify-start h-auto p-1 bg-transparent">
                  {folders.map((folder) => (
                    <TabsTrigger
                      key={folder.id}
                      value={folder.id}
                      className="m-1 bg-white dark:bg-gray-800 data-[state=active]:bg-slate-800 dark:data-[state=active]:bg-slate-600 border-slate-400 data-[state=active]:text-white"
                    >
                      {folder.title}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            <div className="flex items-center gap-4">
              {/* Search Bar */}
              <div className="w-[300px]">
                <Input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search bookmarks... (⌘K)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="dark:bg-gray-800 dark:text-gray-100"
                />
              </div>

              {/* Dark Mode Toggle */}
              <Button
                variant="outline"
                size="icon"
                onClick={toggleDarkMode}
                className="dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                {isDarkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Bookmarks Grid */}
        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] auto-rows-[40px] gap-4">
            {filteredBookmarks.map((bookmark) => (
              <ContextMenu key={bookmark.id}>
                <ContextMenuTrigger asChild>
                  <a
                    href={bookmark.url}
                    className="group bg-white dark:bg-gray-800 h-[40px] w-full rounded shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-3 px-4 overflow-hidden focus:outline-none focus:ring-2 focus:ring-slate-400"
                    onClick={(e) => {
                      if (e.button === 2) {
                        e.preventDefault();
                      }
                    }}
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
                    <span className="text-sm text-gray-700 dark:text-gray-200 truncate flex-1">
                      {bookmark.title}
                    </span>
                  </a>
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
            ))}
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Bookmark</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <Input
                id="title"
                value={editingBookmark?.title || ""}
                onChange={(e) =>
                  setEditingBookmark((prev) =>
                    prev ? { ...prev, title: e.target.value } : null
                  )
                }
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="url" className="text-sm font-medium">
                URL
              </label>
              <Input
                id="url"
                value={editingBookmark?.url || ""}
                onChange={(e) =>
                  setEditingBookmark((prev) =>
                    prev ? { ...prev, url: e.target.value } : null
                  )
                }
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button onClick={handleSaveEdit}>Save</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Bookmark</DialogTitle>
          </DialogHeader>
          <div className="grid py-4">
            <p className="text-lg text-gray-700 dark:text-gray-200">
              Are you sure you want to delete "{deletingBookmark?.title}"? This
              action cannot be undone.
            </p>
          </div>

          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button variant="destructive" onClick={handleConfirmDelete}>
                Delete
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default App;
