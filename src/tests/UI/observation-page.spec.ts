import { test, expect } from '@playwright/test';

test.describe('Observation Page', () => {
  test('Observation info on the page', async ({ page }) => {
    await page.goto('https://www.inaturalist.org/observations/393858124');

    const body = page.locator('body');
    await expect(body).toContainText('Elaphe dione');

    const title = page.locator('.ObservationTitle');
    await expect(title).toContainText('Steppe Ratsnake');

    const gallery = page.locator('.image-gallery');
    await expect(gallery.locator('img[src*=".jpg"]')).not.toHaveCount(0);

    const userInfo = page.locator('.user_info');
    await expect(userInfo).toContainText('shtepbraiter');

    const map = page.locator('.Map');
    await expect(map).toBeVisible();
  });

  test('Activity info on the page', async ({ page }) => {
    await page.goto('https://www.inaturalist.org/observations/393858124');
    
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);

    const identifications = page.locator('.ActivityItem.identification.by-someone-else');
    await expect(async () => {
      expect(await identifications.count()).toBeGreaterThanOrEqual(4);
    }).toPass();

    const firstIdentification = identifications.first();
    await expect(firstIdentification).toContainText('shtepbraiter');
    await expect(firstIdentification).toContainText('Steppe Ratsnake');
  });

  test('Projects info on the page', async ({ page }) => {
    await page.goto('https://www.inaturalist.org/observations/393858124');

    const projectsPanel = page.locator('#projects-panel');
    await expect(projectsPanel).toBeVisible();

    const projectEntries = projectsPanel.locator('.projectEntry');
    await expect(projectEntries).not.toHaveCount(0);

    const projectLink = projectsPanel.locator('a[href="/projects/205575"]');
    await expect(projectLink.first()).toBeVisible();
  });
});
