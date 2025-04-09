export function matchCurrentTab(rules: string, tabUrl: string) {
  return rules
    .split('\n')
    .filter((i: string) => !!i.trim())
    .map((d: string) => new RegExp(d))
    .some((r) => r.test(tabUrl));
}
