import tkinter as tk
from tkinter import messagebox
import os

FILE_NAME = "expenses.txt"

def add_expense():
    item = entry_item.get()
    amount = entry_amount.get()
    if item and amount:
        with open(FILE_NAME, "a") as f:
            f.write(f"{item} - Rs.{amount}\n")
        messagebox.showinfo("Saved", "Expense added successfully!")
        entry_item.delete(0, tk.END)
        entry_amount.delete(0, tk.END)
    else:
        messagebox.showwarning("Error", "Enter both item and amount")

def view_expenses():
    if os.path.exists(FILE_NAME):
        with open(FILE_NAME, "r") as f:
            data = f.read()
        messagebox.showinfo("Expenses", data if data else "No expenses yet!")
    else:
        messagebox.showinfo("Expenses", "No expenses file found!")

root = tk.Tk()
root.title("Expense Tracker")

tk.Label(root, text="Item:").grid(row=0, column=0)
entry_item = tk.Entry(root)
entry_item.grid(row=0, column=1)

tk.Label(root, text="Amount:").grid(row=1, column=0)
entry_amount = tk.Entry(root)
entry_amount.grid(row=1, column=1)

tk.Button(root, text="Add Expense", command=add_expense).grid(row=2, column=0)
tk.Button(root, text="View Expenses", command=view_expenses).grid(row=2, column=1)

root.mainloop()
