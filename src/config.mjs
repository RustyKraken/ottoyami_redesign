// Verified against OTTOYAMI's official website on 7 October 2026.
// Keep all booking links in one place. The official page hosts the Reservly form.
export const RESERVATION_URL = 'https://www.ottoyami.at/reservation';
export const restaurant = {
  name: 'OTTOYAMI',
  website: 'https://www.ottoyami.at',
  phone: '+43 1 581 01 10',
  phoneHref: 'tel:+4315810110',
  email: 'ottoyami1060@gmail.com',
  street: 'Otto-Bauer-Gasse 20',
  postcode: '1060',
  city: 'Wien',
  hours: '11:00–22:30',
  kitchenHours: '11:00–22:00',
  instagram: 'https://www.instagram.com/otto.yami',
  facebook: 'https://www.facebook.com/ottoyami',
  maps: 'https://www.google.com/maps/search/?api=1&query=OTTOYAMI%20Otto-Bauer-Gasse%2020%201060%20Wien',
};
export const prices = [
  { name: 'Mittag', days: 'Montag – Freitag', hours: '11:00–17:00', amount: '17,90' },
  { name: 'Abend', days: 'Montag – Freitag', hours: '17:00–22:00', amount: '26,90' },
  { name: 'Wochenende', days: 'Samstag, Sonntag & Feiertag', hours: '11:00–22:00', amount: '26,90' },
];
// Short verbatim excerpts, not invented testimonials or a live Google API feed.
// Google reviews preserved at https://wanderlog.com/place/details/3980386
export const reviews = [
  { name: 'Maori I', quote: 'A great spot for sushi lovers!', date: '27. September 2025', iso: '2025-09-27', rating: 5, url: 'https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT2pGaVJEaEpkMDgxUVRGUk1rVlZZekowVlRKalRVRRAB!2m1!1s0x476d078aa938fc6d:0xcc9067ef6f456dcd!3m1!1s2' },
  { name: 'Rareș G', quote: 'AYCE experience was 100% worth it.', date: '30. Oktober 2025', iso: '2025-10-30', rating: 5, url: 'https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT25GelNIRnRSRFZ5UW1KSmQwcFJSM2RSUTJONVEyYxAB!2m1!1s0x476d078aa938fc6d:0xcc9067ef6f456dcd!3m1!1s2' },
  { name: 'Lindsey B', quote: 'Quality fresh sushi. Lovely staff.', date: '8. März 2026', iso: '2026-03-08', rating: 5, url: 'https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT2paVWNqTmZVR0ZHWkdWaWQzUnFielJxY2xabVMyYxAB!2m1!1s0x476d078aa938fc6d:0xcc9067ef6f456dcd!3m1!1s2' },
];
