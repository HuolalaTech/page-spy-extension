import packageInfo from '@huolala-tech/page-spy/package.json';

export async function getVersion() {
  const curVersion = document.querySelector('.version .current');
  curVersion.textContent = packageInfo.version;

  const latestVersion = document.querySelector('.version .latest');
  try {
    const res = await fetch(
      'https://registry.npmmirror.com/@huolala-tech/page-spy'
    );
    const info = await res.clone().json();
    const { latest } = info['dist-tags'];
    latestVersion.textContent = latest;
  } catch (e) {
    latestVersion.textContent = '--';
  }
}
