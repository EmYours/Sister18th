import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // Ensure tests and screenshots do not depend on third-party font availability.
  await page.route('https://fonts.googleapis.com/**', route => route.abort());
  await page.route('https://fonts.gstatic.com/**', route => route.abort());
});

async function fillReply(page, attendance = 'Joyfully attending', name = 'Invited Guest') {
  await page.getByText(attendance, { exact: true }).click();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByLabel('Your full name').fill(name);
  await page.getByText('Email', { exact: true }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('guest@example.com');
  await page.getByLabel('A little note for Jean').fill('Wishing you a beautiful birthday!');
  await page.getByRole('button', { name: 'Continue' }).click();
}

async function openCard(page) {
  await page.getByRole('link', { name: 'Open your invitation' }).click();
  await expect(page.locator('#main')).toBeVisible();
}

async function useFormspreeEndpoint(page, endpoint) {
  await page.route('**/invitation-config.js', async route => {
    const response = await route.fetch();
    const source = await response.text();
    await route.fulfill({ response, body: source.replace(/formspreeEndpoint: '[^']*'/, `formspreeEndpoint: '${endpoint}'`) });
  });
}

test('responsive layouts, loaded artwork, all tribute spaces, and map destinations', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const width of [320, 375, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    if (width === 390 || width === 1440) {
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({ path: `test-results/cover-${width}.png`, fullPage: true });
    }
    await openCard(page);
    await expect(page.locator('.tribute')).toHaveCount(5);
    await expect(page.locator('.tribute li')).toHaveCount(90);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    for (const img of await page.locator('.outfit-image img').all()) {
      await img.scrollIntoViewIfNeeded();
      await expect(img).toHaveJSProperty('complete', true);
      expect(await img.evaluate(node => node.naturalWidth)).toBeGreaterThan(0);
    }
    if (width === 390 || width === 1440) {
      // Reveal below-fold content for a useful full-page screenshot.
      await page.evaluate(() => document.querySelectorAll('.is-waiting').forEach(node => node.classList.remove('is-waiting')));
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
      await page.waitForTimeout(750);
      await page.screenshot({ path: `test-results/invitation-${width}.png`, fullPage: true });
    }
  }
  await expect(page.locator('[data-map="google"]')).toHaveAttribute('href', 'https://maps.app.goo.gl/RsjPyaUUP2HkeXKs5');
  await expect(page.locator('[data-map="waze"]')).toHaveAttribute('href', /14\.1806561%2C121\.1749828/);
  await expect(page.locator('[data-map="apple"]')).toHaveAttribute('href', /14\.1806561%2C121\.1749828/);
  await expect(page.locator('[data-event-day]')).toHaveText('Friday, 2026');
  expect(errors).toEqual([]);
});

test('RSVP validation, back navigation, safe review, and disconnected endpoint', async ({ page }) => {
  await useFormspreeEndpoint(page, '');
  await page.goto('/');
  await openCard(page);
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page.locator('#form-status')).toContainText('choose your reply');
  await page.getByText('Joyfully attending', { exact: true }).click();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByLabel('Your full name').fill('   ');
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page.locator('[data-step="1"]')).toBeVisible();
  await page.getByLabel('Your full name').fill('<img src=x onerror=alert(1)>');
  await page.getByText('Email', { exact: true }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('wrong');
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page.locator('[data-step="1"]')).toBeVisible();
  await page.getByRole('textbox', { name: 'Email address' }).fill('guest@example.com');
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page.locator('#rsvp-review')).toContainText('<img src=x onerror=alert(1)>');
  await expect(page.locator('#rsvp-review img')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'RSVP opens soon' })).toBeDisabled();
  await expect(page.locator('#connection-notice')).toBeVisible();
  await page.getByRole('button', { name: 'Back' }).click();
  await expect(page.getByRole('textbox', { name: 'Email address' })).toHaveValue('guest@example.com');
});

