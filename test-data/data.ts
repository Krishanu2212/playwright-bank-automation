
type LoginCredentials = {
  customerId: string;
  password: string;
  securityAnswer: string;
};

export const loginCredentials: LoginCredentials = {
  customerId: '100200300',
  password: 'Bank@123',
  securityAnswer: 'greenwood',
};

type TransactionData = {
  matchingDescription: string,
  unmatchedDescription: string,
};

export const transactionData: TransactionData = {
  matchingDescription: 'Swiggy',
  unmatchedDescription: 'qwerty',
};