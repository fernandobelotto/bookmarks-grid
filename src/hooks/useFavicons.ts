import { useState } from "react";

export const useFavicons = () => {
  const [faviconCache, setFaviconCache] = useState<Record<string, string>>({});

  // SVG fallback icon with a nice gradient
  const defaultFavicon = `data:image/svg+xml,${encodeURIComponent(`
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="6" fill="url(#gradient)"/>
      <path d="M16 8C11.5817 8 8 11.5817 8 16C8 20.4183 11.5817 24 16 24C20.4183 24 24 20.4183 24 16C24 11.5817 20.4183 8 16 8ZM13.9333 19.2667H12.7333V14.4H13.9333V19.2667ZM13.3333 13.7333C12.9333 13.7333 12.6 13.4 12.6 13C12.6 12.6 12.9333 12.2667 13.3333 12.2667C13.7333 12.2667 14.0667 12.6 14.0667 13C14.0667 13.4 13.7333 13.7333 13.3333 13.7333ZM19.4667 19.2667H18.2667V16.6C18.2667 15.9333 18.2667 15.0667 17.3333 15.0667C16.4 15.0667 16.2667 15.8 16.2667 16.5333V19.2667H15.0667V14.4H16.2667V15C16.5333 14.6 17 14.2667 17.8667 14.2667C19.0667 14.2667 19.4667 15.1333 19.4667 16.2667V19.2667Z" fill="white"/>
      <defs>
        <linearGradient id="gradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stop-color="#4F46E5"/>
          <stop offset="1" stop-color="#7C3AED"/>
        </linearGradient>
      </defs>
    </svg>
  `)}`;

  const getFaviconUrl = (url: string) => {
    try {
      const urlObject = new URL(url);
      const domain = urlObject.hostname;

      if (faviconCache[domain]) {
        return faviconCache[domain];
      }

      return `https://icons.duckduckgo.com/ip3/${domain}.ico`;
    } catch {
      return defaultFavicon;
    }
  };

  const handleFaviconError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
    url: string
  ) => {
    try {
      const urlObject = new URL(url);
      const domain = urlObject.hostname;
      const target = e.target as HTMLImageElement;

      // If DuckDuckGo's favicon fails, try Google's service
      if (target.src.includes("google.com")) {
        // If Google's service also fails, use our custom fallback
        target.src = defaultFavicon;
        // Cache the fallback to prevent further requests
        setFaviconCache((prev) => ({
          ...prev,
          [domain]: defaultFavicon,
        }));
      } else {
        target.src = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
      }
    } catch {
      const target = e.target as HTMLImageElement;
      target.src = defaultFavicon;
    }
  };

  return {
    getFaviconUrl,
    handleFaviconError,
  };
};
