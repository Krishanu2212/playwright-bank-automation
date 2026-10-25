import { expect, type Locator, type Page } from '@playwright/test';

export type BalanceSnapshot = {
  savings: string;
  current: string;
  creditCard: string;
};

export class DashboardPage {
  readonly hideBalancesCheckbox: Locator;
  readonly savingsBalance: Locator;
  readonly currentBalance: Locator;
  readonly creditCardAccount: Locator;
  readonly creditCardBalance: Locator;
  readonly viewAllTransactionsLink: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.hideBalancesCheckbox = page.getByTestId('hide-balances');
    this.savingsBalance = page.getByTestId('balance-savings');
    this.currentBalance = page.getByTestId('balance-current');

    this.creditCardAccount = page.getByTestId('account-credit-card');

    this.creditCardAccount = page.getByTestId('account-credit-card');

    this.creditCardBalance = this.creditCardAccount.locator('p.text-3xl');

    this.viewAllTransactionsLink = page.getByRole('link', {
      name: 'View all →',
      exact: true,
    });

    this.logoutButton = page.getByTestId('bank-logout');
  }

  async setBalancesHidden(hidden: boolean): Promise<void> {
    await this.hideBalancesCheckbox.setChecked(hidden);
  }

  async openTransactionHistory(): Promise<void> {
    await this.viewAllTransactionsLink.click();
  }

  async logout(): Promise<void> {
    await this.logoutButton.click();
  }

  async captureBalances(): Promise<BalanceSnapshot> {
    await expect(this.hideBalancesCheckbox).not.toBeChecked();

    await expect(this.savingsBalance).toBeVisible();
    await expect(this.currentBalance).toBeVisible();
    await expect(this.creditCardBalance).toBeVisible();

    await expect(this.savingsBalance).not.toBeEmpty();
    await expect(this.currentBalance).not.toBeEmpty();

    await expect(this.savingsBalance).not.toContainText('••••••');
    await expect(this.currentBalance).not.toContainText('••••••');
    await expect(this.creditCardBalance).not.toContainText('••••••');

    return {
      savings: (await this.savingsBalance.innerText()).trim(),
      current: (await this.currentBalance.innerText()).trim(),
      creditCard: (await this.creditCardBalance.innerText()).trim(),
    };
  }

  async expectBalancesHidden(): Promise<void> {
    const maskedBalance = '₹ ••••••';

    await expect(
      this.hideBalancesCheckbox,
      'Hide balances should be checked'
    ).toBeChecked();

    await expect(
      this.savingsBalance,
      'Savings balance should be masked'
    ).toHaveText(maskedBalance);

    await expect(
      this.currentBalance,
      'Current balance should be masked'
    ).toHaveText(maskedBalance);

    await expect(
      this.creditCardBalance,
      'Credit-card balance should be masked'
    ).toHaveText(maskedBalance);
  }

  async expectBalancesRestored(original: BalanceSnapshot): Promise<void> {
    await expect(
      this.hideBalancesCheckbox,
      'Hide balances should be unchecked'
    ).not.toBeChecked();

    await expect(
      this.savingsBalance,
      'Savings balance should match its value before hiding'
    ).toHaveText(original.savings, { useInnerText: true });

    await expect(
      this.currentBalance,
      'Current balance should match its value before hiding'
    ).toHaveText(original.current, { useInnerText: true });

    await expect(
      this.creditCardBalance,
      'Credit-card balance should match its value before hiding'
    ).toHaveText(original.creditCard, { useInnerText: true });
  }
}