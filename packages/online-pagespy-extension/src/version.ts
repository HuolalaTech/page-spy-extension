import packageInfo from '@huolala-tech/page-spy-browser/package.json';

export async function getVersion() {
  const curVersion = document.querySelector('.version .current') as HTMLSpanElement;
  curVersion.textContent = packageInfo.version;

  const latestVersion = document.querySelector('.version .latest') as HTMLSpanElement;
  try {
    const res = await fetch('https://registry.npmmirror.com/@huolala-tech/page-spy-browser');
    const info = await res.clone().json();
    const { latest } = info['dist-tags'];
    latestVersion.textContent = latest;
  } catch (e) {
    latestVersion.textContent = '--';
  }
}
