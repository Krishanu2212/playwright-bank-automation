import { test, expect } from '../fixtures/bank.fixture';
import { testData } from '../test-data/data';


test('hiding balances masks all account amounts and revealing restores their original values', async ({
    loginPage,
    dashboardPage
}) => {
    await test.step('Log in and complete security verification', async () => {
        await loginPage.goto();
        await loginPage.expectLoginFormVisible();

        await loginPage.login(testData.CustomerID, testData.Password);
        await loginPage.expectSecurityQuestionVisible();

        await loginPage.answerSecurityQuestion(testData.SecurityAnswer);

        await expect(dashboardPage.hideBalancesCheckbox).toBeVisible();
        await expect(dashboardPage.logoutButton).toBeVisible();
    });

    const originalBalances = await test.step(
        'Capture the displayed balances before hiding',
        async () => {
        await dashboardPage.setBalancesHidden(false);
        return await dashboardPage.captureBalances();
        }
    );

    await test.step('Hide all account balances', async () => {
        await dashboardPage.setBalancesHidden(true);
        await dashboardPage.expectBalancesHidden();
    });

    await test.step('Reveal and verify the original balances', async () => {
        await dashboardPage.setBalancesHidden(false);
        await dashboardPage.expectBalancesRestored(originalBalances);
    });
})