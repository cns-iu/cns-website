const WB_API = 'https://archive.org/wayback/available?url=';

export async function getWaybackUrl(url) {
  const body = await fetch(WB_API + encodeURIComponent(url)).then((r) => r.json());
  const wbUrl = body?.archived_snapshots?.closest?.url;
  if (!wbUrl) {
    console.error(`Please archive: https://web.archive.org/save/${url}`);
    return `https://web.archive.org/web/20260000000000*/${url}`;
  } else {
    return wbUrl;
  }
}
