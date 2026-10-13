import { useState, useEffect, useCallback } from "react";

type Bookmark = chrome.bookmarks.BookmarkTreeNode;

export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [folders, setFolders] = useState<Bookmark[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string>("1");
  const [searchQuery, setSearchQuery] = useState("");

  const flattenBookmarks = useCallback(
    (nodes: Bookmark[]): Bookmark[] =>
      nodes.reduce<Bookmark[]>((acc, node) => {
        if (node.children) {
          return [...acc, node, ...flattenBookmarks(node.children)];
        }
        return [...acc, node];
      }, []),
    []
  );

  const loadBookmarks = useCallback(() => {
    chrome.bookmarks.getTree(
      (bookmarkTreeNodes: chrome.bookmarks.BookmarkTreeNode[]) => {
        const allBookmarks = flattenBookmarks(bookmarkTreeNodes);
        const topLevelFolders = allBookmarks.filter((b) => b.parentId === "0");
        setFolders(topLevelFolders);
        setBookmarks(allBookmarks);
      }
    );
  }, [flattenBookmarks]);

  useEffect(() => {
    loadBookmarks();
  }, [loadBookmarks]);

  const filteredBookmarks = bookmarks.filter((bookmark) => {
    const matchesSearch =
      bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bookmark.url?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFolder = bookmark.parentId === selectedFolder;
    return matchesSearch && matchesFolder && bookmark.url;
  });

  return {
    bookmarks,
    filteredBookmarks,
    folders,
    refreshBookmarks: loadBookmarks,
    searchQuery,
    selectedFolder,
    setSearchQuery,
    setSelectedFolder,
  };
};
