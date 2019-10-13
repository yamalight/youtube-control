export const getStorage = key =>
  new Promise(r => chrome.storage.local.get([key], result => r(result[key])));

export const loadChannels = async ({ forceUpdate }) => {
  const cache = await getStorage('channelCache');
  if (cache && !forceUpdate) {
    return cache;
  }

  const body = await fetch('https://www.youtube.com').then(r => r.text());
  const jsonRegex = /var ytInitialGuideData = {(.+?)};\n/gi;
  const res = jsonRegex.exec(body);
  if (!res) {
    return [];
  }
  const obj = JSON.parse(`{${res[1]}}`);
  const items = obj.items?.[1]?.guideSubscriptionsSectionRenderer?.items;
  if (!items) {
    return [];
  }
  const channels = items
    .map(
      it =>
        it.guideCollapsibleEntryRenderer?.expandableItems.map(
          it => it.guideEntryRenderer
        ) ?? it.guideEntryRenderer
    )
    .flat()
    .filter(it => it.title !== 'Browse channels')
    .map(it => ({
      name: it.formattedTitle.simpleText,
      url: `https://www.youtube.com${it.navigationEndpoint.commandMetadata.webCommandMetadata.url}`,
      thumbnail: it.thumbnail?.thumbnails?.[0]?.url,
      // original: it,
    }));

  chrome.storage.local.set({ channelCache: channels });
  return channels;
};

export const loadChannel = async (ch, { ignoreCache = false } = {}) => {
  const cache = await getStorage(ch.name);
  if (cache && !ignoreCache) {
    return cache;
  }

  const { url } = ch;
  const body = await fetch(`${url}/videos`).then(r => r.text());
  const jsonRegex = /window\["ytInitialData"\] = {(.+?)};\n/gi;
  const regexRes = jsonRegex.exec(body);
  if (!regexRes) {
    return [];
  }
  const obj = JSON.parse(`{${regexRes[1]}}`);

  const videos =
    obj.contents?.twoColumnBrowseResultsRenderer?.tabs?.[1]?.tabRenderer
      ?.content?.sectionListRenderer?.contents?.[0]?.itemSectionRenderer
      ?.contents?.[0]?.gridRenderer?.items;

  if (!videos) {
    return [];
  }

  const res = videos.map(({ gridVideoRenderer: vid }) => ({
    id: vid.videoId,
    thumbnail: vid.thumbnail.thumbnails[0].url,
    title: vid.title.simpleText,
    publishedTime: vid.publishedTimeText?.simpleText,
    premierTime: vid.upcomingEventData?.startTime,
    isLivestream:
      vid.badges?.find(
        b => b.metadataBadgeRenderer.style === 'BADGE_STYLE_TYPE_LIVE_NOW'
      ) !== undefined,
    viewCount: vid.viewCountText?.simpleText ?? 0,
    watched: vid.thumbnailOverlays.find(
      it => it.thumbnailOverlayResumePlaybackRenderer !== undefined
    )
      ? vid.thumbnailOverlays.find(
          it => it.thumbnailOverlayResumePlaybackRenderer !== undefined
        ).thumbnailOverlayResumePlaybackRenderer.percentDurationWatched
      : 0,
    url: `https://www.youtube.com${vid.navigationEndpoint.commandMetadata.webCommandMetadata.url}`,
  }));
  chrome.storage.local.set({ [ch.name]: res });
  return res;
};
