import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { DashboardPage } from '../pages/dashboard-page';
import loginTestData from '../test-data/login-data.json';

/**
 * Login Tests - Data-Driven Testing
 * Reads test cases from test-data/login-data.json
 * Covers: valid login, invalid credentials, empty fields
 */
test.describe('OrangeHRM Login - Data-Driven Tests', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.navigate();
  });

  // Loop through each test case in JSON
  for (const testCase of loginTestData) {
    test(`${testCase.description}`, async ({ page }) => {
      loginPage = new LoginPage(page);
      dashboardPage = new DashboardPage(page);

      await loginPage.navigate();
      await loginPage.login(testCase.username, testCase.password);

      if (testCase.expectedResult === 'success') {
        // Verify redirect to dashboard
        await expect(page).toHaveURL(/dashboard/, { timeout: 20000 });
        await dashboardPage.expectDashboardVisible();
      } else {
        // Verify error is shown - stay on login page
        await expect(page).not.toHaveURL(/dashboard/, { timeout: 5000 });

        if (testCase.expectedError) {
          await loginPage.expectLoginError(testCase.expectedError);
        }
      }
    });
  }
});
