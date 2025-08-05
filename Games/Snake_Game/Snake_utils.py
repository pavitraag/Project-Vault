def fingers_up(landmarks):
    fingers = []

    if landmarks[4].x < landmarks[3].x:
        fingers.append(1)
    else:
        fingers.append(0)

    tips = [8, 12, 16, 20]
    pips = [6, 10, 14, 18]

    for t, p in zip(tips, pips):
        if landmarks[t].y < landmarks[p].y:
            fingers.append(1)
        else:
            fingers.append(0)

    return fingers

def detect(f):
    if f == [0, 1, 0, 0, 0]:
        return 'up'
    elif f == [0, 1, 1, 0, 0]:
        return 'down'
    elif f == [1, 0, 0, 0, 0]:
        return 'right'
    elif f == [0, 0, 0, 0, 1]:
        return 'left'
    return None
