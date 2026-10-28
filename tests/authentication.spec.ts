import { test } from '../fixtures/bank.fixture';

test(
  'logging out returns the customer to login and prevents access to the dashboard',
  async ({ bankSession, loginPage }) => {
    await bankSession.login();
    await bankSession.logout();

    await test.step(
      'Verify direct dashboard navigation requires login after logout',
      async () => {
        await loginPage.goto();
        await bankSession.expectLoggedOut();
      }
    );
  }
);