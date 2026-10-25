type LoginCredentials = {
    CustomerID: string,
    Password: string,
    SecurityAnswer: string,
    Description: string
}

export const testData: LoginCredentials = {
    CustomerID: '100200300',
    Password: 'Bank@123',
    SecurityAnswer: 'greenwood',
    Description: 'Swiggy'
}