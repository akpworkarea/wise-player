import { XMLParser } from 'fast-xml-parser';
import { EpgChannel, EpgProgram, NowNext } from '../../types/epg.types';

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
});

export const fetchEpg = async (epgUrl: string): Promise<EpgChannel[]> => {
  try {
    const response = await fetch(epgUrl, {
      headers: { 'User-Agent': 'WisePlayer/1.0' },
    });
    if (!response.ok) throw new Error('EPG fetch failed');
    const xml = await response.text();
    return parseEpgXml(xml);
  } catch {
    return [];
  }
};

const parseEpgXml = (xml: string): EpgChannel[] => {
  try {
    const result = parser.parse(xml);
    const tv = result?.tv;
    if (!tv) return [];

    const programmes = Array.isArray(tv.programme) ? tv.programme : [tv.programme].filter(Boolean);
    const channelMap = new Map<string, EpgProgram[]>();

    programmes.forEach((prog: any) => {
      const channelId = prog['@_channel'];
      if (!channelId) return;

      const program: EpgProgram = {
        id: `${channelId}_${prog['@_start']}`,
        channelId,
        title: typeof prog.title === 'string' ? prog.title : prog.title?.['#text'] ?? 'Unknown',
        description: typeof prog.desc === 'string' ? prog.desc : prog.desc?.['#text'],
        startTime: parseEpgTime(prog['@_start']),
        endTime: parseEpgTime(prog['@_stop']),
        category: typeof prog.category === 'string' ? prog.category : undefined,
      };

      const existing = channelMap.get(channelId) ?? [];
      channelMap.set(channelId, [...existing, program]);
    });

    const channels: EpgChannel[] = [];
    channelMap.forEach((programs, id) => {
      channels.push({ id, name: id, programs });
    });

    return channels;
  } catch {
    return [];
  }
};

// Parse XMLTV time format: 20240101120000 +0000
const parseEpgTime = (timeStr: string): number => {
  if (!timeStr) return 0;
  const clean = timeStr.replace(/\s.*/, '');
  const y = clean.slice(0, 4);
  const mo = clean.slice(4, 6);
  const d = clean.slice(6, 8);
  const h = clean.slice(8, 10);
  const mi = clean.slice(10, 12);
  const s = clean.slice(12, 14);
  return new Date(`${y}-${mo}-${d}T${h}:${mi}:${s}Z`).getTime();
};

// Get now/next for a channel
export const getNowNext = (programs: EpgProgram[]): NowNext => {
  const now = Date.now();
  const current = programs.find((p) => p.startTime <= now && p.endTime >= now);
  const next = programs.find((p) => p.startTime > now);
  return { now: current, next };
};
