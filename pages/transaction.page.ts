import { expect, type Locator, type Page } from '@playwright/test';

export type TransactionType =
  | 'Credits only'
  | 'Debits only'
  | 'Credits & debits';

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

    // Includes data rows and excludes the header row.
    this.rows = this.table.getByRole('row').filter({
      has: page.getByRole('cell'),
    });

    this.noTransactions = page.getByTestId('no-transactions');
  }

  async selectType(label: TransactionType): Promise<void> {
    await this.typeFilter.selectOption({ label });

    await expect(
      this.typeFilter.locator('option:checked')
    ).toHaveText(label);
  }

  async search(description: string): Promise<void> {
    await this.searchInput.fill(description);
  }

  async expectOnlyCredits(): Promise<void> {
    await expect.poll(
      async () => {
        const amounts = await this.getColumnTexts(4);

        return (
          amounts.length > 0 &&
          amounts.every(amount => /^\s*\+/.test(amount))
        );
      },
      {
        message: 'Every displayed credit amount should start with +',
      }
    ).toBe(true);
  }

  async expectOnlyDebits(): Promise<void> {
    await expect.poll(
      async () => {
        const amounts = await this.getColumnTexts(4);

        return (
          amounts.length > 0 &&
          amounts.every(amount => /^\s*−/.test(amount))
        );
      },
      {
        message: 'Every displayed debit amount should start with −',
      }
    ).toBe(true);
  }

  async expectDescriptionsContaining(
    description: string
  ): Promise<void> {
    await expect.poll(
      async () => {
        const descriptions = await this.getColumnTexts(2);

        return (
          descriptions.length > 0 &&
          descriptions.every(text => text.includes(description))
        );
      },
      {
        message:
          `Every displayed description should contain "${description}"`,
      }
    ).toBe(true);
  }

  async expectNoResults(): Promise<void> {
    await expect(
      this.noTransactions.getByText(
        'No transactions match these filters.',
        { exact: true }
      )
    ).toBeVisible();

    await expect(this.rows).toHaveCount(0);
  }

  private async getColumnTexts(
    columnIndex: number
  ): Promise<string[]> {
    const rows = await this.rows.all();

    return Promise.all(
      rows.map(row =>
        row.getByRole('cell').nth(columnIndex).innerText()
      )
    );
  }
}