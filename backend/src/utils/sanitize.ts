import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const window = new JSDOM('').window;
const purify = DOMPurify(window);

// Configure DOMPurify to allow common safe HTML tags for CMS content
const ALLOWED_TAGS = [
  'p', 'br', 'hr',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'strong', 'b', 'em', 'i', 'u', 'strike', 's',
  'a', 'img',
  'ul', 'ol', 'li',
  'blockquote', 'code', 'pre',
  'div', 'span', 'sup', 'sub',
  'table', 'thead', 'tbody', 'tr', 'td', 'th',
  'iframe', // For embeds like YouTube
  'figure', 'figcaption',
];

const ALLOWED_ATTR = [
  'href', 'title', 'target', 'rel',
  'src', 'alt', 'width', 'height', 'class', 'id',
  'style',
  'frameborder', 'allowfullscreen', 'allow',
  'srcdoc', 'sandbox',
  'data-*', // Allow data attributes
];

// Add hook to force target="_blank" and rel on all links
purify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A') {
    node.setAttribute('target', '_blank');
    node.setAttribute('rel', 'noopener noreferrer nofollow');
  }
  // Ensure iframe src is from trusted domains
  if (node.tagName === 'IFRAME') {
    const src = node.getAttribute('src') || '';
    const allowedDomains = [
      'youtube.com',
      'www.youtube.com',
      'youtube-nocookie.com',
      'www.youtube-nocookie.com',
      'twitter.com',
      'x.com',
      'player.vimeo.com',
    ];
    const isAllowed = allowedDomains.some(domain => src.includes(domain));
    if (!isAllowed) {
      node.removeAttribute('src');
    }
  }
});

export const sanitizeHtml = (dirty: string): string => {
  if (!dirty) return dirty;
  return purify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    KEEP_CONTENT: true,
  });
};

export const sanitizePlainText = (dirty: string): string => {
  if (!dirty) return dirty;
  return purify.sanitize(dirty, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
  });
};
