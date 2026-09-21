import { invitation } from './invitation-config.js';

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
// Animated starfield adapted from the supplied background demo.
(function(){
  const sky=document.getElementById('sky');
  const n=window.innerWidth<600?420:700; // fewer stars on small screens
  const f=document.createDocumentFragment();
  for(let i=0;i<n;i++){
    const el=document.createElement('div');el.className='star';
    const r=Math.random();
    const size=r<.04?3.4:r<.12?2.6:r<.3?1.9:Math.random()*1.1+.7;
    el.style.cssText=`width:${size}px;height:${size}px;left:${(Math.random()*100).toFixed(2)}%;`+
      `top:${(Math.random()*100).toFixed(2)}%;--dur:${(Math.random()*3+2.2).toFixed(2)}s;`+
      `--delay:${(Math.random()*5).toFixed(2)}s;opacity:.5;`+
      `box-shadow:0 0 ${(size*4).toFixed(1)}px ${(size*.7).toFixed(1)}px rgba(255,255,255,.85)`;
    f.appendChild(el);
  }
  sky.appendChild(f);
})();

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const cover = $('#cover');
const invitationBook = $('#main');
let openingInvitation = false;
function openInvitation(animate = true, destination = null) {
  if (openingInvitation || invitationBook.classList.contains('is-open')) return;
  openingInvitation = true;
  $('#open-invitation').setAttribute('aria-expanded', 'true');
  cover.classList.add('opening');
  const reveal = () => {
    cover.hidden = true;
    invitationBook.classList.add('is-open');
    window.scrollTo({ top: 0, behavior: 'instant' });
    $('#invitation-title').focus({ preventScroll: true });
    if (destination) destination.scrollIntoView({ behavior: 'instant' });
    openingInvitation = false;
  };
  if (animate && !reducedMotion.matches) setTimeout(reveal, 550);
  else reveal();
}
$('#open-invitation').addEventListener('click', (event) => {
  event.preventDefault();
  openInvitation();
});
$('#close-invitation').addEventListener('click', () => {
  invitationBook.classList.remove('is-open');
  cover.classList.remove('opening');
  cover.hidden = false;
  $('#open-invitation').setAttribute('aria-expanded', 'false');
  history.replaceState(null, '', location.pathname + location.search);
  window.scrollTo({ top: 0, behavior: 'instant' });
  $('#open-invitation').focus({ preventScroll: true });
});
// A direct RSVP/details link opens the card at its destination.
function openHashDestination() {
  let destination;
  try { destination = document.getElementById(decodeURIComponent(location.hash.slice(1))); }
  catch { return; }
  if (destination && invitationBook.contains(destination)) openInvitation(false, destination);
}
openHashDestination();
window.addEventListener('hashchange', openHashDestination);
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('is-waiting');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.06 });
  $$('.reveal').forEach((element) => { element.classList.add('is-waiting'); observer.observe(element); });
}

// Keep all editable names together in invitation-config.js.
const tributeTypes = [
  ['roses', 'Roses', 'A dance to remember', '❀'],
  ['gifts', 'Gifts', 'Tokens of love', '◇'],
  ['candles', 'Candles', 'Wishes that glow', '✧'],
  ['bills', 'Bills', 'Dreams to begin', '♧'],
  ['wine', 'Wine', 'A toast to tomorrow', '♜']
];
const mobileLayout = window.matchMedia('(max-width: 600px)');
tributeTypes.forEach(([key, title, subtitle, symbol], index) => {
  const panel = document.createElement('details');
  panel.className = 'tribute';
  panel.open = !mobileLayout.matches || index === 0;
  const heading = document.createElement('summary');
  heading.innerHTML = `<span class="tribute-symbol" aria-hidden="true">${symbol}</span><h3>18 ${title}</h3><p>${subtitle}</p>`;
  const list = document.createElement('ol');
  list.setAttribute('aria-label', `18 ${title} participants`);
  Array.from({ length: 18 }, (_, position) => {
    const item = document.createElement('li');
    const name = invitation.tributes[key]?.[position]?.trim();
    item.textContent = name || 'To be announced';
    if (!name) item.className = 'empty';
    list.append(item);
  });
  panel.append(heading, list);
  $('#tribute-grid').append(panel);
});

