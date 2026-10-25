import { test, expect } from '../fixtures/bank.fixture';
import { testData } from '../test-data/data';

test.beforeEach('Log in and open transaction history', async ({
  loginPage,
  dashboardPage,
}) => {
  await loginPage.goto();
  await loginPage.expectLoginFormVisible();

  await loginPage.login(testData.CustomerID, testData.Password);
  await loginPage.expectSecurityQuestionVisible();

  await loginPage.answerSecurityQuestion(testData.SecurityAnswer);

  await expect(dashboardPage.hideBalancesCheckbox).toBeVisible();
  await expect(dashboardPage.logoutButton).toBeVisible();

  await dashboardPage.openTransactionHistory();
});

test('credit filter displays only transactions with positive amounts', async ({
  transactionsPage,
}) => {
  await transactionsPage.selectType('credit');
  await transactionsPage.expectOnlyCredits();
});

test('debit filter displays only transactions with negative amounts', async ({
  transactionsPage,
}) => {
  await transactionsPage.selectType('debit');
  await transactionsPage.expectOnlyDebits();
});

test(`searching for "${testData.Description}" displays only matching descriptions`, async ({
  transactionsPage,
}) => {
  await transactionsPage.selectType('all');
  await expect(transactionsPage.typeFilter).toHaveValue('all');

  await transactionsPage.search(testData.Description);
  await transactionsPage.expectDescriptionsContaining(testData.Description);
});

test('an unmatched description displays the no-results message', async ({
  transactionsPage,
}) => {
  await transactionsPage.selectType('all');
  await expect(transactionsPage.typeFilter).toHaveValue('all');

  await transactionsPage.search('qwerty');
  await transactionsPage.expectNoResults('qwerty');
});