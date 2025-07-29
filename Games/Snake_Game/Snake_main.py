import cv2
import mediapipe as mp
import pyautogui
import time

from Snake_utils import fingers_up, detect
from window_top import set_top

mp_hands = mp.solutions.hands
hands = mp_hands.Hands(min_detection_confidence=0.7, min_tracking_confidence=0.7)
draw = mp.solutions.drawing_utils

#Camera
cam = cv2.VideoCapture(0)
last = time.time()
cool = 1.5
name = "Snake_Window"
cv2.namedWindow(name)

#Instructions
instructions = [
    "SNAKE GAME GESTURE CONTROLS:",
    "Index Finger Up       ->Up",
    "Index + Middle Up     ->Down",
    "Thumb Left            ->Right",
    "Pinky Only            ->Left",
    "ESC                   ->Exit"
]

while True:
    ok, img = cam.read()
    if not ok:
        break

    img = cv2.flip(img, 1)
    rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    res = hands.process(rgb)

    if res.multi_hand_landmarks:
        for hand in res.multi_hand_landmarks:
            draw.draw_landmarks(img, hand, mp_hands.HAND_CONNECTIONS)
            f = fingers_up(hand.landmark)
            g = detect(f)

            if g and time.time() - last > cool:
                pyautogui.press(g)
                last = time.time()

    #instructions
    for i, text in enumerate(instructions):
        cv2.putText(img, text, (10, 30 + i * 25), cv2.FONT_HERSHEY_SIMPLEX,
                    0.6, (255, 0, 255), 2, cv2.LINE_AA)

    cv2.imshow(name, img)
    set_top(name)

    if cv2.waitKey(1) & 0xFF == 27:#exit
        break

cam.release()
cv2.destroyAllWindows()
