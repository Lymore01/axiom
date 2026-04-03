export function createRegex(path: string, paramNames: string[] = []) {
  const regexSource = path
    .replace(/\//g, "\\/")
    .replace(/:([^/]+)/g, (_, name) => {
      if (!paramNames.includes(name)) paramNames.push(name);
      return "([^/]+)";
    })
    .replace(/\*/g, "(.*)");

  return new RegExp(`^${regexSource}$`);
}

export function formatValidationError(error: any) {
  const formatted: Record<string, string> = {};
  const list = error.issues || error.errors;

  if (Array.isArray(list)) {
    list.forEach((err) => {
      const path = err.path.join(".") || "_form";
      formatted[path] = err.message;
    });
    return formatted;
  }

  return { _form: error.message || "Unknown validation error" };
}
