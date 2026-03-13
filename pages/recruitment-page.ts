import { Page, Locator, expect } from '@playwright/test';

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
    await this.page.waitForLoadState('networkidle');
  }

  // Click the "+ Add" button to go to Add Candidate form
  async clickAddCandidate(): Promise<void> {
    const addBtn = this.page.locator('button', { hasText: 'Add' });
    await addBtn.waitFor({ state: 'visible', timeout: 15000 });
    await addBtn.click();
    await this.page.waitForURL(/recruitment\/addCandidate/, { timeout: 15000 });
    await this.page.waitForLoadState('networkidle');
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

    // Email - find input group by label text, then get the input inside
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

    // Keywords
    if (data.keywords) {
      const keywordsGroup = this.page.locator('.oxd-input-group').filter({
        has: this.page.locator('label', { hasText: 'Keywords' }),
      });
      await keywordsGroup.locator('input').fill(data.keywords);
    }

    // Notes
    if (data.notes) {
      await this.page.locator('textarea').fill(data.notes);
    }
  }

  // Click Save button
  async saveCandidate(): Promise<void> {
    await this.page.locator('button[type="submit"]').click();
  }

  // Verify save succeeded (page navigates away from addCandidate)
  async expectSaveSuccess(): Promise<void> {
    await expect(this.page).not.toHaveURL(/addCandidate/, { timeout: 20000 });
  }
}
