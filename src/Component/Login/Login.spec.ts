import { test, expect } from '@playwright/test';

test('Error Test', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('input[type="email"]', 'invalid-email');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');

    await expect(page.locator('text=Please Input Email or correct Email')).toBeVisible();

    await page.fill('input[type="email"]', 'test@example.com');
    await page.click('button[type="submit"]');

    await expect(page.locator('text=Please Input Email or correct Email')).not.toBeVisible();

    await page.fill('input[type="password"]', '');
    await page.click('button[type="submit"]');

    await expect(page.locator('text=Please Input Password')).toBeVisible();

    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');

    await expect(page.locator('text=Please Input Password')).not.toBeVisible();

})