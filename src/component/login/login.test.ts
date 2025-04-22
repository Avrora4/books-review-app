// BrowserTest 
import { test, expect } from "@playwright/test";
import { url } from "../../const";

test('Error Test1', async ({ page }) => {
    await page.goto(`${url}/login`);
    
    await page.fill('input[type="email"]', '');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');

    await expect(page.locator('text=Please Input Email or correct Email')).toBeVisible();
});

test('Error Test2', async ({ page }) => {
    await page.goto(`${url}/login`);

    await page.fill('input[type="email"]', 'test@example.com');
    await page.click('button[type="submit"]');

    await expect(page.locator('text=Please Input Email or correct Email')).not.toBeVisible();

});

test('Error Test3', async ({ page }) => {
    await page.goto(`${url}/login`);

    await page.fill('input[type="password"]', '');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Please Input Password')).toBeVisible();
})

test('Error Test4', async ({ page }) => {
    await page.goto(`${url}/login`);

    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Please Input Password')).not.toBeVisible();
})