import {expect, test} from '@playwright/test';

test.beforeEach(async ({page}) => {
    await page.goto('https://en.wikipedia.org');
});

test('menu', async ({page}) => {
    await page.getByRole('link', {name: process.env.USERNAME!}).click();
    const nameRegex = new RegExp(`${process.env.USERNAME!}`, 'i')
    await expect(page.getByRole('heading', {name: nameRegex})).toBeVisible();
    await page.getByRole('link', {name: /alerts/i}).click();
    await page.getByText('Alerts', {exact: true}).click();
    await page.getByRole('button', {name: /notice/i}).click();
    await page.getByText('Notices').click();
    await page.getByRole('link', {name: /watchlist/i}).click();
})

test('logs user out', async ({page}) => {
    await page.getByRole('button', {name: /Personal tools/i}).check();
    await page.getByRole('link', {name: /Log out/i}).click();
    await expect(page.getByRole('heading', {name: /Log out/i})).toBeVisible();
    await expect(page.getByRole('link', {name: 'Log in', exact: true})).toBeVisible();
})
