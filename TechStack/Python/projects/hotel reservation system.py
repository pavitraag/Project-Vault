import sqlite3

# Database setup
conn = sqlite3.connect("hotel.db")
cur = conn.cursor()
cur.execute("CREATE TABLE IF NOT EXISTS reservations(id INTEGER PRIMARY KEY, name TEXT, room TEXT)")
conn.commit()

def book_room(name, room):
    cur.execute("INSERT INTO reservations(name, room) VALUES(?, ?)", (name, room))
    conn.commit()
    print("Room booked successfully!")

def view_reservations():
    cur.execute("SELECT * FROM reservations")
    for row in cur.fetchall():
        print(row)

def check_in(name):
    cur.execute("DELETE FROM reservations WHERE name=?", (name,))
    conn.commit()
    print("Checked in!")

# Example usage
book_room("Alice", "101")
book_room("Bob", "102")
print("Current Reservations:")
view_reservations()
check_in("Alice")
print("After check-in:")
view_reservations()
