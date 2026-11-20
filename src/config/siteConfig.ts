export type SiteMode = 'DISTRIBUTOR' | 'AUDIENCE';

// Toggle to 'AUDIENCE' ahead of Spring 2027 theatrical release to swap
// B2B Pitch Deck / Screener actions for theatrical ticket booking without touching animations or audio.
export const SITE_MODE: SiteMode = 'DISTRIBUTOR';

// Keep true for B2B distributors & festival programmers so they see the full emotional climax.
// Flip to false before Spring 2027 theatrical audience launch to hide the finish-line twist.
export const SHOW_B2B_SPOILERS: boolean = true;

export const PROMO_VIDEO_CONFIG = {
  src: './promo_3min_zh.mp4?v=smooth3',
  poster: './stills/hero_vest_web.webp',
  durationLabel: '03:00',
  // Set requirePin to true if you want a 4-digit gate before playing the Rough Cut
  requirePin: false,
  pinCode: '2027',
};

export const CONTACT_CONFIG = {
  email: 'sergey@sijicbond.site',
  altEmail: 'sijicbond@gmail.com',
  phone: '+7 776 800 6262',
  phoneHref: 'tel:+77768006262',
  pitchDeckUrl: './NOT_EXTRA_CHINA_PITCH_DECK.pdf',
  ruDeckUrl: './NE_LISHNIE_Film_Pitch_Deck_RU.pdf',
  instagramUrl: 'https://www.instagram.com/ne_lishnie_film',
  ticketsUrl: '#tickets', // Used when SITE_MODE === 'AUDIENCE'
};
