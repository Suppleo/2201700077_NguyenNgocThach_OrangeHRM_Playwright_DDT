import { test } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { RecruitmentPage } from '../pages/recruitment-page';
import candidateTestData from '../test-data/add-candidate-data.json';

/**
 * Add Candidate Tests - Data-Driven Testing
 * Reads test cases from test-data/add-candidate-data.json
 * Covers: adding candidates with required fields and optional fields
 */
test.describe('OrangeHRM Recruitment - Add Candidate Data-Driven Tests', () => {
  // Log in before each test
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login('Admin', 'admin123');
    await page.waitForURL(/dashboard/, { timeout: 20000 });
  });

  for (const candidate of candidateTestData) {
    test(`${candidate.description}`, async ({ page }) => {
      const recruitmentPage = new RecruitmentPage(page);

      // Navigate to Candidates list
      await recruitmentPage.navigateToCandidates();

      // Click Add button to open the form
      await recruitmentPage.clickAddCandidate();

      // Fill out the candidate form with data from JSON
      await recruitmentPage.fillCandidateForm({
        firstName: candidate.firstName,
        middleName: candidate.middleName,
        lastName: candidate.lastName,
        email: candidate.email,
        contactNumber: candidate.contactNumber,
        keywords: candidate.keywords,
        notes: candidate.notes,
      });

      // Submit the form
      await recruitmentPage.saveCandidate();

      if (candidate.expectedResult === 'success') {
        // Verify redirect away from add form (save succeeded)
        await recruitmentPage.expectSaveSuccess();
      }
    });
  }
});