test('RSVP success sends the entered data once and waits for acceptance', async ({ page }) => {
  await useFormspreeEndpoint(page, 'https://formspree.io/f/test123');
  let count = 0;
  let posted = '';
  await page.route('https://formspree.io/f/test123', async route => {
    count++;
    posted = route.request().postData();
    await new Promise(resolve => setTimeout(resolve, 300));
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
  });
  await page.goto('/');
  await openCard(page);
  await fillReply(page);
  await page.getByRole('button', { name: 'Send my RSVP' }).click();
  await expect(page.locator('#form-submit')).toBeDisabled();
  await expect(page.locator('#rsvp-success')).toBeVisible();
  await expect(page.locator('#success-message')).toContainText('can’t wait to celebrate');
  expect(count).toBe(1);
  for (const value of ['Invited Guest', 'guest@example.com', 'Joyfully attending', 'Wishing you a beautiful birthday!']) expect(posted).toContain(value);
});

test('RSVP failure retains the response and allows a successful retry for a decline', async ({ page }) => {
  await useFormspreeEndpoint(page, 'https://formspree.io/f/test123');
  let count = 0;
  await page.route('https://formspree.io/f/test123', route => {
    count++;
    return route.fulfill({ status: count === 1 ? 500 : 200, contentType: 'application/json', body: '{}' });
  });
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  await openCard(page);
  await fillReply(page, 'Celebrating from afar');
  await page.getByRole('button', { name: 'Send my RSVP' }).click();
  await expect(page.locator('#form-status')).toContainText('couldn’t confirm');
  await expect(page.locator('#rsvp-review')).toContainText('guest@example.com');
  await expect(page.locator('#rsvp-success')).toBeHidden();
  await page.getByRole('button', { name: 'Send my RSVP' }).click();
  await expect(page.locator('#success-message')).toContainText('love and wishes');
});

test('RSVP contact options allow phone or no contact details', async ({ page }) => {
  await useFormspreeEndpoint(page, 'https://formspree.io/f/test123');
  const posts = [];
  await page.route('https://formspree.io/f/test123', route => {
    posts.push(route.request().postData());
    return route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
  });
  await page.goto('/');
  await openCard(page);
  await page.getByText('Joyfully attending', { exact: true }).click();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByLabel('Your full name').fill('Phone Guest');
  await page.getByText('Phone number', { exact: true }).click();
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page.locator('[data-step="1"]')).toBeVisible();
  await page.getByRole('textbox', { name: 'Phone number' }).fill('0917 123 4567');
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page.locator('#rsvp-review')).toContainText('0917 123 4567');
  await page.getByRole('button', { name: 'Send my RSVP' }).click();
  await expect(page.locator('#rsvp-success')).toBeVisible();
  expect(posts[0]).toContain('phone');
  expect(posts[0]).toContain('0917 123 4567');

  await page.reload();
  await openCard(page);
  await page.getByText('Celebrating from afar', { exact: true }).click();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByLabel('Your full name').fill('No Contact Guest');
  await page.getByText('No contact details', { exact: true }).click();
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page.locator('#rsvp-review')).toContainText('None provided');
  await page.getByRole('button', { name: 'Send my RSVP' }).click();
  await expect(page.locator('#success-message')).toContainText('love and wishes');
  expect(posts[1]).toContain('contact_method');
  expect(posts[1]).toContain('none');
});

test('mobile tribute controls and reduced-motion preference work', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await openCard(page);
  await expect(page.locator('.is-waiting')).toHaveCount(0);
  await expect(page.locator('.tribute').nth(1)).not.toHaveAttribute('open', '');
  await page.locator('.tribute').nth(1).locator('summary').click();
  await expect(page.locator('.tribute').nth(1)).toHaveAttribute('open', '');
  expect(await page.locator('.invitation-book').evaluate(node => getComputedStyle(node).animationName)).toBe('none');
});

test('invitation opens by keyboard, closes with focus restored, and supports direct RSVP links', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#main')).toBeHidden();
  await page.locator('#open-invitation').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#cover')).toBeHidden();
  await expect(page.locator('#invitation-title')).toBeFocused();
  await page.getByRole('button', { name: 'Close the invitation' }).click();
  await expect(page.locator('#cover')).toBeVisible();
  await expect(page.locator('#main')).toBeHidden();
  await expect(page.locator('#open-invitation')).toBeFocused();
  await page.goto('/#rsvp');
  await expect(page.locator('#main')).toBeVisible();
  await expect(page.locator('#rsvp')).toBeInViewport();
});
