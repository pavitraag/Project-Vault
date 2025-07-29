import win32gui
import win32con

def set_top(title):
    win = win32gui.FindWindow(None, title)
    if win:
        win32gui.SetWindowPos(win, win32con.HWND_TOPMOST, 50, 100, 640, 480, win32con.SWP_SHOWWINDOW)
