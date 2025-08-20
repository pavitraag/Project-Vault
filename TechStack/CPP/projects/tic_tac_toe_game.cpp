#include <iostream>
#include <cstdlib>
#include <ctime>
using namespace std;

char board[3][3]; // 3x3 board

// Function to reset board
void resetBoard() {
    char c = '1';
    for (int i = 0; i < 3; i++) {
        for (int j = 0; j < 3; j++) {
            board[i][j] = c++;
        }
    }
}

// Function to display board
void displayBoard() {
    cout << "\n\n";
    cout << "     TIC TAC TOE\n";
    cout << "-----------------------\n";
    for (int i = 0; i < 3; i++) {
        cout << " | ";
        for (int j = 0; j < 3; j++) {
            cout << " " << board[i][j] << " |";
        }
        cout << "\n-----------------------\n";
    }
    cout << "\n";
}

// Check winner
char checkWinner() {
    for (int i = 0; i < 3; i++) {
        // Rows and columns
        if (board[i][0] == board[i][1] && board[i][1] == board[i][2]) return board[i][0];
        if (board[0][i] == board[1][i] && board[1][i] == board[2][i]) return board[0][i];
    }
    // Diagonals
    if (board[0][0] == board[1][1] && board[1][1] == board[2][2]) return board[0][0];
    if (board[0][2] == board[1][1] && board[1][1] == board[2][0]) return board[0][2];
    return ' ';
}

// Check if board is full
bool isFull() {
    for (int i = 0; i < 3; i++)
        for (int j = 0; j < 3; j++)
            if (board[i][j] != 'X' && board[i][j] != 'O')
                return false;
    return true;
}

// Player move
void playerMove() {
    int move;
    while (true) {
        cout << "Enter your move (1-9): ";
        cin >> move;
        if (move < 1 || move > 9) {
            cout << "Invalid! Try again.\n";
            continue;
        }
        int row = (move - 1) / 3;
        int col = (move - 1) % 3;
        if (board[row][col] != 'X' && board[row][col] != 'O') {
            board[row][col] = 'X';
            break;
        } else {
            cout << "Cell already taken! Try again.\n";
        }
    }
}

// Computer move (random)
void computerMove() {
    srand(time(0));
    int move;
    while (true) {
        move = rand() % 9 + 1;
        int row = (move - 1) / 3;
        int col = (move - 1) % 3;
        if (board[row][col] != 'X' && board[row][col] != 'O') {
            board[row][col] = 'O';
            cout << "Computer chose " << move << "\n";
            break;
        }
    }
}

// Main Game
int main() {
    int choice;
    do {
        resetBoard();
        char winner = ' ';
        bool gameOver = false;

        while (!gameOver) {
            displayBoard();
            playerMove();
            winner = checkWinner();
            if (winner == 'X' || isFull()) break;

            computerMove();
            winner = checkWinner();
            if (winner == 'O' || isFull()) break;
        }

        displayBoard();
        if (winner == 'X') cout << "🎉 You Win!\n";
        else if (winner == 'O') cout << "💻 Computer Wins!\n";
        else cout << "🤝 It's a Draw!\n";

        cout << "\n1. Play Again\n2. Reset\n3. Exit\nChoose: ";
        cin >> choice;

        if (choice == 2) {
            resetBoard();
            cout << "Board Reset!\n";
            choice = 1; // restart automatically
        }
    } while (choice == 1);

    cout << "Thanks for playing! 👋\n";
    return 0;
}
