import random

def rock_paper_scissors():
    choices = ["rock", "paper", "scissors"]
    print("Rock Paper Scissors Game!")
    
    while True:
        user = input("Enter rock, paper or scissors (or 'quit' to stop): ").lower()
        if user == "quit":
            print("Thanks for playing!")
            break
        if user not in choices:
            print("Invalid choice, try again.")
            continue

        computer = random.choice(choices)
        print(f"Computer chose: {computer}")

        if user == computer:
            print("It's a tie!")
        elif (user == "rock" and computer == "scissors") or \
             (user == "paper" and computer == "rock") or \
             (user == "scissors" and computer == "paper"):
            print("🎉 You win!")
        else:
            print("💻 Computer wins!")

rock_paper_scissors()
