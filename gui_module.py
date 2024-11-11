import tkinter as tk
from tkinter import simpledialog, messagebox
from pocket_cube import Pocket_Cube
from solve_cube import solve_user_cube
import matplotlib.pyplot as plt
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
import numpy as np
import pickle


class PocketCubeGUI:


    def __init__(self, master):
        self.master = master
        master.title("Pocket Cube Solver")

        # Set window size and background color
        self.master.geometry("1920x1080")  
        self.master.config(bg="white")  
        self.master.state('zoomed') 

        # Initialize the cube object and its solved state
        self.cube = Pocket_Cube()  
        self.cube_in_solved_state = Pocket_Cube()
        
        # Initialize state management
        self.solution_path = []  # Stores the solution steps
        self.current_step_index = 0  # Tracks the current step index in solution path

        # Create Matplotlib figure for the cube simulation
        self.fig, self.ax = plt.subplots(subplot_kw={'projection': '3d'})
        self.ax.set_facecolor('white')  
        self.canvas = FigureCanvasTkAgg(self.fig, master=self.master)
        self.canvas.get_tk_widget().pack(side=tk.TOP, fill=tk.BOTH, expand=True)
    
        # Call to draw the cube in its initial state
        self.draw_cube()

        # Create the GUI widgets (buttons, text box, etc.)
        self.create_widgets()

        # Initialize global tree data
        self.tree_data = self.load_tree_data()


    def load_tree_data(self):
        # Open the file 'preprocessed_tree_data.pkl' in binary read mode
        with open('preprocessed_tree_data.pkl', 'rb') as file:
            # Load the serialized tree data using pickle
            tree_data = pickle.load(file)
            # Return the deserialized tree data
            return tree_data


    def create_widgets(self):
        # Frame to group the control buttons together
        self.button_frame = tk.Frame(self.master, bg="white")  
        self.button_frame.pack(side=tk.BOTTOM, pady=20)

        # Button for shuffling the cube
        self.shuffle_button = tk.Button(self.button_frame, text="Shuffle Cube", command=self.shuffle_cube,
                                        font=("Arial", 12, "bold"), width=20, height=2,
                                        bg="#4CAF50", fg="white", relief="raised", borderwidth=2)
        self.shuffle_button.grid(row=0, column=0, padx=20, pady=10)

        # Button to manually enter a state
        self.enter_state_button = tk.Button(self.button_frame, text="Enter State Manually", command=self.enter_state,
                                            font=("Arial", 12, "bold"), width=20, height=2,
                                            bg="#FF9800", fg="white", relief="raised", borderwidth=2)
        self.enter_state_button.grid(row=0, column=1, padx=20, pady=10)

        # Button to restart the cube (reset to solved state)
        self.restart_button = tk.Button(self.button_frame, text="Restart", command=self.handle_restart,
                                        font=("Arial", 12, "bold"), width=20, height=2,
                                        bg="#2196F3", fg="white", relief="raised", borderwidth=2)
        self.restart_button.grid(row=0, column=2, padx=20, pady=10)
  
        # Navigation buttons (Previous and Next Step)
        self.previous_step_button = tk.Button(self.button_frame, text="Previous Step", command=self.previous_step,
                                            font=("Arial", 12, "bold"), width=20, height=2,
                                            bg="#9E9E9E", fg="white", relief="raised", borderwidth=2)
        self.previous_step_button.grid(row=1, column=0, padx=20, pady=10)
 
        self.next_step_button = tk.Button(self.button_frame, text="Next Step", command=self.next_step,
                                        font=("Arial", 12, "bold"), width=20, height=2,
                                        bg="#9E9E9E", fg="white", relief="raised", borderwidth=2)
        self.next_step_button.grid(row=1, column=1, padx=20, pady=10)

        # Solution display area (Text box with scroll)
        self.solution_text = tk.Text(self.master, wrap=tk.WORD, font=("Arial", 14), height=6, width=40,
                                     borderwidth=3, relief="solid")  # Add visible border
        self.solution_text.pack(padx=20, pady=20)


    def draw_cube(self):
        # Clear the current plot
        self.ax.cla()  

        translate_color = {'B': 'blue', 'G': 'green', 'O': 'orange', 'R': 'red', 'W': 'white', 'Y': 'yellow'}
        state_string = self.cube.hash_rep() # Current state cube in str representation
        color_index = 0  # Initialize color index before the loop

        # Top face
        for i in reversed(range(2)):  
            for j in range(2):  
                X = [j * 0.5, (j + 1) * 0.5]  
                Y = [i * 0.5, (i + 1) * 0.5]  
                color = translate_color[state_string[color_index]]
                
                # Plot the individual square
                self.ax.plot_surface(
                    np.array([[X[0], X[1]], [X[0], X[1]]]),
                    np.array([[Y[0], Y[0]], [Y[1], Y[1]]]),
                    np.array([[1, 1], [1, 1]]),
                    color=color,
                    edgecolor='k',
                    shade=False,
                    alpha=1.0
                )
                color_index += 1  # Move to the next color in the state string

        # Bottom face
        for i in reversed(range(2)): 
            for j in (range(2)):  
                X = [(1 - j) * 0.5, (2 - j) * 0.5] 
                Y = [i * 0.5, (i + 1) * 0.5] 
                color = translate_color[state_string[color_index]]

                # Plot the individual square
                self.ax.plot_surface(
                    np.array([[X[0], X[1]], [X[0], X[1]]]),
                    np.array([[Y[0], Y[0]], [Y[1], Y[1]]]),
                    np.array([[0, 0], [0, 0]]),
                    color=color,
                    edgecolor='k',
                    alpha=1.0
                )
                color_index += 1  # Move to the next color in the state string

        # Front Face
        for i in reversed(range(2)): 
            for j in reversed(range(2)): 
                X = [j * 0.5, (j + 1) * 0.5]  
                Z = [i * 0.5, (i + 1) * 0.5] 
                color = translate_color[state_string[color_index]]

                # Plot the individual square
                self.ax.plot_surface(
                    np.array([[X[0], X[1]], [X[0], X[1]]]),
                    np.array([[1, 1], [1, 1]]),
                    np.array([[Z[0], Z[0]], [Z[1], Z[1]]]),
                    color=color,
                    edgecolor='k',
                    alpha=1.0
                )
                color_index += 1  # Move to the next color in the state string

        # Back Face
        for i in reversed((range(2))):  
            for j in (range(2)): 
                X = [j * 0.5, (j + 1) * 0.5]  
                Z = [i * 0.5, (i + 1) * 0.5] 
                color = translate_color[state_string[color_index]]

                # Plot the individual square
                self.ax.plot_surface(
                    np.array([[X[0], X[1]], [X[0], X[1]]]),
                    np.array([[0, 0], [0, 0]]),
                    np.array([[Z[0], Z[0]], [Z[1], Z[1]]]),
                    color=color,
                    edgecolor='k',
                    alpha=1.0
                )
                color_index += 1  # Move to the next color in the state string

        # Left face
        for j in reversed(range(2)):  
            for i in reversed((range(2))):  
                Z = [j * 0.5, (j + 1) * 0.5]  
                Y = [i * 0.5, (i + 1) * 0.5]  
                color = translate_color[state_string[color_index]]
                
                # Plot the individual square
                self.ax.plot_surface(
                    np.array([[0, 0], [0, 0]]),
                    np.array([[Y[0], Y[1]], [Y[0], Y[1]]]),
                    np.array([[Z[0], Z[0]], [Z[1], Z[1]]]),
                    color=color,
                    edgecolor='k',
                    shade=False, 
                    alpha=1.0
                )
                color_index += 1  # Move to the next color in the state string


        # Right face
        for i in reversed((range(2))):
            for j in (range(2)):
                Z = [i * 0.5, (i + 1) * 0.5]
                Y = [j * 0.5, (j + 1) * 0.5]
                color = translate_color[state_string[color_index]]

                # Plot the individual square
                self.ax.plot_surface(
                    np.array([[1, 1], [1, 1]]),
                    np.array([[Y[0], Y[1]], [Y[0], Y[1]]]),
                    np.array([[Z[0], Z[0]], [Z[1], Z[1]]]),
                    color=color,  
                    edgecolor='k',
                    shade=False,
                    alpha=1.0
                )
                color_index += 1


        self.ax.axis('off')     # Turn off the axis

     
        self.ax.set_box_aspect([1, 1, 1])  # Equal aspect ratio
        self.ax.set_title('3D Pocket Cube')
        self.canvas.draw()  # Update the canvas with the new plot

      
    def shuffle_cube(self):
        # Reset the cube state to the initial solved state
        self.restart()
        
        # Shuffle the cube with 20 random moves
        self.cube.shuffle()
        
        # Display a message box to inform the user that the cube has been shuffled
        messagebox.showinfo("Shuffle", "Cube shuffled with 20 random moves!")
        
        # Solve the shuffled cube and store the solution path
        # The function solve_user_cube generates the series of moves to solve the cube
        self.solution_path = solve_user_cube(self.cube, self.cube_in_solved_state.hash_rep(), self.tree_data)
        
        # Display the current state of the cube in the simulation
        self.display_current_step()


    def is_valid_cube_state(self, cube_state):
        """
        Validates the user-provided cube state string to ensure it meets the expected format.
        
        :param cube_state: str, the cube state representation (24 characters, 4 per face)
        :return: bool, True if valid, False otherwise
        """
        # Check if the length is exactly 24 (representing 6 faces, 4 letters each)
        if len(cube_state) != 24:
            return False
        
        # Valid colors in the Pocket Cube: W (white), Y (yellow), O (orange), R (red), G (green), B (blue)
        valid_colors = ['W', 'Y', 'O', 'R', 'G', 'B']

        # Ensure all characters in the cube state are valid colors
        for color in cube_state:
            if color not in valid_colors:
                return False
                
        return True
    

    def enter_state(self):
        # Prompt for cube state input
        cube_rep = simpledialog.askstring('Enter Your Cube State', 
                                        'Enter Your Cube State (4 letters per face: U(up), D(down), F(forward), B(back), L(left), R(right)): ')
    
        cube_rep = cube_rep.upper() # Handle lowercase letters 

        # Validate the cube state format until a valid input is provided
        while not self.is_valid_cube_state(cube_rep):
            messagebox.showerror("Invalid Input", 
                                "Invalid input! Please ensure the cube state is exactly 24 characters long, "
                                "and only includes valid colors (W, Y, O, R, G, B).")
            # Re-ask for the cube state if invalid
            cube_rep = simpledialog.askstring('Enter Your Cube State', 
                                            'Enter Your Cube State (4 letters per face: U(up), D(down), F(forward), B(back), L(left), R(right)): ')
        
        # Update the cube with the provided state
        self.restart()
        self.cube.update_faces_by_symmetry(cube_rep)
        self.solution_path = solve_user_cube(self.cube, self.cube_in_solved_state.hash_rep(), self.tree_data)
        self.display_current_step()
        messagebox.showinfo("State Entered", "State successfully entered. The cube might appear different due to symmetry.")


    def display_current_step(self):
        if 0 <= self.current_step_index < len(self.solution_path):
            step = self.solution_path[self.current_step_index]

            if self.current_step_index != len(self.solution_path) - 1:
                self.solution_text.insert(tk.END, f"Step {self.current_step_index + 1}: {step[1]}\n")  # Display current step
            else:
                self.solution_text.insert(tk.END, f"{step[1]}\n")  # Display final step 
                
            self.cube.update_faces_by_symmetry(step[0])
            self.draw_cube()

            # Check if the user is one step away from the solution
            if self.current_step_index == len(self.solution_path) - 2 and not self.message_displayed:
                messagebox.showinfo("Almost There!", "One step for glory!")
                self.message_displayed = True  # Set the flag to True to prevent showing the message again


    def previous_step(self):
        if self.current_step_index > 0:
            self.current_step_index -= 1
            self.solution_text.delete("end-2l", "end-1l")  # Delete the last line
            self.display_current_step()  # Update the display to the previous step


    def next_step(self):
        if self.current_step_index < len(self.solution_path) - 1:
            self.current_step_index += 1
            self.solution_text.delete("end-2l", "end-1l")  # Delete the last line
            self.display_current_step()  # Update the display to the next step
        else:
            messagebox.showinfo("Chill...", "Already solved!")


    def restart(self):
        # Reset all necessary variables to their initial states
        self.current_step_index = 0
        self.solution_path = []  # Reset the solution path
        self.message_displayed = False  # Reset the message flag
        self.cube = Pocket_Cube()  # Reinitialize the cube to its initial state

        # Clear the message box
        self.solution_text.delete(1.0, tk.END)

        # redraw the initial cube state
        self.draw_cube()


    def handle_restart(self):
        messagebox.showinfo("Notice", "The cube will be reset to the solved state.")
        self.restart()

