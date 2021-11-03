
type BaseCursor = { limit: number };
export type InitialPaginationArgs = { offset: number } & BaseCursor;
export type CursorPaginationArgs = { lastId: string } & BaseCursor;
export type PaginationArgs = InitialPaginationArgs | CursorPaginationArgs;

export function isVideoCursor(obj: PaginationArgs): obj is CursorPaginationArgs {
  return Boolean((obj as CursorPaginationArgs).lastId);
}

export const DEFAULT_LIMIT = 10;
