import type { Handler, Route, RouteSchema } from "./types";
import { createRegex } from "./utils";

export class Router<D extends Record<string, any>> {
  private routes: Route<D>[] = [];

  add<Path extends string, S extends RouteSchema, Return>(
    method: string,
    path: Path,
    handler: Handler<Path, S, D, Return>,
    state: {
      derives: any[];
      decorators: any;
      onRequests: any[];
      onResponses: any[];
      beforeHandles: any[];
      afterHandles: any[];
    },
    schema?: S,
  ) {
    const paramNames: string[] = [];

    const route: Route<D> = {
      method,
      path,
      regex: createRegex(path, paramNames),
      handler: handler as any,
      paramNames,
      schema,
      derives: [...state.derives],
      decorators: { ...state.decorators },
      onRequests: [...state.onRequests],
      onResponses: [...state.onResponses],
      beforeHandles: [...state.beforeHandles],
      afterHandles: [...state.afterHandles],
    };

    this.routes.push(route);
    return route;
  }

  match(method: string, pathname: string) {
    for (const route of this.routes) {
      if (route.method === method) {
        const match = pathname.match(route.regex);
        if (match) return { route, match };
      }
    }
    return null;
  }

  getRoutes() {
    return this.routes;
  }

  setRoutes(routes: Route<D>[]) {
    this.routes = routes;
  }
}
