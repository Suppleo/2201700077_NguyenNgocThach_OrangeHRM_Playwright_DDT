import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object for OrangeHRM Dashboard Page
 * URL: /web/index.php/dashboard/index
 * Used to verify successful login and navigate to modules.
 */
export class DashboardPage {
  readonly page: Page;
  readonly dashboardHeader: Locator;
  readonly mainMenu: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dashboardHeader = page.locator('.oxd-topbar-header-breadcrumb h6');
    this.mainMenu = page.locator('.oxd-main-menu');
  }

  async isLoaded(): Promise<boolean> {
    try {
      await this.page.waitForURL(/dashboard/, { timeout: 20000 });
      return true;
    } catch {
      return false;
    }
  }

  async navigateToModule(moduleName: string): Promise<void> {
    const menuItem = this.page.locator('.oxd-main-menu-item').filter({
      hasText: moduleName,
    });
    await menuItem.waitFor({ state: 'visible', timeout: 10000 });
    await menuItem.click();
  }

  async expectDashboardVisible(): Promise<void> {
    await expect(this.page).toHaveURL(/dashboard/, { timeout: 20000 });
  }
}
