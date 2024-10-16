


document.querySelector('#submit').addEventListener('click', async () => {
  chrome.runtime.sendMessage('button-clicked');
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  console.log('当前 tab', tabs); // 返回当前的 active tab，结果符合预期
});
