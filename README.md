# Playwright Bank Automation

Automation tests for the [Practice QA Automation banking application](https://www.practiceqaautomation.com/apps/bank/dashboard), using Playwright and TypeScript.

## What the Tests Cover

- Login with customer credentials and a security answer.
- Hide balances and verify they are masked.
- Show balances and verify numeric amounts.
- Select Credits only and verify amounts start with `+`.
- Select Debits only and verify amounts start with `−`.
- Search for Swiggy and verify matching descriptions.
- Search for unmatched text and verify no results.
- Logout and verify that reopening the dashboard requires login.

## Tools Used

- Playwright Test
- TypeScript
- GitHub Actions

Tests are configured for Chromium, Firefox, and WebKit.

## Project Structure

```text
.github/workflows/
  playwright.yml
fixtures/
  bank.fixture.ts
pages/
  login.page.ts
  dashboard.page.ts
  transaction.page.ts
test-data/
  data.ts
tests/
  authentication.spec.ts
  balances.spec.ts
  transactions.spec.ts
  balance-and-transaction-workflow.spec.ts
playwright.config.ts
package.json
package-lock.json
README.md
```

## Setup

Install a Node.js version supported by Playwright, then clone the repository:

```bash
git clone https://github.com/Krishanu2212/playwright-bank-automation.git
cd playwright-bank-automation
```

Install dependencies and browsers:

```bash
npm ci
npx playwright install
```

The tests require internet access. Public demo credentials and search text are stored in `test-data/data.ts`.

## Running Tests

Run all tests:

```bash
npx playwright test
```

Run the complete banking workflow:

```bash
npx playwright test tests/balance-and-transaction-workflow.spec.ts
```

Run transaction tests:

```bash
npx playwright test tests/transactions.spec.ts
```

Run only in Chromium:

```bash
npx playwright test --project=chromium
```

Run with a visible browser:

```bash
npx playwright test --headed
```

Open the HTML report:

```bash
npx playwright show-report
```

## How the Code Is Organized

### Page Objects

The `pages` folder contains locators, actions, and checks for each page.
Tests call these methods instead of repeating the same browser interactions.

### Shared Login and Logout

The `bankSession` fixture provides shared login and logout methods.
Each test uses its own browser context and does not depend on another test.

### Balance Checks

Regular expressions check whether balances are masked or display amounts
starting with `₹`. The tests do not compare account amounts before and after hiding.

### Transaction Checks

Dropdown options are selected and checked using their displayed labels.

The tests check every displayed amount or description. `expect.poll()` retries
these checks while the table updates. A matching result must contain at least one row.

The no-results test checks the message and verifies that no transaction rows remain.

## Why Both Workflow and Independent Tests?

The workflow test checks the assignment's complete sequence in one session.

Independent tests check individual features, making failures easier to investigate.
They also cover unmatched searches and dashboard access after logout.
Some checks are intentionally repeated between the two test styles.

## Reports and GitHub Actions

Screenshots and traces are retained for failed tests.

The GitHub Actions workflow installs dependencies and browsers, runs the tests,
and uploads the HTML report. Results are available in the repository's Actions tab.

## Current Limitations

- Tests depend on the external demo website being available.
- Transaction checks cover the displayed page, not every page of results.
- Amount and description checks depend on their current column positions.