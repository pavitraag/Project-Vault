#include <iostream>
#include <vector>
#include <string>
using namespace std;

class Book {
public:
    int id;
    string title;
    string author;
    bool isIssued;

    Book(int i, string t, string a) {
        id = i;
        title = t;
        author = a;
        isIssued = false;
    }
};

class Library {
private:
    vector<Book> books;

public:
    void addBook() {
        int id;
        string title, author;
        cout << "Enter Book ID: ";
        cin >> id;
        cin.ignore();
        cout << "Enter Book Title: ";
        getline(cin, title);
        cout << "Enter Author Name: ";
        getline(cin, author);

        books.push_back(Book(id, title, author));
        cout << "✅ Book added successfully!\n";
    }

    void displayBooks() {
        if (books.empty()) {
            cout << "❌ No books in library.\n";
            return;
        }
        cout << "\n📚 Library Books:\n";
        for (auto &b : books) {
            cout << "ID: " << b.id 
                 << " | Title: " << b.title 
                 << " | Author: " << b.author 
                 << " | Status: " << (b.isIssued ? "Issued" : "Available") << "\n";
        }
    }

    void searchBook() {
        int id;
        cout << "Enter Book ID to search: ";
        cin >> id;

        for (auto &b : books) {
            if (b.id == id) {
                cout << "✅ Found: " << b.title << " by " << b.author 
                     << " | Status: " << (b.isIssued ? "Issued" : "Available") << "\n";
                return;
            }
        }
        cout << "❌ Book not found.\n";
    }

    void issueBook() {
        int id;
        cout << "Enter Book ID to issue: ";
        cin >> id;

        for (auto &b : books) {
            if (b.id == id) {
                if (!b.isIssued) {
                    b.isIssued = true;
                    cout << "✅ Book issued successfully!\n";
                } else {
                    cout << "❌ Book already issued.\n";
                }
                return;
            }
        }
        cout << "❌ Book not found.\n";
    }

    void returnBook() {
        int id;
        cout << "Enter Book ID to return: ";
        cin >> id;

        for (auto &b : books) {
            if (b.id == id) {
                if (b.isIssued) {
                    b.isIssued = false;
                    cout << "✅ Book returned successfully!\n";
                } else {
                    cout << "❌ Book was not issued.\n";
                }
                return;
            }
        }
        cout << "❌ Book not found.\n";
    }
};

int main() {
    Library lib;
    int choice;

    do {
        cout << "\n===== 📖 Library Management System =====\n";
        cout << "1. Add Book\n";
        cout << "2. Display Books\n";
        cout << "3. Search Book\n";
        cout << "4. Issue Book\n";
        cout << "5. Return Book\n";
        cout << "6. Exit\n";
        cout << "Enter your choice: ";
        cin >> choice;

        switch (choice) {
            case 1: lib.addBook(); break;
            case 2: lib.displayBooks(); break;
            case 3: lib.searchBook(); break;
            case 4: lib.issueBook(); break;
            case 5: lib.returnBook(); break;
            case 6: cout << "👋 Exiting... Thank you!\n"; break;
            default: cout << "❌ Invalid choice!\n";
        }
    } while (choice != 6);

    return 0;
}
