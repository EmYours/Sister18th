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
  formspreeEndpoint: 'https://formspree.io/f/mnpnpbpn',
  // Use local images in assets/photos. Keep empty to display the placeholders.
  photos: {
    portrait: 'assets/oval.jpg', // Vertical portrait wearing the navy debut gown; 4:5 ratio.
    detail: 'assets/C2.jpg',    // Close-up of the gown, a ribbon, flowers, or a handwritten note.
    candid: 'assets/box1.jpg'     // A relaxed outdoor portrait in soft late-afternoon light.
  },
  // Each list has 18 spaces. Replace empty strings with names, in program order.
  tributes: {
    roses:   ['Kuya Gelo', 'Alford', 'Kian', 'Ajin', 'Andrei', 'David', 'Dwayne', 'Zion', 'Sebastian','Jahred', 'Tito Jake', 'Tito Marvin', 'Tito Mark Anthony', 'Tito Marlon', 'Tito Daryn', 'Daddy Doming', 'Tito Nog', 'Papa James'],
    gifts:   ['Macy/Aira', 'Elaine', 'Ate Grace', 'Ate Angel', 'Ate CJ', 'Apple', 'Madison', 'Zyzy', 'Angelo Orano', 'Ate Arjay', 'Tita Tin', 'Tita Christine', 'Mackane', 'Mami Ema', 'Mami Sonia', 'Mami Cely', 'Mami Annie', 'Mami Marilyn/Dadi bert'],
    candles: ['ChamCham', 'Ate Alex', 'Ate Pat', 'Ate Angel', 'Ate Grace', 'Ate Angie', 'Ate Ashley', 'Ate Zoey','Tita Helen', 'Tita Janice', 'Tita Cindy', 'Tita Rox',  'Tita Raquel', 'Tita Zarra', 'Tita Tin', 'Tita Annalyn', 'Mami Ana', 'Mama Diane'],
    bills:   ['Kuya Nate', 'Ate Zoey', 'Ate Pam', 'Tito Don', 'Tito Leonard Mark', 'Tito Jerome', 'Tito Delfin', 'Tito Raymondo', 'Tito Allan', 'Tito Angelo', 'Tito Mark Olit', 'Tito Jaypaul', 'Tito Oliver', 'Daddy Carlos', 'Daddy Mario', 'Tita Helen', 'Tita Princess', 'Tita Nev/Tito Nog'],
    wine:    ['Kuya Harry', 'Kuya Joss','Ate Pat', 'Kuya Justine','Ate Alex' ,'Kuya Justin Oppa', 'Kuya Rap²',  'Aidrek', 'Jahred', 'Kian', 'Mackane', 'Elaine', 'Tito Helbert', 'Tito Pudong','Tito Christian', 'Tita Rom', 'Tita Precious Grace', 'ChamCham']
  }
};