Object.entries(invitation.photos).forEach(([key, source]) => {
  if (!source) return;
  const slot = $(`[data-photo="${key}"]`);
  const picture = new Image();
  picture.alt = { portrait: 'Jean Angela in her navy blue debut gown', detail: 'A beautiful detail from Jean Angela’s debut', candid: 'A candid portrait of Jean Angela' }[key];
  picture.loading = 'eager';
  // Retain the placeholder if an image path is incorrect.
  picture.addEventListener('load', () => {
    slot.querySelector('.portrait-placeholder, .photo-placeholder').replaceWith(picture);
  }, { once: true });
  picture.src = source;
});

const venueQuery = encodeURIComponent(`Bahay ni Mudra By Madam Kilay ${invitation.venueAddress}`.trim());
const mapDefaults = {
  google: `https://www.google.com/maps/search/?api=1&query=${venueQuery}`,
  waze: `https://waze.com/ul?q=${venueQuery}&utm_source=jean_invitation`,
  apple: `https://maps.apple.com/?q=${venueQuery}`
};
function safeLink(value) {
  try { return ['https:', 'http:', 'mailto:', 'tel:'].includes(new URL(value).protocol); }
  catch { return false; }
}
$$('[data-map]').forEach((link) => {
  const configured = invitation.maps[link.dataset.map];
  link.href = configured && safeLink(configured) ? configured : mapDefaults[link.dataset.map];
});
if (invitation.venueAddress) {
  $('#venue-address').textContent = invitation.venueAddress;
  $('#venue-location').textContent = invitation.venueAddress;
}
if (Object.values(invitation.maps).every(Boolean)) {
  $('#map-note').textContent = 'Choose your favorite map app for directions. We can’t wait to see you.';
}
if (invitation.rsvpDeadline) {
  $('#rsvp-deadline').hidden = false;
  $('#rsvp-deadline').textContent = `Kindly reply by ${invitation.rsvpDeadline}.`;
}
if (invitation.contactLink && safeLink(invitation.contactLink)) {
  $('#host-contact').hidden = false;
  $('#host-contact').href = invitation.contactLink;
  $('#host-contact').textContent = `Get in touch${invitation.contactName ? ` with ${invitation.contactName}` : ' with the host'} ↗`;
}

if (Number.isInteger(invitation.year)) {
  $$('[data-year]').forEach((element) => { element.textContent = invitation.year; });
  const date = `${invitation.year}-${String(invitation.month).padStart(2, '0')}-${String(invitation.day).padStart(2, '0')}`;
  const eventTime = new Date(`${date}T${invitation.arrivalTime}${invitation.timezoneOffset}`);
  if (!Number.isNaN(eventTime.getTime())) {
    const weekday = eventTime.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'Asia/Manila' });
    $('[data-event-day]').textContent = `${weekday}, ${invitation.year}`;
    const countdown = $('#countdown');
    countdown.hidden = false;
    function updateCountdown() {
      const remaining = eventTime.getTime() - Date.now();
      if (remaining <= 0) {
        countdown.hidden = true;
        return;
      }
      const values = [Math.floor(remaining / 86400000), Math.floor(remaining / 3600000) % 24, Math.floor(remaining / 60000) % 60];
      countdown.innerHTML = '<p>A little closer to the magic</p>' + values.map((value, i) => `<div class="countdown-unit"><b>${String(value).padStart(2, '0')}</b><span>${['Days', 'Hours', 'Minutes'][i]}</span></div>`).join('');
    }
    updateCountdown();
    setInterval(updateCountdown, 60000);
  }
}

