import { expect, type Locator, type Page } from '@playwright/test';

export class LoginPage {
  readonly loginForm: Locator;
  readonly customerIdInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly securityAnswerInput: Locator;
  readonly verifyButton: Locator;

  constructor(private readonly page: Page) {
    this.loginForm = page.getByTestId('bank-login-form');
    this.customerIdInput = page.getByTestId('customer-id');
    this.passwordInput = page.getByTestId('bank-password');
    this.loginButton = page.getByTestId('login-submit');
    this.securityAnswerInput = page.getByTestId('security-answer');
    this.verifyButton = page.getByTestId('verify-answer');
  }

  async goto(): Promise<void> {
    await this.page.goto('/apps/bank/dashboard');
  }

  async login(customerId: string, password: string): Promise<void> {
    await this.customerIdInput.fill(customerId);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async answerSecurityQuestion(answer: string): Promise<void> {
    await this.securityAnswerInput.fill(answer);
    await this.verifyButton.click();
  }

  async expectLoginFormVisible(): Promise<void> {
    await expect(this.loginForm, 'Login form should be visible')
      .toBeVisible();

    await expect(this.customerIdInput, 'Customer ID should be editable')
      .toBeEditable();

    await expect(this.passwordInput, 'Password should be editable')
      .toBeEditable();
  }

  async expectSecurityQuestionVisible(): Promise<void> {
    await expect(
      this.securityAnswerInput,
      'Security answer field should be visible'
    ).toBeVisible();

    await expect(
      this.securityAnswerInput,
      'Security answer field should be editable'
    ).toBeEditable();
  }
}