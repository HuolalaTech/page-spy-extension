chrome.runtime.onMessage.addListener(async (...args) => {
  const tabs1 = await chrome.tabs.query({ active: true, currentWindow: true });
  const tabs2 = await chrome.tabs.query({ active: false, currentWindow: true });
  const tabs3 = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true
  });
  const tabs4 = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true
  });
  console.log({
    tabs1,
    tabs2,
    tabs3,
    tabs4
  }); // tabs 是空数组？
});
