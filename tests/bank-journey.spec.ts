import { test, expect } from '../fixtures/bank.fixture';
import { testData } from '../test-data/data';

test('customer can hide and restore balances, filter and search transactions, and log out', async ({
  loginPage,
  dashboardPage,
  transactionsPage,
}) => {
  await test.step('Log in and complete security verification', async () => {
    await loginPage.goto();
    await loginPage.expectLoginFormVisible();

    await loginPage.login(testData.CustomerID, testData.Password);
    await loginPage.expectSecurityQuestionVisible();

    await loginPage.answerSecurityQuestion(testData.SecurityAnswer);

    await expect(dashboardPage.hideBalancesCheckbox).toBeVisible();
    await expect(dashboardPage.logoutButton).toBeVisible();
  });

  const originalBalances = await test.step(
    'Capture the displayed balances before hiding',
    async () => {
      await dashboardPage.setBalancesHidden(false);
      return await dashboardPage.captureBalances();
    }
  );

  await test.step('Hide all account balances', async () => {
    await dashboardPage.setBalancesHidden(true);
    await dashboardPage.expectBalancesHidden();
  });

  await test.step('Reveal and verify the original balances', async () => {
    await dashboardPage.setBalancesHidden(false);
    await dashboardPage.expectBalancesRestored(originalBalances);
  });

  await test.step('Filter transaction history to credits only', async () => {
    await dashboardPage.openTransactionHistory();

    await transactionsPage.selectType('credit');
    await transactionsPage.expectOnlyCredits();
  });

  await test.step('Filter transaction history to debits only', async () => {
    await transactionsPage.selectType('debit');
    await transactionsPage.expectOnlyDebits();
  });

  await test.step('Search all transactions for Swiggy', async () => {
    await transactionsPage.selectType('all');
    await expect(transactionsPage.typeFilter).toHaveValue('all');

    await transactionsPage.search('Swiggy');
    await transactionsPage.expectDescriptionsContaining('Swiggy');
  });

  await test.step('Log out and verify dashboard access requires login', async () => {
    await dashboardPage.logout();

    await loginPage.expectLoginFormVisible();
    await expect(dashboardPage.logoutButton).toBeHidden();
    await expect(dashboardPage.hideBalancesCheckbox).toBeHidden();

    await loginPage.goto();

    await loginPage.expectLoginFormVisible();
    await expect(dashboardPage.hideBalancesCheckbox).toBeHidden();
  });
});