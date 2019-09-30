export const getStorage = key => new Promise(r => chrome.storage.local.get([key], result => r(result[key])));

export const loadChannels = async () => {
  const cache = await getStorage('channelCache');
  if (cache) {
    return cache;
  }

  const body = await fetch('https://www.youtube.com').then(r => r.text());
  const jsonRegex = /var ytInitialGuideData = {(.+?)};\n/gi;
  const res = jsonRegex.exec(body);
  const obj = JSON.parse(`{${res[1]}}`);
  const {
    items: [_, subscriptions],
  } = obj;
  const {
    guideSubscriptionsSectionRenderer: {items},
  } = subscriptions;
  const channels = items
    .map(it =>
      it.guideCollapsibleEntryRenderer
        ? it.guideCollapsibleEntryRenderer.expandableItems.map(it => it.guideEntryRenderer)
        : it.guideEntryRenderer
    )
    .flat()
    .filter(it => it.title !== 'Browse channels')
    .map(it => ({
      name: it.formattedTitle.simpleText,
      url: `https://www.youtube.com${it.navigationEndpoint.commandMetadata.webCommandMetadata.url}`,
      thumbnail: it.thumbnail.thumbnails[0].url,
      // original: it,
    }));

  chrome.storage.local.set({channelCache: channels});
  return channels;
};

export const loadData = async () => {
  const cache = await getStorage('cache');
  if (cache) {
    return cache;
  }

  const channels = await loadChannels();

  const ch = channels.find(ch => ch.name === 'Jesse Cox');

  const fetchChannel = async ({url}) => {
    const body = await fetch(`${url}/videos`).then(r => r.text());
    const jsonRegex = /window\["ytInitialData"\] = {(.+?)};\n/gi;
    const regexRes = jsonRegex.exec(body);
    const obj = JSON.parse(`{${regexRes[1]}}`);

    const videos =
      obj.contents.twoColumnBrowseResultsRenderer.tabs[1].tabRenderer.content.sectionListRenderer.contents[0]
        .itemSectionRenderer.contents[0].gridRenderer.items;

    const res = videos.map(({gridVideoRenderer: vid}) => ({
      thumbnail: vid.thumbnail.thumbnails[0].url,
      title: vid.title.simpleText,
      publishedTime: vid.publishedTimeText.simpleText,
      viewCount: vid.viewCountText.simpleText,
      watched: vid.thumbnailOverlays[0].thumbnailOverlayResumePlaybackRenderer.percentDurationWatched,
      url: `https://www.youtube.com${vid.navigationEndpoint.commandMetadata.webCommandMetadata.url}`,
    }));
    return res;
  };

  const d = await fetchChannel(ch);
  chrome.storage.local.set({cache: d});
  return d;
};
