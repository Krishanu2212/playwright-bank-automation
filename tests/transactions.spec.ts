import { test } from '../fixtures/bank.fixture';
import { testData } from '../test-data/data';

test.beforeEach(
  'Log in and open transaction history',
  async ({ bankSession, dashboardPage }) => {
    await bankSession.login();
    await dashboardPage.openTransactionHistory();
  }
);

test.afterEach(async ({ bankSession }) => {
  await bankSession.logout();
});

test(
  'Credits only displays transactions with positive amounts',
  async ({ transactionsPage }) => {
    await transactionsPage.selectType('Credits only');
    await transactionsPage.expectOnlyCredits();
  }
);

test(
  'Debits only displays transactions with negative amounts',
  async ({ transactionsPage }) => {
    await transactionsPage.selectType('Debits only');
    await transactionsPage.expectOnlyDebits();
  }
);

test(
  `searching for "${testData.Description}" displays only matching descriptions`,
  async ({ transactionsPage }) => {
    await transactionsPage.selectType('Credits & debits');

    await transactionsPage.search(testData.Description);
    await transactionsPage.expectDescriptionsContaining(
      testData.Description
    );
  }
);

test(
  'an unmatched description displays no transactions',
  async ({ transactionsPage }) => {
    await transactionsPage.selectType('Credits & debits');

    await transactionsPage.search('qwerty');
    await transactionsPage.expectNoResults();
  }
);