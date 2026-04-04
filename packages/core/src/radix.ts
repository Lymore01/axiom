import type { Route } from "./types";

export class RadixNode<D extends Record<string, any>> {
  public part: string;
  public children: Map<string, RadixNode<D>> = new Map();
  public wildcardChild: RadixNode<D> | null = null;
  public paramName: string | null = null;
  public handlers: Map<string, Route<D>> = new Map();

  constructor(part: string = "", paramName: string | null = null) {
    this.part = part;
    this.paramName = paramName;
  }

  public insert(
    segments: string[],
    method: string,
    route: Route<D>,
    index: number = 0,
  ): void {
    if (index === segments.length) {
      this.handlers.set(method, route);
      return;
    }

    const currentSegment = segments[index];
    const isWildcard = currentSegment.startsWith(":");

    if (isWildcard) {
      const paramName = currentSegment.slice(1);
      if (!this.wildcardChild) {
        this.wildcardChild = new RadixNode(currentSegment, paramName);
      }
      this.wildcardChild.insert(segments, method, route, index + 1);
    } else {
      if (!this.children.has(currentSegment)) {
        this.children.set(currentSegment, new RadixNode(currentSegment));
      }
      this.children
        .get(currentSegment)!
        .insert(segments, method, route, index + 1);
    }
  }

  public search(
    segments: string[],
    method: string,
    index: number = 0,
    params: Record<string, string> = {},
  ): { route: Route<D>; params: Record<string, string> } | null {
    if (index === segments.length) {
      const route = this.handlers.get(method);
      return route ? { route, params } : null;
    }

    const currentSegment = segments[index];

    // 1. Try static match
    const child = this.children.get(currentSegment);
    if (child) {
      const result = child.search(segments, method, index + 1, params);
      if (result) return result;
    }

    // 2. Try wildcard match
    if (this.wildcardChild && this.wildcardChild.paramName) {
      const newParams = {
        ...params,
        [this.wildcardChild.paramName]: currentSegment,
      };
      const result = this.wildcardChild.search(
        segments,
        method,
        index + 1,
        newParams,
      );
      if (result) return result;
    }

    return null;
  }
}

export class RadixTree<D extends Record<string, any>> {
  private root: RadixNode<D> = new RadixNode("");

  public add(method: string, path: string, route: Route<D>) {
    const segments = this.splitPath(path);
    this.root.insert(segments, method.toUpperCase(), route);
  }

  public match(method: string, path: string) {
    const segments = this.splitPath(path);
    return this.root.search(segments, method.toUpperCase());
  }

  private splitPath(path: string): string[] {
    return path.split("/").filter(Boolean);
  }
}
