#include <iostream>
#include <string>
#include <vector>
using namespace std;

class Account {
private:
    int accNumber;
    string name;
    double balance;

public:
    Account(int accNum, string accName, double initialBalance) {
        accNumber = accNum;
        name = accName;
        balance = initialBalance;
    }

    int getAccNumber() {
        return accNumber;
    }

    string getName() {
        return name;
    }

    double getBalance() {
        return balance;
    }

    void deposit(double amount) {
        if (amount > 0) {
            balance += amount;
            cout << "Deposited: " << amount << " successfully.\n";
        } else {
            cout << "Invalid deposit amount.\n";
        }
    }

    void withdraw(double amount) {
        if (amount <= balance && amount > 0) {
            balance -= amount;
            cout << "Withdrawn: " << amount << " successfully.\n";
        } else {
            cout << "Invalid withdrawal amount or insufficient balance.\n";
        }
    }

    void display() {
        cout << "Account Number: " << accNumber
             << "\nName: " << name
             << "\nBalance: " << balance << endl;
    }
};

int main() {
    vector<Account> accounts;
    int choice;

    while (true) {
        cout << "\n=== Banking System Menu ===\n";
        cout << "1. Create Account\n";
        cout << "2. Deposit Money\n";
        cout << "3. Withdraw Money\n";
        cout << "4. Check Balance\n";
        cout << "5. Exit\n";
        cout << "Enter choice: ";
        cin >> choice;

        if (choice == 1) {
            int accNum;
            string name;
            double initialBalance;

            cout << "Enter Account Number: ";
            cin >> accNum;
            cout << "Enter Name: ";
            cin.ignore();
            getline(cin, name);
            cout << "Enter Initial Balance: ";
            cin >> initialBalance;

            accounts.push_back(Account(accNum, name, initialBalance));
            cout << "Account created successfully!\n";

        } else if (choice == 2) {
            int accNum;
            double amount;
            cout << "Enter Account Number: ";
            cin >> accNum;
            bool found = false;

            for (auto &acc : accounts) {
                if (acc.getAccNumber() == accNum) {
                    cout << "Enter Amount to Deposit: ";
                    cin >> amount;
                    acc.deposit(amount);
                    found = true;
                    break;
                }
            }
            if (!found) cout << "Account not found!\n";

        } else if (choice == 3) {
            int accNum;
            double amount;
            cout << "Enter Account Number: ";
            cin >> accNum;
            bool found = false;

            for (auto &acc : accounts) {
                if (acc.getAccNumber() == accNum) {
                    cout << "Enter Amount to Withdraw: ";
                    cin >> amount;
                    acc.withdraw(amount);
                    found = true;
                    break;
                }
            }
            if (!found) cout << "Account not found!\n";

        } else if (choice == 4) {
            int accNum;
            cout << "Enter Account Number: ";
            cin >> accNum;
            bool found = false;

            for (auto &acc : accounts) {
                if (acc.getAccNumber() == accNum) {
                    acc.display();
                    found = true;
                    break;
                }
            }
            if (!found) cout << "Account not found!\n";

        } else if (choice == 5) {
            cout << "Exiting Banking System. Goodbye!\n";
            break;
        } else {
            cout << "Invalid choice. Try again.\n";
        }
    }

    return 0;
}
