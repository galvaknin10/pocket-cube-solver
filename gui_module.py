# Use matplotlib and tkinter for creating the app GUI
import tkinter as tk
from tkinter import messagebox
from pocket_cube import Pocket_Cube
from solve_cube import solve_user_cube
import matplotlib.pyplot as plt
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
import numpy as np
import pickle


class PocketCubeGUI:
    """GUI Application for solving the Pocket Cube using Tkinter and Matplotlib."""


    def __init__(self, master):
        """Initialize the Pocket Cube GUI."""
        self.master = master
        master.title("Pocket Cube Solver")

        # Configure window properties
        self.master.geometry("1920x1080")  # Set the initial window size
        self.master.config(bg="white")  # Set the background color
        self.master.state('zoomed')  # Start in maximized mode

        # Initialize Pocket Cube and its solved state
        self.cube = Pocket_Cube()
        self.cube.update_faces_by_symmetry(f'{'I' * 24}')  # Default "solved" state
        self.cube_in_solved_state = Pocket_Cube()

        # Application variables
        self.solution_path = []  # Stores the solution steps
        self.surfaces = []  # Holds references to cube faces in the 3D simulation
        self.current_step_index = 0  # Tracks the current solution step
        self.message_displayed = False  # Flag for milestone messages
        self.cancelled = False  # Tracks if operations are cancelled
        self.tree_data = self.load_tree_data()  # Load precomputed solution data

        # Map specific action to it's corresponds index layer
        self.actions_dict = {'Rotate the top layer (x-axis) (counterclockwise)': ([0, 1, 2, 3, 8, 9, 12, 13, 16, 17, 20, 21], '↺'),
                            'Rotate the bottom layer (x-axis) (counterclockwise)': ([4, 5, 6, 7, 10, 11, 14, 15, 18, 19, 22, 23], '↺'),
                            'Rotate the most deeper layer (z-axis) (counterclockwise)': ([8, 9, 10, 11, 0, 1, 16, 18, 21, 23, 4, 5], '↺'),
                            'Rotate the less deeper layer (z-axis) (counterclockwise)': ([12, 13, 14, 15, 2, 3, 17, 19, 20, 22, 6, 7], '↺'),
                            'Rotate the left layer (y-axis) (counterclockwise)': ([16, 17, 18, 19, 0, 2, 12, 14, 5, 7, 9, 11], '⤺ '),
                            'Rotate the right layer (y-axis) (counterclockwise)': ([20, 21, 22, 23, 1, 3, 4, 6, 13, 15, 8, 10], '⤺ ')}

        # Map cube colors to display colors
        self.translate_color = {
            'B': 'blue', 'G': 'green', 'O': 'orange', 
            'R': 'red', 'W': 'white', 'Y': 'yellow', 'I': 'gray'
        }

        # Define user interaction options
        self.color_options = [
            ("white", "#FFFFFF"),
            ("yellow", "#FFFF00"),
            ("orange", "#FFA500"),
            ("red", "#FF0000"),
            ("green", "#008000"),
            ("blue", "#0000FF")
        ]

        # Create Matplotlib 3D figure for cube simulation
        self.fig, self.ax = plt.subplots(subplot_kw={'projection': '3d'})
        self.ax.set_facecolor('white')  # Set figure background
        self.canvas = FigureCanvasTkAgg(self.fig, master=self.master)
        self.canvas.get_tk_widget().pack(side=tk.TOP, fill=tk.BOTH, expand=True)

        # Initialize cube simulation and GUI widgets
        self.create_simulation()
        self.create_widgets()
    
    
    def load_tree_data(self):
        """Load precomputed solution data from a file."""
        with open('preprocessed_tree_data.pkl', 'rb') as file:
            return pickle.load(file)


    def create_widgets(self):
        """Create buttons and user interface elements."""
        self.button_frame = tk.Frame(self.master, bg="white")  
        self.button_frame.pack(side=tk.BOTTOM, pady=20)

        # Add buttons with consistent styles
        self.shuffle_button = tk.Button(self.button_frame, text="Solve Cube", command=self.solve_cube,
                                        font=("Arial", 12, "bold"), width=20, height=2,
                                        bg="#4CAF50", fg="white", relief="raised", borderwidth=2)
        self.shuffle_button.grid(row=0, column=0, padx=20, pady=10)

        self.enter_state_button = tk.Button(self.button_frame, text="Enter State Manually", command=self.enter_state,
                                            font=("Arial", 12, "bold"), width=20, height=2,
                                            bg="#FF9800", fg="white", relief="raised", borderwidth=2)
        self.enter_state_button.grid(row=0, column=1, padx=20, pady=10)

        self.restart_button = tk.Button(self.button_frame, text="Restart", command=self.handle_restart,
                                        font=("Arial", 12, "bold"), width=20, height=2,
                                        bg="#2196F3", fg="white", relief="raised", borderwidth=2)
        self.restart_button.grid(row=0, column=2, padx=20, pady=10)

        self.previous_step_button = tk.Button(self.button_frame, text="Previous Step", command=self.previous_step,
                                            font=("Arial", 12, "bold"), width=20, height=2,
                                            bg="#9E9E9E", fg="white", relief="raised", borderwidth=2)
        self.previous_step_button.grid(row=1, column=0, padx=20, pady=10)
 
        self.next_step_button = tk.Button(self.button_frame, text="Next Step", command=self.next_step,
                                        font=("Arial", 12, "bold"), width=20, height=2,
                                        bg="#9E9E9E", fg="white", relief="raised", borderwidth=2)
        self.next_step_button.grid(row=1, column=1, padx=20, pady=10)

        self.solution_text = tk.Text(self.master, wrap=tk.WORD, font=("Arial Unicode MSial", 20), height=6, width=40,
                                     borderwidth=3, relief="solid")  
        self.solution_text.pack(padx=20, pady=20)


    def create_simulation(self):
        """Build the 3D visualization of the Pocket Cube."""
        # Top face
        for i in reversed(range(2)):  
            for j in range(2):  
                X = [j * 0.5, (j + 1) * 0.5]  
                Y = [i * 0.5, (i + 1) * 0.5]  
                current_surface = self.ax.plot_surface(
                    np.array([[X[0], X[1]], [X[0], X[1]]]),
                    np.array([[Y[0], Y[0]], [Y[1], Y[1]]]),
                    np.array([[1, 1], [1, 1]]),
                    edgecolor='k',
                    shade=False,
                    alpha=1.0,
                    color='gray'
                )
                self.surfaces.append(current_surface)

        # Bottom face
        for i in reversed(range(2)): 
            for j in (range(2)):  
                X = [(1 - j) * 0.5, (2 - j) * 0.5] 
                Y = [i * 0.5, (i + 1) * 0.5] 
                current_surface = self.ax.plot_surface(
                    np.array([[X[0], X[1]], [X[0], X[1]]]),
                    np.array([[Y[0], Y[0]], [Y[1], Y[1]]]),
                    np.array([[0, 0], [0, 0]]),
                    edgecolor='k',
                    alpha=1.0,
                    color='gray'
                )
                self.surfaces.append(current_surface)
                
        # Front Face
        for i in reversed(range(2)): 
            for j in reversed(range(2)): 
                X = [j * 0.5, (j + 1) * 0.5]  
                Z = [i * 0.5, (i + 1) * 0.5] 
                current_surface = self.ax.plot_surface(
                    np.array([[X[0], X[1]], [X[0], X[1]]]),
                    np.array([[1, 1], [1, 1]]),
                    np.array([[Z[0], Z[0]], [Z[1], Z[1]]]),
                    edgecolor='k',
                    alpha=1.0,
                    color='gray'
                )
                self.surfaces.append(current_surface)
               
        # Back Face
        for i in reversed((range(2))):  
            for j in (range(2)): 
                X = [j * 0.5, (j + 1) * 0.5]  
                Z = [i * 0.5, (i + 1) * 0.5] 
                current_surface = self.ax.plot_surface(
                    np.array([[X[0], X[1]], [X[0], X[1]]]),
                    np.array([[0, 0], [0, 0]]),
                    np.array([[Z[0], Z[0]], [Z[1], Z[1]]]),
                    edgecolor='k',
                    alpha=1.0,
                    color='gray'
                )
                self.surfaces.append(current_surface)
                
        # Left face
        for j in reversed(range(2)):  
            for i in reversed((range(2))):  
                Z = [j * 0.5, (j + 1) * 0.5]  
                Y = [i * 0.5, (i + 1) * 0.5]  
                current_surface = self.ax.plot_surface(
                    np.array([[0, 0], [0, 0]]),
                    np.array([[Y[0], Y[1]], [Y[0], Y[1]]]),
                    np.array([[Z[0], Z[0]], [Z[1], Z[1]]]),
                    edgecolor='k',
                    shade=False, 
                    alpha=1.0,
                    color='gray'
                )
                self.surfaces.append(current_surface)

        # Right face
        for i in reversed((range(2))):
            for j in (range(2)):
                Z = [i * 0.5, (i + 1) * 0.5]
                Y = [j * 0.5, (j + 1) * 0.5]
                current_surface = self.ax.plot_surface(
                    np.array([[1, 1], [1, 1]]),
                    np.array([[Y[0], Y[1]], [Y[0], Y[1]]]),
                    np.array([[Z[0], Z[0]], [Z[1], Z[1]]]),
                    edgecolor='k',
                    shade=False,
                    alpha=1.0,
                    color='gray'
                )
                self.surfaces.append(current_surface)

        # Define matplotlib canvas settings       
        self.ax.axis('off')     
        self.ax.set_box_aspect([1, 1, 1])  
        self.ax.set_title('3D Pocket Cube')
        

    def update_simulation(self):
        """
        Updates the 3D visualization of the Pocket Cube to reflect its current state.
        
        The cube's state is represented as a string of characters, where each character
        corresponds to a specific face color. This method maps those characters to their
        respective colors and updates the surfaces in the Matplotlib figure.
        """
        # Get the current cube state as a hashable string (color representation)
        cube_state_string = self.cube.hash_rep()

        # Update each surface color to match the current cube state
        for i, surface in enumerate(self.surfaces):
            surface.set_facecolor(self.translate_color[cube_state_string[i]])

        # Redraw the canvas to display the updated cube colors
        self.canvas.draw()


    def solve_cube(self):
        """
        Solves the current state of the Pocket Cube and stores the solution path.

        This method uses a precomputed tree and BFS logic to find the sequence of moves
        required to solve the cube. If the cube is invalid or unsolvable, it displays an error
        message. Otherwise, it notifies the user that the solution is ready and begins displaying
        the solution steps.
        """
        # Attempt to solve the cube using the precomputed tree data
        self.solution_path = solve_user_cube(
            self.cube, self.cube_in_solved_state.hash_rep(), self.tree_data
        )

        # If no solution is found, notify the user and exit
        if not self.solution_path:
            messagebox.showinfo("Error", "Verify cube is valid")
            return

        # Notify the user that the solution is ready
        messagebox.showinfo(
            "Solved!",
            "Cube has been solved, follow the guiding steps.\n"
            "Note: Cube might display in a different shape due to symmetry."
        )

        # Start displaying the solution steps
        self.display_current_step()


    def open_color_picker(self):
        """
        Opens a Toplevel window for the user to select a color.

        The color picker allows the user to choose from predefined colors and returns the
        selected color. If the window is closed without selecting a color, the operation is
        marked as cancelled.

        Returns:
            str: The hex code of the selected color, or None if the window is closed or cancelled.
        """
        # Create a Toplevel window for the color picker
        color_picker_window = tk.Toplevel(self.master)
        color_picker_window.title("Choose a color")
        color_picker_window.geometry("600x100+200+200")  # Set the window size and position

        # Define a helper function for handling window close events
        def on_close():
            color_picker_window.destroy()
            self.cancelled = True  # Mark the operation as cancelled

        # Bind the close button (X) to the on_close function
        color_picker_window.protocol("WM_DELETE_WINDOW", on_close)

        # Function to handle color selection and close the window
        def choose_color(selected_color):
            self.selected_color = selected_color  # Store the selected color
            color_picker_window.destroy()  # Close the color picker window

        # Add an instruction label to the window
        instructions_label = tk.Label(
            color_picker_window,
            text="Select a color for the highlight square:"
        )
        instructions_label.pack(pady=10)

        # Create a container for color selection buttons
        button_frame = tk.Frame(color_picker_window)
        button_frame.pack(pady=10)

        # Add buttons for each color, with corresponding actions
        for color_name, color_code in self.color_options:
            color_button = tk.Button(
                button_frame,
                text=color_name,  # Display the color name
                bg=color_code,  # Use the color as the button background
                width=10,  # Set button size
                command=lambda color=color_code: choose_color(color)  # Pass the selected color
            )
            color_button.pack(side=tk.LEFT, padx=5)  # Arrange buttons side-by-side

        # Wait until the user selects a color or closes the window
        self.master.wait_window(color_picker_window)

        # Return the selected color, or None if cancelled
        return getattr(self, 'selected_color', None)


    def reset_surface_linewidths(self):
        """
        Resets the linewidth of all cube surfaces to their default value.

        This method ensures that all surfaces in the 3D cube visualization
        return to their normal state (thin black edges). It is useful after
        highlighting specific cube faces, to restore a clean, default appearance.
        """
        # Iterate through all surfaces and reset their edge linewidth to default
        for surface in self.surfaces:
            surface.set_linewidth(1)  # Default linewidth for non-highlighted surfaces

        # Redraw the canvas to reflect the updated linewidths
        self.canvas.draw()


    def enter_state(self):
        """
        Allows the user to manually input the cube's current state by selecting colors for each face.

        This method guides the user through a process where they choose a color for each cube face.
        It validates the input and updates the cube's state if the input is valid. If the user cancels
        the operation or provides an invalid input, the process is restarted or aborted.
        """
        # Reset variables and cube to prepare for manual input
        self.cancelled = False
        self.reset_surface_linewidths()
        self.restart()

        # Prepare color mapping for validation and cube state translation
        color_options = dict(self.color_options)  # Map color names to their hex values
        color_options = {value: key for key, value in color_options.items()}  # Reverse mapping for easy lookup
        user_cube_state = ''  # To store the user's cube state as a string
        translate_user_color = {value: key for key, value in self.translate_color.items()}  # Translate GUI colors to cube state colors

        # Iterate through each surface (face of the cube)
        for surface in self.surfaces:
            while True:  # Loop allows the user to correct mistakes
                # Highlight the current surface for user focus
                surface.set_edgecolor('black')  # Highlight the surface edge
                surface.set_linewidth(10)  # Make the edge thicker for better visibility
                self.ax.figure.canvas.draw()

                # Open the color picker for the user to select a color
                user_color = self.open_color_picker()

                if user_color:
                    # Apply the chosen color to the surface
                    surface.set_facecolor(user_color)
                    self.ax.figure.canvas.draw()

                    # Handle cancellation during color selection
                    if self.cancelled:
                        self.restart()  # Reset the process
                        return

                    # Confirm the user's color choice
                    user_confirmation = messagebox.askyesno(
                        "Confirm Color",
                        f"You selected the color {color_options[user_color]}. Do you want to keep it?"
                    )

                    if user_confirmation:
                        # Update the cube state if the user confirms the choice
                        user_cube_state += translate_user_color[color_options[user_color]]
                        self.reset_surface_linewidths()  # Reset the surface edges to default
                        break  # Move to the next surface
                    else:
                        # Reset the surface to its default state and let the user choose again
                        surface.set_facecolor("gray")  # Neutral color for reset
                        self.ax.figure.canvas.draw()
                        continue  # Restart the loop for the same surface

                # Reset the edge color and line width to default
                surface.set_edgecolor('k')  # Default black edge
                surface.set_linewidth(1)  # Thin edge
                self.ax.figure.canvas.draw()

        # If the input is valid, update the cube and notify the user
        messagebox.showinfo("Ready", "Click the Solve Cube button!")
        self.cube.update_faces_by_symmetry(user_cube_state)


    def highlight_path(self, action):
        """
        Highlights the cube faces involved in a specific action.

        This method visually emphasizes the cube faces affected by the given action
        by increasing the edge linewidth and changing the edge color. It resets any
        previous highlights before applying the new ones.

        Args:
            action (str): The name of the action to highlight. Should correspond to
                          a key in `self.actions_dict`.
        """
        # Reset all surface linewidths to their default values
        self.reset_surface_linewidths()

        # If the action indicates the end of the solution, do nothing
        if action == 'Congratulations!':
            return

        # Highlight the relevant cube faces for the specified action
        for i in self.actions_dict[action][0]:
            self.surfaces[i].set_edgecolor('black')  # Use black to emphasize the edge
            self.surfaces[i].set_linewidth(10)  # Increase edge width for visibility


    def display_current_step(self):
        """
        Displays the current step in the solution process and updates the cube visualization.

        This method shows the user the instructions for the current step, updates the cube's
        state, highlights the relevant faces for the step, and redraws the cube. It also notifies
        the user if they are one step away from completing the solution.

        Updates:
            - Text box displays the current instruction for the step.
            - The cube's state and highlights are updated visually.
            - A special notification is shown when the user is one step away from the solution.
        """
        # Ensure the current step index is within the bounds of the solution path
        if 0 <= self.current_step_index < len(self.solution_path):
            step = self.solution_path[self.current_step_index]  # Get the current step

            # Display the current step in the solution text box
            if self.current_step_index != len(self.solution_path) - 1:
                self.solution_text.insert(
                    tk.END,
                    f"Step {self.current_step_index + 1}: Rotate highlight layer within this direction: {self.actions_dict[step[1]][1]}\n"
                )
            else:
                # Display the final step
                self.solution_text.insert(tk.END, f"{step[1]}\n")

            # Update the cube's state for the current step
            self.cube.update_faces_by_symmetry(step[0])

            # Highlight the relevant faces for the current action
            self.highlight_path(step[1])

            # Redraw the cube to reflect updates
            self.update_simulation()

            # Notify the user if they are one step away from solving the cube
            if self.current_step_index == len(self.solution_path) - 2 and not self.message_displayed:
                messagebox.showinfo("Almost There!", "One step for glory!")
                self.message_displayed = True  # Prevent duplicate notifications


    def previous_step(self):
        """
        Moves back to the previous step in the solution path and updates the display.

        This method decrements the current step index, updates the cube's state to reflect
        the previous step, and removes the last instruction from the solution text box.

        Preconditions:
            - The method ensures the current step index is greater than 0 before proceeding.

        Updates:
            - The solution text box reflects the previous step.
            - The cube visualization is updated to match the previous state.
        """
        # Ensure there is a previous step to move back to
        if self.current_step_index > 0:
            self.current_step_index -= 1  # Decrement the step index

            # Remove the last line from the solution text box
            self.solution_text.delete("end-2l", "end-1l")

            # Update the display to show the previous step
            self.display_current_step()


    def next_step(self):
        """
        Advances to the next step in the solution path and updates the display.

        This method increments the current step index, updates the cube's state to reflect
        the next step, and removes the last instruction from the solution text box. If the
        cube is already solved, a notification is displayed.

        Preconditions:
            - The current step index must be less than the length of the solution path - 1
              to advance to the next step.

        Updates:
            - The solution text box reflects the next step.
            - The cube visualization is updated to match the next state.
            - Displays a message when no further steps are available.
        """
        # Ensure there is a next step to move forward to
        if self.current_step_index < len(self.solution_path) - 1:
            self.current_step_index += 1  # Increment the step index

            # Remove the last line from the solution text box
            self.solution_text.delete("end-2l", "end-1l")

            # Update the display to show the next step
            self.display_current_step()
        else:
            # Notify the user that the cube is already solved
            messagebox.showinfo("Chill...", "Already solved!")


    def restart(self):
        """
        Resets the application to its initial state.

        This method clears all user inputs and resets the cube, solution path, and UI elements.
        It is typically called when the user chooses to restart the solving process or reset the cube.

        Updates:
            - Resets all relevant variables to their initial states.
            - Clears the solution text box.
            - Restores the cube to its default (solved) state.
            - Redraws the cube with default settings.
        """
        # Reset application variables
        self.current_step_index = 0  # Reset step index to the start
        self.solution_path = []  # Clear any existing solution path
        self.message_displayed = False  # Reset the flag for milestone messages

        # Reinitialize the cube to its default (solved) state
        self.cube = Pocket_Cube()
        initial_cube_state = 'I' * 24  # Default cube state (all faces neutral)
        self.cube.update_faces_by_symmetry(initial_cube_state)

        # Clear the solution text box in the UI
        self.solution_text.delete(1.0, tk.END)

        # Reset the cube visualization to its default state
        self.reset_surface_linewidths()  # Reset surface edges
        self.update_simulation()  # Redraw the cube visualization


    def handle_restart(self):
        """
        Handles the user's request to restart the application.

        This method displays a notification to inform the user that the cube will be reset,
        then calls the `restart` method to reset the application to its initial state.
        """
        # Notify the user about the reset action
        messagebox.showinfo("Notice", "The cube will be reset to the solved state.")

        # Perform the reset
        self.restart()



