import { Page } from '@playwright/test';

/**
 * Page Object for OrangeHRM PIM (Employee List) Page
 * URL: /web/index.php/pim/viewEmployeeList
 * Used for employee search tests via Data-Driven Testing.
 */
export class PimPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigate(): Promise<void> {
    await this.page.goto('/web/index.php/pim/viewEmployeeList');
    await this.page.waitForURL(/pim\/viewEmployeeList/, { timeout: 20000 });
    await this.page.waitForLoadState('networkidle');
  }

  // Type in Employee Name autocomplete and submit search
  async searchByEmployeeName(name: string): Promise<void> {
    // Employee Name autocomplete input with placeholder "Type for hints..."
    const nameInput = this.page.getByPlaceholder('Type for hints...').first();
    await nameInput.waitFor({ state: 'visible', timeout: 10000 });
    await nameInput.clear();

    if (name) {
      await nameInput.fill(name);
      // Wait for autocomplete dropdown, then dismiss
      await this.page.waitForTimeout(1000);
      await nameInput.press('Escape');
    }

    // Click Search button
    await this.page.getByRole('button', { name: 'Search' }).click();
    // Wait for results to load
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1500);
  }

  // Get records count from "(N) Records Found" text
  async getRecordsFoundCount(): Promise<number> {
    try {
      const span = this.page.locator('span').filter({ hasText: /Record/ });
      await span.first().waitFor({ state: 'visible', timeout: 10000 });
      const text = await span.first().textContent() ?? '';
      const match = text.match(/\((\d+)\)/);
      return match ? parseInt(match[1], 10) : 0;
    } catch {
      return 0;
    }
  }

  // Check if "No Records Found" is displayed (in table area or toast)
  async hasNoRecords(): Promise<boolean> {
    try {
      const noRecords = this.page.getByText('No Records Found').first();
      await noRecords.waitFor({ state: 'visible', timeout: 10000 });
      return true;
    } catch {
      return false;
    }
  }

  async expectResultsVisible(): Promise<void> {
    // Wait for either "Records Found" or "No Records Found" to appear
    await this.page.locator('span').filter({ hasText: /Record/ }).first()
      .waitFor({ state: 'visible', timeout: 15000 });
  }
}
