import { test } from '../fixtures/bank.fixture';
import { testData } from '../test-data/data';

test(
  'customer can hide and show balances, filter and search transactions, and log out',
  async ({
    bankSession,
    dashboardPage,
    transactionsPage,
  }) => {
    await bankSession.login();

    await test.step(
      'Hide balances and verify masking',
      async () => {
        await dashboardPage.setBalancesHidden(true);
        await dashboardPage.expectBalancesHidden();
      }
    );

    await test.step(
      'Show balances and verify numeric amounts',
      async () => {
        await dashboardPage.setBalancesHidden(false);
        await dashboardPage.expectBalancesShown();
      }
    );

    await test.step(
      'Open transaction history and verify Credits only',
      async () => {
        await dashboardPage.openTransactionHistory();

        await transactionsPage.selectType('Credits only');
        await transactionsPage.expectOnlyCredits();
      }
    );

    await test.step(
      'Select Debits only and verify negative amounts',
      async () => {
        await transactionsPage.selectType('Debits only');
        await transactionsPage.expectOnlyDebits();
      }
    );

    await test.step(
      `Select Credits & debits and search for "${testData.Description}"`,
      async () => {
        await transactionsPage.selectType('Credits & debits');

        await transactionsPage.search(testData.Description);
        await transactionsPage.expectDescriptionsContaining(
          testData.Description
        );
      }
    );

    await bankSession.logout();
  }
);