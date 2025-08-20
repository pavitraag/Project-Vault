from flask import Flask, render_template_string
import random

app = Flask(__name__)

facts = [
    "Honey never spoils.",
    "Bananas are berries, but strawberries are not.",
    "Octopuses have three hearts.",
    "A day on Venus is longer than a year on Venus."
]

@app.route("/")
def index():
    fact = random.choice(facts)
    return render_template_string("""
        <html>
            <head><title>Fun Fact Generator</title></head>
            <body style="text-align:center;">
                <h1>🤓 Fun Fact Generator</h1>
                <p>{{ fact }}</p>
                <a href="/">Get another fact</a>
            </body>
        </html>
    """, fact=fact)

if __name__ == "__main__":
    app.run(debug=True)
