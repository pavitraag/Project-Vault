import java.util.*;

public class ATMSimulator {

    // ---------- Account class ----------
    static class Account {
        private String name;
        private String pin;
        private double balance;

        public Account(String name, String pin, double balance) {
            this.name = name;
            this.pin = pin;
            this.balance = balance;
        }

        public String getName() {
            return name;
        }

        public boolean verifyPin(String enteredPin) {
            return this.pin.equals(enteredPin);
        }

        public double getBalance() {
            return balance;
        }

        public void deposit(double amount) {
            if (amount > 0) {
                balance += amount;
                System.out.println("₹" + amount + " deposited successfully.");
            } else {
                System.out.println("Invalid deposit amount.");
            }
        }

        public void withdraw(double amount) {
            if (amount <= 0) {
                System.out.println("Invalid withdrawal amount.");
            } else if (amount > balance) {
                System.out.println("Insufficient funds.");
            } else {
                balance -= amount;
                System.out.println("₹" + amount + " withdrawn successfully.");
            }
        }
    }

    // ---------- ATM class ----------
    static class ATM {
        private Scanner scanner;
        private Account account;

        public ATM(Account account, Scanner scanner) {  // pass scanner
            this.account = account;
            this.scanner = scanner;
        }

        public void start() {
            System.out.println("\n----- Welcome to the ATM, " + account.getName() + " -----");
            if (!login()) {
                System.out.println("Too many failed attempts. Exiting.");
                return;
            }

            int choice;
            do {
                showMenu();
                choice = scanner.nextInt();
                switch (choice) {
                    case 1 -> checkBalance();
                    case 2 -> deposit();
                    case 3 -> withdraw();
                    case 4 -> System.out.println("Thank you, " + account.getName() + "! Please collect your card.");
                    default -> System.out.println("Invalid choice.");
                }
            } while (choice != 4);
        }

        private boolean login() {
            int attempts = 0;
            while (attempts < 3) {
                System.out.print("Enter your PIN: ");
                String enteredPin = scanner.next();
                if (account.verifyPin(enteredPin)) {
                    System.out.println("Login successful.\n");
                    return true;
                } else {
                    System.out.println("Incorrect PIN. Try again.");
                    attempts++;
                }
            }
            return false;
        }

        private void showMenu() {
            System.out.println("\n----- ATM Menu -----");
            System.out.println("1. Check Balance");
            System.out.println("2. Deposit");
            System.out.println("3. Withdraw");
            System.out.println("4. Exit");
            System.out.print("Enter choice: ");
        }

        private void checkBalance() {
            System.out.println("Your balance: ₹" + account.getBalance());
        }

        private void deposit() {
            System.out.print("Enter amount to deposit: ");
            double amount = scanner.nextDouble();
            account.deposit(amount);
        }

        private void withdraw() {
            System.out.print("Enter amount to withdraw: ");
            double amount = scanner.nextDouble();
            account.withdraw(amount);
        }
    }

    // ---------- main ----------
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        // Step 1: Create account
        System.out.println("----- Create Your Bank Account -----");
        System.out.print("Enter your name: ");
        String name = sc.nextLine();

        System.out.print("Set your 4-digit PIN: ");
        String pin = sc.nextLine();

        // start with zero balance
        Account account = new Account(name, pin, 0.0);

        // Step 2: Launch ATM (pass same scanner)
        ATM atm = new ATM(account, sc);
        atm.start();
    }
}
