import { expect, type Locator, type Page } from '@playwright/test';

export class DashboardPage {
  readonly hideBalancesCheckbox: Locator;
  readonly savingsBalance: Locator;
  readonly currentBalance: Locator;
  readonly creditCardBalance: Locator;
  readonly viewAllTransactionsLink: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.hideBalancesCheckbox = page.getByTestId('hide-balances');

    this.savingsBalance = page.getByTestId('balance-savings');
    this.currentBalance = page.getByTestId('balance-current');

    this.creditCardBalance = page
      .getByTestId('account-credit-card')
      .locator('p.text-3xl');

    this.viewAllTransactionsLink = page.getByRole('link', {
      name: 'View all →',
      exact: true,
    });

    this.logoutButton = page.getByTestId('bank-logout');
  }

  async setBalancesHidden(hidden: boolean): Promise<void> {
    await this.hideBalancesCheckbox.setChecked(hidden);
  }

  async expectBalancesHidden(): Promise<void> {
    const maskedPattern = /^₹\s*•+$/;

    await expect(this.savingsBalance).toHaveText(maskedPattern);
    await expect(this.currentBalance).toHaveText(maskedPattern);
    await expect(this.creditCardBalance).toHaveText(maskedPattern);
  }

  async expectBalancesShown(): Promise<void> {
    const amountPattern = /^₹\s*\d[\d,]*\.\d{2}$/;

    await expect(this.savingsBalance).toHaveText(amountPattern);
    await expect(this.currentBalance).toHaveText(amountPattern);
    await expect(this.creditCardBalance).toHaveText(amountPattern);
  }

  async openTransactionHistory(): Promise<void> {
    await this.viewAllTransactionsLink.click();
  }

  async logout(): Promise<void> {
    await this.logoutButton.click();
  }
}