import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { PimPage } from '../pages/pim-page';
import searchTestData from '../test-data/search-data.json';

/**
 * Employee Search Tests - Data-Driven Testing
 * Reads test cases from test-data/search-data.json
 * Covers: search by name, partial match, no results, empty search
 */
test.describe('OrangeHRM PIM Employee Search - Data-Driven Tests', () => {
  // Log in before each test
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login('Admin', 'admin123');
    await page.waitForURL(/dashboard/, { timeout: 20000 });
  });

  for (const testCase of searchTestData) {
    test(`${testCase.description}`, async ({ page }) => {
      const pimPage = new PimPage(page);
      await pimPage.navigate();

      await pimPage.searchByEmployeeName(testCase.employeeName);

      if (testCase.expectedResult === 'found') {
        // Verify table is visible and has at least 1 record
        await pimPage.expectResultsVisible();
        const rowCount = await pimPage.getTableRowCount();
        expect(rowCount).toBeGreaterThan(0);
      } else if (testCase.expectedResult === 'not_found') {
        // Verify no records found message appears
        const noRecords = await pimPage.hasNoRecords();
        expect(noRecords).toBeTruthy();
      }
    });
  }
});
