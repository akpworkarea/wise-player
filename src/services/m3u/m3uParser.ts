import { Channel, Category } from '../../types/channel.types';
import { Config } from '../../constants/config';

// Extract EPG URL from M3U header
export const extractEpgUrl = (m3uContent: string): string | undefined => {
  const urlTvgMatch = m3uContent.match(/url-tvg="([^"]+)"/i);
  if (urlTvgMatch) return urlTvgMatch[1];
  const xTvgMatch = m3uContent.match(/x-tvg-url="([^"]+)"/i);
  if (xTvgMatch) return xTvgMatch[1];
  return undefined;
};

// Check if group title is adult content
const isAdultGroup = (groupTitle: string): boolean => {
  const lower = groupTitle.toLowerCase();
  return Config.adultKeywords.some((kw) => lower.includes(kw));
};

// Generate stable channel ID from name + url
const generateChannelId = (name: string, url: string): string => {
  const raw = `${name}_${url}`;
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    const char = raw.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
};

// Parse raw M3U string into Channel array
export const parseM3U = (content: string): Channel[] => {
  const channels: Channel[] = [];
  const lines = content.split('\n').map((l) => l.trim());

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith('#EXTINF:')) {
      const namePart = line.split(',').slice(1).join(',').trim();
      const groupMatch = line.match(/group-title="([^"]*)"/i);
      const logoMatch = line.match(/tvg-logo="([^"]*)"/i);
      const tvgIdMatch = line.match(/tvg-id="([^"]*)"/i);
      const tvgNameMatch = line.match(/tvg-name="([^"]*)"/i);

      const groupTitle = groupMatch?.[1] ?? 'General';
      const logo = logoMatch?.[1];
      const tvgId = tvgIdMatch?.[1];
      const tvgName = tvgNameMatch?.[1];

      // Get stream URL (next non-comment line)
      let streamUrl = '';
      let j = i + 1;
      while (j < lines.length) {
        const next = lines[j];
        if (next && !next.startsWith('#')) {
          streamUrl = next;
          i = j;
          break;
        }
        j++;
      }

      if (streamUrl && namePart) {
        channels.push({
          id: generateChannelId(namePart, streamUrl),
          name: namePart,
          streamUrl,
          logo,
          groupTitle,
          tvgId,
          tvgName,
          isAdult: isAdultGroup(groupTitle),
        });
      }
    }
    i++;
  }

  return channels;
};

// Group channels into categories
export const groupByCategory = (channels: Channel[]): Category[] => {
  const map = new Map<string, Channel[]>();

  channels.forEach((ch) => {
    const existing = map.get(ch.groupTitle) ?? [];
    map.set(ch.groupTitle, [...existing, ch]);
  });

  const categories: Category[] = [];
  map.forEach((chs, name) => {
    categories.push({
      id: name.toLowerCase().replace(/\s+/g, '_'),
      name,
      channels: chs,
      isAdult: isAdultGroup(name),
      isLocked: isAdultGroup(name),
    });
  });

  // Sort: non-adult first, then adult
  return categories.sort((a, b) => {
    if (a.isAdult && !b.isAdult) return 1;
    if (!a.isAdult && b.isAdult) return -1;
    return a.name.localeCompare(b.name);
  });
};
