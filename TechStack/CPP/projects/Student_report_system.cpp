#include <iostream>
#include <vector>
#include <string>
#include <limits>
using namespace std;

struct Student {
    int rollNumber{};
    string name;
    int age{};
    char grade{'-'};

    void display() const {
        cout << "Roll No: " << rollNumber
             << ", Name: " << name
             << ", Age: " << age
             << ", Grade: " << grade << '\n';
    }
};

class StudentRecords {
private:
    vector<Student> records;

    // Find student index by roll number; -1 if not found
    int findIndex(int roll) const {
        for (size_t i = 0; i < records.size(); ++i) {
            if (records[i].rollNumber == roll) return static_cast<int>(i);
        }
        return -1;
    }

public:
    void addStudent() {
        Student s;
        s.rollNumber = readInt("Enter Roll Number: ");
        cout << "Enter Name: ";
        cin.ignore(numeric_limits<streamsize>::max(), '\n'); // clear newline before getline
        getline(cin, s.name);
        s.age = readInt("Enter Age: ");
        s.grade = readGrade("Enter Grade (A-F): ");

        if (findIndex(s.rollNumber) != -1) {
            cout << "⚠️  A student with roll " << s.rollNumber << " already exists.\n";
            return;
        }
        records.push_back(s);
        cout << "✅ Student added successfully!\n";
    }

    void displayAll() const {
        if (records.empty()) {
            cout << "⚠️  No records found!\n";
            return;
        }
        cout << "\n--- Student Records ---\n";
        for (const auto& s : records) s.display();
    }

    void searchStudent() const {
        int roll = readInt("Enter Roll Number to Search: ");
        int idx = findIndex(roll);
        if (idx == -1) {
            cout << "⚠️  Student with Roll No " << roll << " not found!\n";
            return;
        }
        cout << "✅ Student Found: ";
        records[idx].display();
    }

    void updateStudent() {
        int roll = readInt("Enter Roll Number to Update: ");
        int idx = findIndex(roll);
        if (idx == -1) {
            cout << "⚠️  Student with Roll No " << roll << " not found!\n";
            return;
        }

        cout << "Enter new Name: ";
        cin.ignore(numeric_limits<streamsize>::max(), '\n');
        getline(cin, records[idx].name);

        records[idx].age = readInt("Enter new Age: ");
        records[idx].grade = readGrade("Enter new Grade (A-F): ");
        cout << "✅ Record updated successfully!\n";
    }

    void deleteStudent() {
        int roll = readInt("Enter Roll Number to Delete: ");
        int idx = findIndex(roll);
        if (idx == -1) {
            cout << "⚠️  Student with Roll No " << roll << " not found!\n";
            return;
        }
        records.erase(records.begin() + idx);
        cout << "🗑️  Record deleted successfully!\n";
    }

    // --- Input helpers ---
    static int readInt(const string& prompt) {
        int x;
        while (true) {
            cout << prompt;
            if (cin >> x) return x;
            // bad input -> clear and retry
            cin.clear();
            cin.ignore(numeric_limits<streamsize>::max(), '\n');
            cout << "❌ Invalid number. Please try again.\n";
        }
    }

    static char readGrade(const string& prompt) {
        while (true) {
            cout << prompt;
            string g;
            if (cin >> g && !g.empty()) {
                char c = toupper(static_cast<unsigned char>(g[0]));
                if (c >= 'A' && c <= 'F') return c;
            }
            cin.clear();
            cin.ignore(numeric_limits<streamsize>::max(), '\n');
            cout << "❌ Invalid grade. Enter a letter A-F.\n";
        }
    }
};

int main() {
    StudentRecords system;
    while (true) {
        cout << "\n===== Student Record Management System =====\n"
             << "1. Add Student\n"
             << "2. Display All Students\n"
             << "3. Search Student\n"
             << "4. Update Student\n"
             << "5. Delete Student\n"
             << "6. Exit\n";

        int choice = StudentRecords::readInt("Enter your choice: ");
        switch (choice) {
            case 1: system.addStudent(); break;
            case 2: system.displayAll(); break;
            case 3: system.searchStudent(); break;
            case 4: system.updateStudent(); break;
            case 5: system.deleteStudent(); break;
            case 6: cout << "🚪 Exiting... Goodbye!\n"; return 0;
            default: cout << "⚠️  Invalid choice! Try again.\n";
        }
    }
}
