import tkinter as tk
from gui_module import PocketCubeGUI

# Main execution
def main():
    root = tk.Tk()
    pocket_cube_gui = PocketCubeGUI(root)

    # Handle the window close event
    def on_close():
        root.destroy()  # Properly close the window and stop the application
        exit()  # Exit the program to release resources

    root.protocol("WM_DELETE_WINDOW", on_close)  # Attach the handler to the close event
    root.mainloop()

if __name__ == "__main__":
    main()