// A real Formspree endpoint is required. The preview never simulates a saved RSVP.
const form = $('#rsvp-form');
const steps = $$('[data-step]');
const nextButton = $('#form-next');
const backButton = $('#form-back');
const submitButton = $('#form-submit');
const status = $('#form-status');
const connected = /^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]+$/.test(invitation.formspreeEndpoint);
$('#rsvp-preview-notice').hidden = connected;
let step = 0;
let submitting = false;
function validateStep(index) {
  if (index === 1) $('#guest-name').value = $('#guest-name').value.trim();
  const invalid = [...steps[index].querySelectorAll('input, textarea')].find((field) => !field.checkValidity());
  if (invalid) {
    status.textContent = index === 0 ? 'Please choose your reply to continue.' : 'Please enter your name and a valid email address.';
    invalid.reportValidity();
    invalid.focus();
    return false;
  }
  return true;
}
function showStep(index, focus = true) {
  step = index;
  steps.forEach((fieldset, i) => {
    fieldset.hidden = i !== step;
    // Hidden steps must not participate in native focus/validation.
    fieldset.disabled = i !== step;
  });
  $$('[data-progress]').forEach((item, i) => {
    if (i === step) item.setAttribute('aria-current', 'step');
    else item.removeAttribute('aria-current');
  });
  backButton.hidden = step === 0;
  nextButton.hidden = step === 2;
  submitButton.hidden = step !== 2;
  status.textContent = '';
  if (step === 2) {
    const review = $('#rsvp-review');
    review.replaceChildren();
    const values = [
      ['Your reply', $('input[name="attendance"]:checked').value],
      ['Guest name', $('#guest-name').value],
      ['Email', $('#guest-email').value],
      ['A note for Jean', $('#guest-message').value || 'With love, always.']
    ];
    values.forEach(([label, value]) => {
      const term = document.createElement('dt');
      const description = document.createElement('dd');
      term.textContent = label; description.textContent = value;
      review.append(term, description);
    });
    $('#connection-notice').hidden = connected;
    submitButton.disabled = !connected;
    submitButton.textContent = connected ? 'Send my RSVP ↗' : 'RSVP opens soon';
  }
  if (focus) {
    const legend = steps[step].querySelector('legend');
    legend.tabIndex = -1;
    legend.focus({ preventScroll: true });
  }
}
nextButton.addEventListener('click', () => { if (validateStep(step)) showStep(step + 1); });
backButton.addEventListener('click', () => { if (!submitting) showStep(step - 1); });
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (step < 2) {
    if (validateStep(step)) showStep(step + 1);
    return;
  }
  if (!connected || submitting) return;
  submitting = true;
  submitButton.disabled = true;
  backButton.disabled = true;
  submitButton.textContent = 'Sending your reply…';
  status.textContent = '';
  const payload = new FormData();
  payload.set('attendance', $('input[name="attendance"]:checked').value);
  payload.set('name', $('#guest-name').value.trim());
  payload.set('email', $('#guest-email').value.trim());
  payload.set('message', $('#guest-message').value.trim());
  payload.set('_gotcha', form.elements._gotcha.value);
  payload.set('_subject', 'Jean Angela at 18 — RSVP');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch(invitation.formspreeEndpoint, {
      method: 'POST', body: payload, headers: { Accept: 'application/json' }, signal: controller.signal
    });
    if (!response.ok) throw new Error('The RSVP service could not accept the response.');
    form.hidden = true;
    $('.form-progress').hidden = true;
    $('#rsvp-success').hidden = false;
    $('#success-message').textContent = payload.get('attendance') === 'Joyfully attending'
      ? 'Thank you for your reply. I can’t wait to celebrate with you on October 16!'
      : 'Thank you for letting me know. Your love and wishes mean the world to me.';
    $('#rsvp-success').focus();
  } catch {
    status.textContent = 'We couldn’t confirm your reply was received. Your details are still here—please try again, or contact the host if this continues.';
  } finally {
    clearTimeout(timeout);
    submitting = false;
    submitButton.disabled = false;
    backButton.disabled = false;
    submitButton.textContent = 'Send my RSVP ↗';
  }
});
showStep(0, false);
