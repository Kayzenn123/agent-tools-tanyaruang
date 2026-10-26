import { getPermalink, getAsset } from './utils/permalinks';

// TanyaRuang: navigasi hanya 3 loket, tanpa menu template.
// Header/Footer template tetap memakai bentuk data yang sama agar
// halaman lain (homes/landing/dll) tidak rusak, tapi isinya hanya
// anchor ke loket di halaman utama.
export const headerData = {
  links: [
    {
      text: 'Loket Guru',
      href: getPermalink('/#loket-guru'),
    },
    {
      text: 'Loket Kuis',
      href: getPermalink('/#loket-kuis'),
    },
    {
      text: 'Loket Ringkasan',
      href: getPermalink('/#loket-ringkasan'),
    },
  ],
  actions: [{ text: 'Pilih tiket', href: getPermalink('/#papan') }],
};

export const footerData = {
  links: [
    {
      title: 'Loket',
      links: [
        { text: 'Loket Guru', href: getPermalink('/#loket-guru') },
        { text: 'Loket Kuis', href: getPermalink('/#loket-kuis') },
        { text: 'Loket Ringkasan', href: getPermalink('/#loket-ringkasan') },
      ],
    },
  ],
  secondaryLinks: [],
  socialLinks: [{ ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') }],
  footNote: `TanyaRuang — ruang belajar pelajar Indonesia.`,
};
