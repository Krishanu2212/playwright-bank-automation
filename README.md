# Playwright Bank Automation

UI automation for the [Practice QA Automation banking application](https://www.practiceqaautomation.com/apps/bank/dashboard), built with Playwright and TypeScript.

The suite covers the complete assignment workflow and independent feature tests.

## Test Coverage

| Test file | Coverage |
| --- | --- |
| `bank-journey.spec.ts` | Login, security verification, hide/reveal balances, credit/debit filters, description search, and logout |
| `balances.spec.ts` | Verify balances are masked and their original values return when revealed |
| `transactions.spec.ts` | Credit filtering, debit filtering, matching description search, and no-results search |
| `authentication.spec.ts` | Logout and verification that reopening the dashboard requires login |

The full journey verifies the requested sequence in one session. Independent tests isolate feature failures and can run separately.

## Tech Stack

- Playwright Test
- TypeScript
- Page Object Model
- Custom Playwright fixtures
- GitHub Actions workflow

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
  bank-journey.spec.ts
  transactions.spec.ts
playwright.config.ts
package.json
package-lock.json
README.md
```

## Getting Started

Install a Node.js LTS version supported by the project's Playwright version, along with npm and Git.

Clone the repository:

```bash
git clone https://github.com/Krishanu2212/playwright-bank-automation.git
cd playwright-bank-automation
```

Install dependencies and browser binaries:

```bash
npm ci
npx playwright install
```

On Linux, install browser system dependencies if needed:

```bash
npx playwright install --with-deps
```

The tests require internet access to the demo application. Public demo credentials and search data are maintained in `test-data/data.ts`.

## Running Tests

Run the complete suite:

```bash
npx playwright test
```

Run the full assignment journey:

```bash
npx playwright test tests/bank-journey.spec.ts
```

Run independent transaction tests:

```bash
npx playwright test tests/transactions.spec.ts
```

Run with visible browser windows:

```bash
npx playwright test --headed
```

Run using Playwright's interactive UI:

```bash
npx playwright test --ui
```

Browser projects and execution settings are defined in `playwright.config.ts`.

## Reports and Debugging

Open the HTML report after a test run:

```bash
npx playwright show-report
```

Named `test.step()` sections make the longer scenarios easier to follow.

Screenshot and trace collection are controlled by `playwright.config.ts`. When enabled, failure artifacts help investigate the page state and actions leading to a failure.

## Design Decisions

### Page Object Model

Page objects contain page-specific locators, actions, and reusable verification methods. Tests describe the user scenarios.

### Custom Fixtures

Fixtures provide page-object instances using each test's Playwright page. They do not log in automatically; authentication is explicit in tests or their setup hooks.

### Balance Verification

Balances are captured before hiding and compared after revealing. This avoids hardcoding account amounts and verifies that the original displayed values return.

### Transaction Verification

Positive-result checks require at least one row and verify every rendered amount or description cell. No-results searches have separate assertions.

### Test Independence

Feature tests prepare their own authenticated state. They do not depend on another test running first.

## Continuous Integration

A GitHub Actions workflow is included in:

```text
.github/workflows/playwright.yml
```

Check the repository's **Actions** tab for workflow execution results. Local test results and CI results should be assessed separately.

## Scope and Assumptions

- Tests run against an external demo application, so availability and demo-data changes can affect results.
- Transaction locators currently use the fifth column for amounts and the third column for descriptions.
- Transaction checks cover rendered table rows; they do not traverse additional pages.
- The current row-count checks assume filtering has completed before the count is read.
- Balance restoration checks assume account values do not change independently during the hide/reveal sequence.
- Tests verify UI behavior rather than the financial correctness of account balances.