/* global chrome */
const main = async () => {
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
      original: it,
    }));

  const container = document.getElementById('container');
  /*const html = channels
    .map(
      ch => `
<div>
  <a href="${ch.url}"><h3>${ch.name}</h3></a>
  <img src="${ch.thumbnail}" />
</div>
  `
    )
    .join('');*/

  const ch = channels.find(ch => ch.name === 'Jesse Cox');

  const fetchChannel = async ({url}) => {
    const body = await fetch(`${url}/videos`).then(r => r.text());
    const jsonRegex = /window\["ytInitialData"\] = {(.+?)};\n/gi;
    const regexRes = jsonRegex.exec(body);
    const obj = JSON.parse(`{${regexRes[1]}}`);

    const videos = obj.contents.twoColumnBrowseResultsRenderer.tabs[1].tabRenderer.content.sectionListRenderer.contents[0].itemSectionRenderer.contents[0].gridRenderer.items;

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

  let html = `<h1>Videos:</h1>`;
  html += `<div><pre>${JSON.stringify(d, null, 2)}</pre></div>`;
  container.innerHTML = html;
};

main();
