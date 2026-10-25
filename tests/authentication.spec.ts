import { test, expect } from '../fixtures/bank.fixture';
import { testData } from '../test-data/data';

test('logging out returns the customer to login and prevents access to the dashboard', async ({
  loginPage,
  dashboardPage,
}) => {
  await test.step('Log in and verify dashboard access', async () => {
    await loginPage.goto();
    await loginPage.expectLoginFormVisible();

    await loginPage.login(testData.CustomerID, testData.Password);
    await loginPage.expectSecurityQuestionVisible();

    await loginPage.answerSecurityQuestion(testData.SecurityAnswer);

    await expect(dashboardPage.hideBalancesCheckbox).toBeVisible();
    await expect(dashboardPage.logoutButton).toBeVisible();
  });

  await test.step('Log out and verify the login form appears', async () => {
    await dashboardPage.logout();

    await loginPage.expectLoginFormVisible();
    await expect(dashboardPage.logoutButton).toBeHidden();
    await expect(dashboardPage.hideBalancesCheckbox).toBeHidden();
  });

  await test.step('Verify direct dashboard navigation requires login', async () => {
    await loginPage.goto();

    await loginPage.expectLoginFormVisible();
    await expect(dashboardPage.logoutButton).toBeHidden();
    await expect(dashboardPage.hideBalancesCheckbox).toBeHidden();
  });
});