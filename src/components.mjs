import { restaurant as r, RESERVATION_URL } from './config.mjs';
import { Blossom, LogoWide, LogoSquare } from './artwork.mjs';
export const arrow = '<span aria-hidden="true">↗</span>';
export function Container(content, className='') { return `<div class="container ${className}">${content}</div>`; }
export function Section(id, content, className='') { return `<section id="${id}" class="section ${className}" aria-labelledby="${id}-title">${content}</section>`; }
export function SectionHeading(id, eyebrow, title, extra='') { return `<div class="section-heading reveal"><p class="eyebrow">${eyebrow}</p><h2 id="${id}-title">${title}</h2>${extra}</div>`; }
export function Button(label, href=RESERVATION_URL, secondary=false, withArrow=true) {
  // Reservation buttons carry a cherry blossom instead of the arrow.
  if (href===RESERVATION_URL && !secondary) return `<a class="button button--reserve" href="${href}">${Blossom()}${label}</a>`;
  return `<a class="button ${secondary?'button--secondary':''}" href="${href}">${label}${withArrow?arrow:''}</a>`;
}
export function TextLink(label, href, extra='') { return `<a class="text-link" href="${href}" ${extra}>${label}${arrow}</a>`; }
export function VerticalLabel(text) { return `<span class="vertical-label" lang="ja" aria-hidden="true">${text}</span>`; }
export function ImageFrame(name,alt,options={}) {
  const {className='',eager=false,sizes='(max-width: 767px) 100vw, 40vw',width=1000,height=1250}=options;
  const largestWidth = name==='shared-table' ? 1920 : name==='sushi-platter' ? 1080 : 1440;
  return `<div class="image-frame ${className}"><img src="assets/ottoyami-${name}-960.webp" srcset="assets/ottoyami-${name}-480.webp 480w, assets/ottoyami-${name}-960.webp 960w, assets/ottoyami-${name}-${name==='shared-table'?1920:1440}.webp ${largestWidth}w" sizes="${sizes}" width="${width}" height="${height}" alt="${alt}" ${eager?'fetchpriority="high"':'loading="lazy"'} decoding="async"></div>`;
}
export function Logo() { return LogoWide(); }
export function Navigation() {
 const links=[['Startseite','#start'],['All You Can Eat','#all-you-can-eat'],['Speisekarte','#speisekarte'],['Galerie','#galerie'],['Über uns','#ueber-uns'],['Kontakt','#kontakt']];
 return `<a class="skip-link" href="#main">Zum Inhalt</a><header class="site-header"><div class="nav-shell"><a class="brand" href="#start" aria-label="OTTOYAMI – Startseite">${Logo()}</a><nav id="main-navigation" aria-label="Hauptnavigation">${links.map(([label,url])=>`<a href="${url}">${label}</a>`).join('')}<a class="mobile-reservation" href="${RESERVATION_URL}">Tisch reservieren ${arrow}</a></nav><div class="nav-actions"><button class="theme-toggle" type="button" aria-label="Hellen Modus aktivieren"><svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"/></svg><svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" aria-hidden="true"><path d="M19.5 14.6A8 8 0 0 1 9.4 4.5a8 8 0 1 0 10.1 10.1Z"/></svg></button>${Button('Tisch reservieren')}<button class="menu-toggle" aria-label="Menü öffnen" aria-expanded="false" aria-controls="main-navigation"><span></span><span></span></button></div></div></header>`;
}
export function Divider() { return `<div class="decorative-divider" aria-hidden="true"><span></span>${Blossom()}<span></span></div>`; }
export function MenuHighlight({image,alt,japanese,title,description,index}) {
 return `<article class="menu-highlight reveal" style="--reveal-delay:${index*100}ms">${VerticalLabel(japanese)}${ImageFrame(image,alt)}<div class="menu-caption"><span class="item-number">0${index+1}</span><div><h3>${title}</h3><p>${description}</p></div></div></article>`;
}
export function PriceRow(price,index) {return `<div class="price-row"><span class="item-number">0${index+1}</span><h3>${price.name}</h3><p>${price.days}<span>${price.hours} Uhr</span></p><p class="price"><span>€</span> ${price.amount}</p></div>`;}
export function ReviewCard(review) {return `<article class="review-hanger reveal"><div class="review-card"><span class="quote-mark" aria-hidden="true">“</span><div class="blossom-rating" role="img" aria-label="${review.rating} von 5 Sternen">${Blossom().repeat(review.rating)}</div><blockquote lang="en">${review.quote}</blockquote><p class="reviewer">${review.name}</p><time datetime="${review.iso}">${review.date}</time>${TextLink('Auf Google ansehen',review.url)}</div></article>`;}
export function Footer() {
 return `<footer class="site-footer"><div class="footer-art"></div>${Container(`<div class="footer-grid"><div><a class="brand brand--footer" href="#start" aria-label="OTTOYAMI – Startseite">${LogoSquare()}</a><p>Ein Tisch. Viele Lieblingsgerichte.<br>Eine gute Zeit.</p></div><div><p class="eyebrow">Kontakt</p><address>${r.street}<br>${r.postcode} ${r.city}<br><a href="${r.phoneHref}">${r.phone}</a><br><a href="mailto:${r.email}">${r.email}</a></address></div><div><p class="eyebrow">In Verbindung</p><a href="${r.instagram}">Instagram ${arrow}</a><a href="${r.facebook}">Facebook ${arrow}</a></div><div><p class="eyebrow">Entdecken</p><a href="${RESERVATION_URL}">Tisch reservieren</a><a href="https://www.ottoyami.at/menu">Speisekarte</a><a href="#galerie">Galerie</a><a href="#kontakt">Kontakt</a></div></div><div class="footer-bottom"><span>© ${new Date().getFullYear()} OTTOYAMI</span><span>Mit Liebe serviert. In Wien.</span><div><a href="https://www.ottoyami.at/impressum">Impressum</a><a href="https://www.ottoyami.at/datenschutz">Datenschutz</a><a href="#start" aria-label="Zurück nach oben">↑</a></div></div>`)}</footer>`;
}
