import os
import cv2
import sqlite3
import numpy as np
from flask import Flask, render_template, request, redirect, url_for, flash, session

app = Flask(__name__, template_folder=".")
app.secret_key = 'your_secret_key'

# -------------------- DATABASE --------------------
def init_db():
    with sqlite3.connect('users.db') as conn:
        conn.execute('''CREATE TABLE IF NOT EXISTS users (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            username TEXT UNIQUE
                        )''')
init_db()

# -------------------- FACE UTILITIES --------------------
def capture_faces(username):
    cam = cv2.VideoCapture(0)
    if not cam.isOpened():
        flash("Camera not accessible", "danger")
        return False

    face_detector = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    dataset_path = f"dataset/{username}"
    os.makedirs(dataset_path, exist_ok=True)

    count = 0
    while count < 30:
        ret, img = cam.read()
        if not ret:
            continue
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        faces = face_detector.detectMultiScale(gray, 1.3, 5)

        for (x, y, w, h) in faces:
            count += 1
            cv2.imwrite(f"{dataset_path}/{count}.jpg", gray[y:y+h, x:x+w])
            cv2.rectangle(img, (x, y), (x+w, y+h), (255, 0, 0), 2)
        cv2.imshow('Capturing Faces', img)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cam.release()
    cv2.destroyAllWindows()
    return True

def train_model():
    recognizer = cv2.face.LBPHFaceRecognizer_create()
    faces, labels, label_dict = [], [], {}
    label_id = 0

    for user in os.listdir('dataset'):
        user_path = os.path.join('dataset', user)
        if not os.path.isdir(user_path):
            continue
        label_dict[label_id] = user
        for img_name in os.listdir(user_path):
            img_path = os.path.join(user_path, img_name)
            img = cv2.imread(img_path, cv2.IMREAD_GRAYSCALE)
            if img is None:
                continue
            faces.append(img)
            labels.append(label_id)
        label_id += 1

    if not faces:
        return

    recognizer.train(faces, np.array(labels))
    os.makedirs('recognizer', exist_ok=True)
    recognizer.save('recognizer/model.yml')
    np.save('recognizer/labels.npy', label_dict)

# -------------------- ROUTES --------------------
@app.route('/')
def home():
    return redirect(url_for('login'))

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']

        with sqlite3.connect('users.db') as conn:
            cur = conn.cursor()
            cur.execute("SELECT * FROM users WHERE username=?", (username,))
            if cur.fetchone():
                flash("Username already exists", "danger")
                return redirect(url_for('register'))

            cur.execute("INSERT INTO users (username) VALUES (?)", (username,))
            conn.commit()

        flash("Capturing your face...", "info")
        if capture_faces(username):
            train_model()
            flash("Face registered successfully!", "success")
        else:
            flash("Face registration failed. Try again.", "danger")

        return redirect(url_for('login'))

    return render_template("register.html")

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        session['login_username'] = username
        return redirect(url_for('face_login'))

    return render_template("login.html")

@app.route('/face-login')
def face_login():
    username = session.get('login_username')
    if not username:
        flash("Please enter username first", "warning")
        return redirect(url_for('login'))

    model_path = 'recognizer/model.yml'
    label_path = 'recognizer/labels.npy'

    # Check model and label file existence
    if not os.path.exists(model_path) or not os.path.exists(label_path):
        flash("Face model not found. Please register first.", "warning")
        return redirect(url_for('register'))

    # Check if username exists in DB
    with sqlite3.connect('users.db') as conn:
        cur = conn.cursor()
        cur.execute("SELECT * FROM users WHERE username=?", (username,))
        user = cur.fetchone()
        if not user:
            flash("Username not found. Please register first.", "warning")
            return redirect(url_for('register'))

    # Check if username is part of trained model
    labels = np.load(label_path, allow_pickle=True).item()
    if username not in labels.values():
        flash("User not found in face model. Please re-register.", "warning")
        return redirect(url_for('register'))

    model = cv2.face.LBPHFaceRecognizer_create()
    model.read(model_path)
    labels = np.load(label_path, allow_pickle=True).item()
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

    cam = cv2.VideoCapture(0)
    if not cam.isOpened():
        flash("Could not access camera", "danger")
        return redirect(url_for('login'))

    attempts = 0
    while attempts < 100:
        ret, frame = cam.read()
        if not ret:
            continue
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, 1.3, 5)

        for (x, y, w, h) in faces:
            roi = gray[y:y+h, x:x+w]
            id_, conf = model.predict(roi)
            matched_username = labels.get(id_)

            if conf < 60 and matched_username == username:
                with sqlite3.connect('users.db') as conn:
                    cur = conn.cursor()
                    cur.execute("SELECT id FROM users WHERE username=?", (username,))
                    user = cur.fetchone()
                    if user:
                        session['user_id'] = user[0]
                        cam.release()
                        cv2.destroyAllWindows()
                        flash("Face matched and login successful!", "success")
                        return redirect(url_for('dashboard'))

        cv2.imshow("Face Login", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
        attempts += 1

    cam.release()
    cv2.destroyAllWindows()
    flash("Face did not match entered username.", "danger")
    return redirect(url_for('login'))

@app.route('/dashboard')
def dashboard():
    if 'user_id' not in session:
        flash("Login required.", "warning")
        return redirect(url_for('login'))
    return render_template("dashboard.html")

@app.route('/logout')
def logout():
    session.clear()
    flash("Logged out", "info")
    return redirect(url_for('login'))

if __name__ == '__main__':
    app.run(debug=True)
