import { test, expect } from '@playwright/test';
import { deleteLatestByUser } from '../../api/observation';

test.describe('Create Observation', () => {

  const token = process.env.INATURALIST_API_TOKEN;
  //TODO Add use EN 
  test('upload page has file selection button', async ({ page, request }) => {
    if (!token) {
      throw new Error('INATURALIST_API_TOKEN environment variable is required');
    }

    await page.route('**/*', (route) => {
      route.continue({
        headers: {
          ...route.request().headers(),
          'Authorization': `Bearer ${token}`,
        },
      });
    });

    await page.goto('https://www.inaturalist.org/observations/upload');

    const addFilesButton = page.locator('button.btn.btn-lg.btn-primary');
    await expect(addFilesButton).toBeVisible();

    const addPButton = page.locator('#add_photos');
    await expect(addPButton).toBeVisible();

    await addPButton.click();

    const noMediaOption = page.getByRole('menuitem', { name: 'Наблюдение без медиафайлов' });
    await noMediaOption.click();

    const obsCard = page.locator('.ObsCardComponent');
    await expect(obsCard).toBeVisible();

    const taxonInput = obsCard.locator('input[type="text"][name="taxon_name"]');
    await taxonInput.fill('Elaphe dione');

    const taxonSuggestion = page.locator('[data-taxon-id="30282"]');
    await taxonSuggestion.click();

    const calendarIcon = obsCard.locator('input.form-control.input-sm[placeholder="Дата"]');
    await calendarIcon.click();

    const activeDay = obsCard.locator('.day.active');
    await activeDay.click();

    const mapMarker = obsCard.locator('input.form-control.input-sm[placeholder="Местоположение"]');
    await mapMarker.click();

    const locationInput = page.locator('.pac-target-input');
    await locationInput.fill('44.047367,76.993988');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    const updateButton = page.locator('button[type="button"]', { hasText: 'Обновить наблюдения' });
    await updateButton.click();

    const submitButton = page.locator('.btn.btn-success.navbar-btn');
    await submitButton.click();

    const modal = page.locator('.modal-content[role="document"]');
    const confirmButton = modal.locator('.btn.btn-primary');
    await confirmButton.click();

    await expect(page.getByText('Сохранение наблюдения...')).toBeVisible();

    await expect(page).toHaveURL(/\/observations\/shtepbraiter/, { timeout: 30000 });

    const result = await deleteLatestByUser(request, 'shtepbraiter', token);
    console.log('Delete result:', JSON.stringify(result, null, 2));
  });
});
