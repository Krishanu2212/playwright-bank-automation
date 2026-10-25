import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { DashboardPage } from '../pages/dashboard.page';
import { TransactionsPage } from '../pages/transaction.page';

type BankFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  transactionsPage: TransactionsPage;
};

export const test = base.extend<BankFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  dashboardPage: async ({ page }, use) => {
    const dashboardPage = new DashboardPage(page);
    await use(dashboardPage);
  },

  transactionsPage: async ({ page }, use) => {
    const transactionsPage = new TransactionsPage(page);
    await use(transactionsPage);
  },
});

export { expect };