import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { DashboardPage } from '../pages/dashboard.page';
import { TransactionsPage } from '../pages/transaction.page';
import { testData } from '../test-data/data';

type BankSession = {
  login(): Promise<void>;
  logout(): Promise<void>;
  expectLoggedOut(): Promise<void>;
};

type BankFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  transactionsPage: TransactionsPage;
  bankSession: BankSession;
};

export const test = base.extend<BankFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },

  transactionsPage: async ({ page }, use) => {
    await use(new TransactionsPage(page));
  },

  bankSession: async ({ loginPage, dashboardPage }, use) => {
    const expectLoggedOut = async (): Promise<void> => {
      await loginPage.expectLoginFormVisible();
      await expect(dashboardPage.logoutButton).toBeHidden();
    };

    await use({
      login: async () => {
        await base.step(
          'Log in and complete security verification',
          async () => {
            await loginPage.goto();

            await loginPage.login(
              testData.CustomerID,
              testData.Password
            );

            await loginPage.answerSecurityQuestion(
              testData.SecurityAnswer
            );

            await expect(dashboardPage.logoutButton).toBeVisible();
          }
        );
      },

      logout: async () => {
        await base.step(
          'Log out and verify the login form appears',
          async () => {
            await dashboardPage.logout();
            await expectLoggedOut();
          }
        );
      },

      expectLoggedOut,
    });
  },
});

export { expect };