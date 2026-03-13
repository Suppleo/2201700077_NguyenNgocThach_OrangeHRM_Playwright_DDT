import { Page, expect } from '@playwright/test';

/**
 * Page Object for OrangeHRM Recruitment / Candidates Page
 * URL: /web/index.php/recruitment/viewCandidates
 * Handles adding new candidates via the Add Candidate form.
 */
export class RecruitmentPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Navigate to Candidates list page
  async navigateToCandidates(): Promise<void> {
    await this.page.goto('/web/index.php/recruitment/viewCandidates');
    await this.page.waitForURL(/recruitment\/viewCandidates/, { timeout: 20000 });
    await this.page.waitForLoadState('domcontentloaded');
  }

  // Click the "+ Add" button to go to Add Candidate form
  async clickAddCandidate(): Promise<void> {
    const addBtn = this.page.getByRole('button', { name: 'Add' });
    await addBtn.waitFor({ state: 'visible', timeout: 15000 });
    await addBtn.click();
    await this.page.waitForURL(/recruitment\/addCandidate/, { timeout: 15000 });
    await this.page.waitForLoadState('domcontentloaded');
  }

  // Fill candidate form using data from JSON
  async fillCandidateForm(data: {
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
    contactNumber: string;
    keywords: string;
    notes: string;
  }): Promise<void> {
    // Name fields use name attributes
    await this.page.locator('input[name="firstName"]').fill(data.firstName);
    if (data.middleName) {
      await this.page.locator('input[name="middleName"]').fill(data.middleName);
    }
    await this.page.locator('input[name="lastName"]').fill(data.lastName);

    // Email - first "Type here" input in the Email row
    const emailGroup = this.page.locator('.oxd-input-group').filter({
      has: this.page.locator('label', { hasText: 'Email' }),
    });
    await emailGroup.locator('input').fill(data.email);

    // Contact Number
    if (data.contactNumber) {
      const contactGroup = this.page.locator('.oxd-input-group').filter({
        has: this.page.locator('label', { hasText: 'Contact Number' }),
      });
      await contactGroup.locator('input').fill(data.contactNumber);
    }

    // Keywords - has unique placeholder
    if (data.keywords) {
      await this.page.getByPlaceholder('Enter comma seperated words...').fill(data.keywords);
    }

    // Notes - textarea with placeholder "Type here"
    if (data.notes) {
      await this.page.locator('textarea').fill(data.notes);
    }
  }

  // Click Save button
  async saveCandidate(): Promise<void> {
    await this.page.getByRole('button', { name: 'Save' }).click();
  }

  // Verify save succeeded via success toast message
  async expectSaveSuccess(): Promise<void> {
    await expect(
      this.page.locator('.oxd-toast--success')
    ).toBeVisible({ timeout: 20000 });
  }
}
