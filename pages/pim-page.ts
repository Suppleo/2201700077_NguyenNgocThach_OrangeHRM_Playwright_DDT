import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object for OrangeHRM PIM (Employee List) Page
 * URL: /web/index.php/pim/viewEmployeeList
 * Used for employee search tests via Data-Driven Testing.
 */
export class PimPage {
  readonly page: Page;
  readonly resultsTable: Locator;

  constructor(page: Page) {
    this.page = page;
    this.resultsTable = page.locator('.oxd-table');
  }

  async navigate(): Promise<void> {
    await this.page.goto('/web/index.php/pim/viewEmployeeList');
    await this.page.waitForURL(/pim\/viewEmployeeList/, { timeout: 20000 });
    await this.page.waitForLoadState('networkidle');
  }

  // Type in Employee Name autocomplete and submit search
  async searchByEmployeeName(name: string): Promise<void> {
    // Employee Name is an autocomplete input with placeholder "Type for hints..."
    const nameInput = this.page.locator(
      '.oxd-autocomplete-text-input input[placeholder="Type for hints..."]'
    ).first();
    await nameInput.waitFor({ state: 'visible', timeout: 10000 });
    await nameInput.clear();

    if (name) {
      await nameInput.fill(name);
      // Wait for autocomplete dropdown, then dismiss it
      await this.page.waitForTimeout(1000);
      await nameInput.press('Escape');
    }

    // Click Search button
    await this.page.locator('button[type="submit"]').click();
    // Wait for results to load
    await this.page.waitForLoadState('networkidle');
    await this.resultsTable.waitFor({ state: 'visible', timeout: 15000 });
  }

  // Check if "No Records Found" is displayed
  async hasNoRecords(): Promise<boolean> {
    try {
      const noRecords = this.page.getByText('No Records Found');
      await noRecords.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  // Count data rows in the table
  async getTableRowCount(): Promise<number> {
    try {
      await this.resultsTable.waitFor({ state: 'visible', timeout: 10000 });
      return await this.page.locator('.oxd-table-body .oxd-table-row').count();
    } catch {
      return 0;
    }
  }

  async expectResultsVisible(): Promise<void> {
    await expect(this.resultsTable).toBeVisible({ timeout: 15000 });
  }
}
