import type { ReactNode } from 'react';

// LinkItemType matches the shape expected by the ejected link-item.tsx component.
// This mirrors the internal type from fumadocs-ui that is not publicly exported.
export type LinkItemType =
  | {
      type: 'main';
      url: string;
      text: ReactNode;
      icon?: ReactNode;
      external?: boolean;
    }
  | {
      type: 'menu';
      url?: string;
      text: ReactNode;
      icon?: ReactNode;
      external?: boolean;
      items: Exclude<LinkItemType, { type: 'icon' | 'menu' | 'custom' }>[];
    }
  | {
      type: 'icon';
      url: string;
      text: string;
      label?: string;
      icon: ReactNode;
      external?: boolean;
    }
  | {
      type: 'button';
      url: string;
      text: ReactNode;
      icon?: ReactNode;
      external?: boolean;
    }
  | {
      type: 'custom';
      children: ReactNode;
    };

/**
 * Checks whether a given link item should be considered "active" based on the
 * current pathname. A link is active when the current pathname starts with its
 * url (so parent routes are also highlighted).
 */
export function isLinkItemActive(
  item: Exclude<LinkItemType, { type: 'icon' | 'custom' }>,
  pathname: string,
): boolean {
  if (!('url' in item) || !item.url) return false;
  if (item.url === '/') return pathname === '/';
  return pathname === item.url || pathname.startsWith(`${item.url}/`);
}
