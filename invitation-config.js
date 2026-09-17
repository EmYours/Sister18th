// Edit this file to personalize the invitation. All values here are public.
export const invitation = {
  // Leave null until the year is confirmed. This keeps the countdown hidden.
  year: 2026,
  month: 10,
  day: 16,
  arrivalTime: '15:30:00',
  timezoneOffset: '+08:00',
  venueAddress: 'Bahay ni Mudra by Madam Kilay · Calamba, Laguna',
  // Paste verified sharing links from each map app before sharing with guests.
  maps: {
    google: 'https://maps.app.goo.gl/RsjPyaUUP2HkeXKs5',
    waze: 'https://waze.com/ul?ll=14.1806561%2C121.1749828&navigate=yes&utm_source=jean_invitation',
    apple: 'https://maps.apple.com/?daddr=14.1806561%2C121.1749828&dirflg=d'
  },
  rsvpDeadline: '', // Example: 'October 9, 2026'
  contactName: '',
  contactLink: '', // Example: 'mailto:your@email.com' or 'tel:+639...'
  formspreeEndpoint: '', // Example: 'https://formspree.io/f/YOUR_FORM_ID'
  // Use local images in assets/photos. Keep empty to display the placeholders.
  photos: {
    portrait: '', // Vertical portrait wearing the navy debut gown; 4:5 ratio.
    detail: '',   // Close-up of the gown, a ribbon, flowers, or a handwritten note.
    candid: ''    // A relaxed outdoor portrait in soft late-afternoon light.
  },
  // Each list has 18 spaces. Replace empty strings with names, in program order.
  tributes: {
    roses:   ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    gifts:   ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    candles: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    bills:   ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    wine:    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']
  }
};
