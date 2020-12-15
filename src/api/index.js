const regexWindow = /window\["ytInitialData"\] = {(.+?)};\n/gi;
const regexVar = /var ytInitialData = {(.+?)};<\//gi;
const regexVarChan = /var ytInitialData = {(.+?)}<\/script>/gi;

export const getStorage = (key) =>
  new Promise((r) =>
    chrome.storage.local.get([key], (result) => r(result[key]))
  );

export const loadChannels = async ({ forceUpdate }) => {
  const cache = await getStorage('channelCache');
  if (cache && !forceUpdate) {
    return cache;
  }

  const body = await fetch('https://www.youtube.com/feed/channels').then((r) =>
    r.text()
  );

  const isWindow = body.includes('window["ytInitialData"]');
  const jsonRegex = isWindow ? regexWindow : regexVarChan;
  const res = jsonRegex.exec(body);
  if (!res) {
    return [];
  }
  const txt = isWindow ? res[1] : res[1].split('};</script>')[0];
  const obj = JSON.parse(`{${txt}}`);
  const items =
    obj?.contents?.twoColumnBrowseResultsRenderer?.tabs?.[0]?.tabRenderer
      ?.content?.sectionListRenderer?.contents?.[0]?.itemSectionRenderer
      ?.contents?.[0]?.shelfRenderer?.content?.expandedShelfContentsRenderer
      ?.items;
  if (!items) {
    return [];
  }
  const channels = items
    .map((it) => it.channelRenderer)
    .flat()
    .filter((it) => it.title?.simpleText !== 'Browse channels')
    .map((it) => ({
      name: it.title?.simpleText,
      url: `https://www.youtube.com/channel/${it.channelId}`,
      thumbnail: `https:${it.thumbnail?.thumbnails?.[0]?.url}`,
      original: it,
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
  const body = await fetch(`${url}/videos`).then((r) => r.text());
  const jsonRegex = body.includes('window["ytInitialData"]')
    ? regexWindow
    : regexVar;
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
    title: vid.title.simpleText ?? vid.title.runs?.[0]?.text,
    publishedTime: vid.publishedTimeText?.simpleText,
    premierTime: vid.upcomingEventData?.startTime,
    isLivestream:
      vid.badges?.find(
        (b) => b.metadataBadgeRenderer.style === 'BADGE_STYLE_TYPE_LIVE_NOW'
      ) !== undefined,
    viewCount: vid.viewCountText?.simpleText ?? 0,
    watched: vid.thumbnailOverlays.find(
      (it) => it.thumbnailOverlayResumePlaybackRenderer !== undefined
    )
      ? vid.thumbnailOverlays.find(
          (it) => it.thumbnailOverlayResumePlaybackRenderer !== undefined
        ).thumbnailOverlayResumePlaybackRenderer.percentDurationWatched
      : 0,
    url: `https://www.youtube.com${vid.navigationEndpoint.commandMetadata.webCommandMetadata.url}`,
  }));
  chrome.storage.local.set({ [ch.name]: res });
  return res;
};
