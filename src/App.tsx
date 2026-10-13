import type { DragEndEvent } from "@dnd-kit/core";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { Moon, Sun } from "lucide-react";
import { useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

import { SortableBookmark } from "./components/SortableBookmark";
import { Button } from "./components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./components/ui/dialog";
import { Input } from "./components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "./components/ui/tabs";
import { useBookmarks } from "./hooks/useBookmarks";
import { useBookmarkShortcuts } from "./hooks/useBookmarkShortcuts";
import { useDarkMode } from "./hooks/useDarkMode";
import { useSearchShortcut } from "./hooks/useSearchShortcut";

interface EditBookmarkData {
  id: string;
  title: string;
  url: string;
}

interface DeleteBookmarkData {
  id: string;
  title: string;
}

interface CreateBookmarkData {
  title: string;
  url: string;
}

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

  const { searchInputRef } = useSearchShortcut();
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingBookmark, setEditingBookmark] =
    useState<EditBookmarkData | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingBookmark, setDeletingBookmark] =
    useState<DeleteBookmarkData | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newBookmark, setNewBookmark] = useState<CreateBookmarkData>({
    title: "",
    url: "",
  });
  const [focusedBookmarkId, setFocusedBookmarkId] = useState<string | null>(
    null
  );

  useHotkeys(
    "n",
    (e) => {
      if (!editDialogOpen && !deleteDialogOpen && !createDialogOpen) {
        e.preventDefault();
        setCreateDialogOpen(true);
      }
    },
    {
      enableOnFormTags: false,
      enabled: !editDialogOpen && !deleteDialogOpen && !createDialogOpen,
    }
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

  const handleCreateBookmark = () => {
    if (newBookmark.title && newBookmark.url) {
      chrome.bookmarks.create(
        {
          parentId: selectedFolder,
          title: newBookmark.title,
          url: newBookmark.url,
        },
        () => {
          setCreateDialogOpen(false);
          setNewBookmark({ title: "", url: "" });
          refreshBookmarks();
        }
      );
    }
  };

  useBookmarkShortcuts({
    deleteDialogOpen,
    editDialogOpen,
    filteredBookmarks,
    focusedBookmarkId,
    onDelete: handleDelete,
    onEdit: handleEdit,
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

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const newIndex = filteredBookmarks.findIndex((b) => b.id === over.id);

      // Update the order in Chrome bookmarks
      chrome.bookmarks
        .move(active.id as string, {
          index: newIndex,
        })
        .then(() => {
          refreshBookmarks();
        });
    }
  };

  return (
    <div className="flex h-screen min-h-screen w-screen flex-col overflow-hidden bg-gray-50 dark:bg-gray-900">
      <div className="flex h-full w-full flex-col p-4">
        {/* Header with Tabs, Search, and Dark Mode Toggle */}
        <div className="flex-none">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <Tabs
                value={selectedFolder}
                onValueChange={setSelectedFolder}
                className="bg-transparent"
              >
                <TabsList className="h-auto w-full justify-start bg-transparent p-1">
                  {folders.map((folder) => (
                    <TabsTrigger
                      key={folder.id}
                      value={folder.id}
                      className="m-1 border-slate-400 bg-white data-[state=active]:bg-slate-800 data-[state=active]:text-white dark:bg-gray-800 dark:data-[state=active]:bg-slate-600"
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
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={filteredBookmarks.map((b) => b.id)}
              strategy={rectSortingStrategy}
            >
              <div className="grid auto-rows-[40px] grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
                {filteredBookmarks.map((bookmark) => (
                  <SortableBookmark
                    key={bookmark.id}
                    bookmark={bookmark}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                    setFocusedBookmarkId={setFocusedBookmarkId}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Bookmark</DialogTitle>
          </DialogHeader>
          <div className="max-h-[200px] overflow-y-auto py-4">
            <p className="text-lg text-gray-700 dark:text-gray-200">
              Are you sure you want to delete "
              <span className="line-clamp-3 inline-block align-bottom">
                {deletingBookmark?.title}
              </span>
              "? This action cannot be undone.
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

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Bookmark</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="new-title" className="text-sm font-medium">
                Title
              </label>
              <Input
                id="new-title"
                value={newBookmark.title}
                onChange={(e) =>
                  setNewBookmark((prev) => ({ ...prev, title: e.target.value }))
                }
                autoFocus
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="new-url" className="text-sm font-medium">
                URL
              </label>
              <Input
                id="new-url"
                value={newBookmark.url}
                onChange={(e) =>
                  setNewBookmark((prev) => ({ ...prev, url: e.target.value }))
                }
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button
                variant="outline"
                onClick={() => setNewBookmark({ title: "", url: "" })}
              >
                Cancel
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button onClick={handleCreateBookmark}>Create</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default App;
