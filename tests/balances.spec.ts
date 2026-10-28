import { test } from '../fixtures/bank.fixture';

test.beforeEach(async ({ bankSession }) => {
  await bankSession.login();
});

test.afterEach(async ({ bankSession }) => {
  await bankSession.logout();
});

test('customer can hide and show account balances', async ({
  dashboardPage,
}) => {
  await test.step('Hide balances and verify masking', async () => {
    await dashboardPage.setBalancesHidden(true);
    await dashboardPage.expectBalancesHidden();
  });

  await test.step('Show balances and verify digits', async () => {
    await dashboardPage.setBalancesHidden(false);
    await dashboardPage.expectBalancesShown();
  });
});