#!/usr/bin/env python3
from datetime import datetime

def show_current_time():
    """Display the current date and time."""
    now = datetime.now()
    formatted_time = now.strftime("%Y-%m-%d %H:%M:%S")
    print(f"\nCurrent date and time: {formatted_time}")

def greet_user(name):
    """Greet a user by name."""
    print(f"Hello, {name}!")
    print("Welcome to the GitHub learning project!")

def main():
    print("Hello, GitHub!")
    print("This is my first project.")

    # New feature: show current time
    show_current_time()

    # New feature: personalized greeting
    user_name = input("\nWhat's your name? ")
    greet_user(user_name)

if __name__ == "__main__":
    main()
