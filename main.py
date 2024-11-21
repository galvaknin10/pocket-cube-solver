import tkinter as tk
from gui_module import PocketCubeGUI

def main():
    """
    Entry point for the Pocket Cube Solver application.

    This function initializes the Tkinter root window, creates an instance of the
    PocketCubeGUI, and starts the main event loop. It also ensures that the application
    closes gracefully when the user exits.
    """
    # Create the main Tkinter root window
    root = tk.Tk()

    # Initialize the PocketCubeGUI application
    PocketCubeGUI(root)

    # Define a handler for the window close event
    def on_close():
        """
        Handles the window close event to ensure proper cleanup.

        This method destroys the root window and exits the program to release resources.
        """
        root.destroy()  # Close the Tkinter window
        exit()  # Exit the program to free up resources

    # Attach the close event handler to the window's "X" button
    root.protocol("WM_DELETE_WINDOW", on_close)

    # Start the Tkinter main event loop
    root.mainloop()

if __name__ == "__main__":
    main()


