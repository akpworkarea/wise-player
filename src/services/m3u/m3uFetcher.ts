import { parseM3U, extractEpgUrl, groupByCategory } from './m3uParser';
import { Channel, Category } from '../../types/channel.types';
import { Config } from '../../constants/config';

export interface FetchM3UResult {
  channels: Channel[];
  categories: Category[];
  epgUrl?: string;
  channelCount: number;
  error?: string;
}

export const fetchM3U = async (url: string): Promise<FetchM3UResult> => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), Config.m3uTimeout);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'WisePlayer/1.0',
      },
    });
    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const content = await response.text();

    if (!content.includes('#EXTM3U')) {
      throw new Error('Invalid M3U format');
    }

    const epgUrl = extractEpgUrl(content);
    const channels = parseM3U(content);
    const categories = groupByCategory(channels);

    return {
      channels,
      categories,
      epgUrl,
      channelCount: channels.length,
    };
  } catch (error: any) {
    return {
      channels: [],
      categories: [],
      channelCount: 0,
      error: error?.message ?? 'Failed to fetch playlist',
    };
  }
};

export const validateM3UUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
};
