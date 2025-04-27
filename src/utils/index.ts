export function matchCurrentTab(rules: string, tabUrl: string) {
  return rules
    .split('\n')
    .filter((i: string) => !!i.trim())
    .some((r: string) => tabUrl.includes(r) || new RegExp(r).test(tabUrl));
}
