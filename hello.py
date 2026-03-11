#!/usr/bin/env python3

def greet_user(name):
    """Greet a user by name."""
    print(f"Hello, {name}!")
    print("Welcome to the GitHub learning project!")

def main():
    print("Hello, GitHub!")
    print("This is my first project.")

    # New feature: personalized greeting
    user_name = input("\nWhat's your name? ")
    greet_user(user_name)

if __name__ == "__main__":
    main()
