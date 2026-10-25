import { expect, type Locator, type Page } from '@playwright/test';

export type TransactionType = 'all' | 'credit' | 'debit';

export class TransactionsPage {
  readonly typeFilter: Locator;
  readonly searchInput: Locator;
  readonly table: Locator;
  readonly rows: Locator;
  readonly noTransactions: Locator;

  constructor(page: Page) {
    this.typeFilter = page.getByTestId('history-type');
    this.searchInput = page.getByTestId('history-search');
    this.table = page.getByTestId('history-table');
    this.rows = this.table.locator('tbody tr');
    this.noTransactions = page.getByTestId('no-transactions')
  }

  async selectType(type: TransactionType): Promise<void> {
    await this.typeFilter.selectOption(type);
  }

  async search(description: string): Promise<void> {
    await this.searchInput.fill(description);
  }

  amountCell(rowIndex: number): Locator {
    return this.rows.nth(rowIndex).getByRole('cell').nth(4);
  }

  descriptionCell(rowIndex: number): Locator {
    return this.rows.nth(rowIndex).getByRole('cell').nth(2);
  }

  async expectOnlyCredits(): Promise<void> {
    await expect(this.typeFilter).toHaveValue('credit');
    await expect(this.rows.first()).toBeVisible();

    const rowCount = await this.rows.count();

    for (let i = 0; i < rowCount; i++) {
      await expect(
        this.amountCell(i),
        `Credit transaction ${i + 1} should start with +`
      ).toHaveText(/^\s*\+/);
    }
  }

  async expectOnlyDebits(): Promise<void> {
    await expect(this.typeFilter).toHaveValue('debit');
    await expect(this.rows.first()).toBeVisible();

    const rowCount = await this.rows.count();

    for (let i = 0; i < rowCount; i++) {
      await expect(
        this.amountCell(i),
        `Debit transaction ${i + 1} should start with −`
      ).toHaveText(/^\s*−/);
    }
  }

  async expectDescriptionsContaining(description: string): Promise<void> {
    await expect(this.searchInput).toHaveValue(description);
    await expect(this.rows.first()).toBeVisible();

    const rowCount = await this.rows.count();

    for (let i = 0; i < rowCount; i++) {
      await expect(
        this.descriptionCell(i),
        `Description in row ${i + 1} should contain "${description}"`
      ).toContainText(description);
    }
  }

  async expectNoResults(description: string): Promise<void> {
    await expect(this.searchInput).toHaveValue(description);

    await expect(this.noTransactions).toContainText('No transactions match these filters.')
  }
}