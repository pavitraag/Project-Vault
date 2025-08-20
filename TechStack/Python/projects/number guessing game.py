import random

def number_guessing():
    number = random.randint(1, 100)
    attempts = 0
    print("Welcome to Number Guessing Game!")
    print("Guess the number between 1 and 100")

    while True:
        guess = int(input("Enter your guess: "))
        attempts += 1
        if guess < number:
            print("Too low! Try again.")
        elif guess > number:
            print("Too high! Try again.")
        else:
            print(f"🎉 Correct! You guessed it in {attempts} attempts.")
            break

number_guessing()
