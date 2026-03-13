import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object for OrangeHRM Login Page
 * URL: /web/index.php/auth/login
 */
export class LoginPage {
  readonly page: Page;

  // Locators
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorAlert: Locator;
  readonly usernameError: Locator;
  readonly passwordError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.submitButton = page.locator('button[type="submit"]');
    this.errorAlert = page.locator('.oxd-alert-content-text');
    this.usernameError = page.locator(
      '.oxd-form-row:has(input[name="username"]) .oxd-input-field-error-message'
    );
    this.passwordError = page.locator(
      '.oxd-form-row:has(input[name="password"]) .oxd-input-field-error-message'
    );
  }

  async navigate(): Promise<void> {
    await this.page.goto('/web/index.php/auth/login');
    await this.usernameInput.waitFor({ state: 'visible', timeout: 20000 });
  }

  async fillUsername(username: string): Promise<void> {
    await this.usernameInput.clear();
    if (username) {
      await this.usernameInput.fill(username);
    }
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.clear();
    if (password) {
      await this.passwordInput.fill(password);
    }
  }

  async clickSubmit(): Promise<void> {
    await this.submitButton.click();
  }

  async login(username: string, password: string): Promise<void> {
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.clickSubmit();
  }

  async getAlertText(): Promise<string> {
    await this.errorAlert.waitFor({ state: 'visible', timeout: 10000 });
    return (await this.errorAlert.textContent()) ?? '';
  }

  async getFieldErrors(): Promise<string[]> {
    // Wait briefly for validation messages to appear
    await this.page.waitForTimeout(500);
    const errors: string[] = [];
    const allErrors = this.page.locator('.oxd-input-field-error-message');
    const count = await allErrors.count();
    for (let i = 0; i < count; i++) {
      const text = await allErrors.nth(i).textContent();
      if (text) errors.push(text.trim());
    }
    return errors;
  }

  async expectSuccessfulLogin(): Promise<void> {
    await expect(this.page).toHaveURL(/dashboard/, { timeout: 20000 });
  }

  async expectLoginError(expectedMessage: string): Promise<void> {
    if (expectedMessage === 'Required') {
      // Field-level validation errors
      const errors = await this.getFieldErrors();
      expect(errors.some((e) => e.includes('Required'))).toBeTruthy();
    } else {
      const alertText = await this.getAlertText();
      expect(alertText).toContain(expectedMessage);
    }
  }
}
