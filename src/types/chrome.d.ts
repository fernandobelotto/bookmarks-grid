declare namespace chrome {
  export namespace bookmarks {
    interface BookmarkTreeNode {
      id: string;
      parentId?: string;
      index?: number;
      url?: string;
      title: string;
      dateAdded?: number;
      dateGroupModified?: number;
      unmodifiable?: "managed";
      children?: BookmarkTreeNode[];
    }

    type Callback = (results: BookmarkTreeNode[]) => void;
    type UpdateCallback = () => void;
    type RemoveCallback = () => void;

    interface UpdateChanges {
      title?: string;
      url?: string;
    }

    export function getTree(callback: Callback): void;
    export function update(
      id: string,
      changes: UpdateChanges,
      callback?: UpdateCallback
    ): void;
    export function remove(id: string, callback?: RemoveCallback): void;
  }
}
