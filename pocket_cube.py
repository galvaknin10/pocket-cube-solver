import random

# A dictionary representing the standard cube color format with face names as keys and their colors as values
cube_format = {'U': 'B', 'D': 'G', 'F': 'O', 'B': 'R', 'L': 'W', 'R': 'Y'}


class Pocket_Cube:


    def __init__(self):
        """
        Initializes the Pocket Cube with its six faces, where each face is a 2x2 grid of colors.
        A solved state is also created for comparison purposes.
        """
        # Each face is initialized as a 2x2 grid with the same color
        self.faces = {face: [[color] * 2 for i in range(2)] for face, color in cube_format.items()}



    def action_1(self):
        """
        Rotate the top layer (x-axis). (clockwise)
        This function manipulates the 'U' (Up) face and its surrounding faces.
        """
        # Save the new state of the cube after performing the rotation
        updated_back_face = [self.faces['R'][0], self.faces['B'][1]]
        updated_left_face = [self.faces['B'][0], self.faces['L'][1]]
        updated_front_face = [self.faces['L'][0], self.faces['F'][1]]
        updated_right_face = [self.faces['F'][0], self.faces['R'][1]]

        # Update the affected faces
        self.faces['B'] = updated_back_face
        self.faces['L'] = updated_left_face
        self.faces['F'] = updated_front_face
        self.faces['R'] = updated_right_face

        # Rotate the 'U' face clockwise by 90 degrees
        self.faces['U'] = [[self.faces['U'][1][0], self.faces['U'][0][0]], [self.faces['U'][1][1], self.faces['U'][0][1]]]


    def action_2(self):
        """
        Rotate the bottom layer (x-axis). (clockwise)
        This function manipulates the 'D' (Down) face and its surrounding faces.
        """
        # Save the new state of the cube after performing the rotation
        updated_back_face = [self.faces['B'][0], self.faces['R'][1]]
        updated_left_face = [self.faces['L'][0], self.faces['B'][1]]
        updated_front_face = [self.faces['F'][0], self.faces['L'][1]]
        updated_right_face = [self.faces['R'][0], self.faces['F'][1]]

        # Update the affected faces
        self.faces['B'] = updated_back_face
        self.faces['L'] = updated_left_face
        self.faces['F'] = updated_front_face
        self.faces['R'] = updated_right_face

        # Rotate the 'D' face clockwise by 90 degrees
        self.faces['D'] = [[self.faces['D'][0][1], self.faces['D'][1][1]], [self.faces['D'][0][0], self.faces['D'][1][0]]]
        

    def action_3(self):
        """
        Rotate the most deeper layer (z-axis). (clockwise)
        This function affects the 'F' (Front) face and vertical alignment of the up, left, right and down faces.
        """
        updated_right_face = [[self.faces['R'][0][0], self.faces['U'][0][0]], [self.faces['R'][1][0], self.faces['U'][0][1]]]
        updated_down_face = [[self.faces['R'][0][1], self.faces['R'][1][1]], [self.faces['D'][1][0], self.faces['D'][1][1]]]
        updated_left_face = [[self.faces['D'][0][1], self.faces['L'][0][1]], [self.faces['D'][0][0], self.faces['L'][1][1]]]
        updated_up_face = [[self.faces['L'][1][0], self.faces['L'][0][0]], [self.faces['U'][1][0], self.faces['U'][1][1]]]

        # Update the affected faces
        self.faces['R'] = updated_right_face
        self.faces['D'] = updated_down_face
        self.faces['L'] = updated_left_face
        self.faces['U'] = updated_up_face

        # Rotate the 'F' (Front) face by 90 degrees
        self.faces['F'] = [[self.faces['F'][0][1], self.faces['F'][1][1]], [self.faces['F'][0][0], self.faces['F'][1][0]]]


    def action_4(self):
        """
        Rotate the less deeper layer (z-axis). (clockwise)
        This function affects the 'B' (Back) face and vertical alignment of the up, down, left, and right faces.
        """
        updated_right_face = [[self.faces['U'][1][0], self.faces['R'][0][1]], [self.faces['U'][1][1], self.faces['R'][1][1]]]
        updated_down_face = [self.faces['D'][0], [self.faces['R'][0][0], self.faces['R'][1][0]]]
        updated_left_face = [[self.faces['L'][0][0], self.faces['D'][1][1]], [self.faces['L'][1][0], self.faces['D'][1][0]]]
        updated_up_face = [self.faces['U'][0], [self.faces['L'][1][1], self.faces['L'][0][1]]]

        # Update the affected faces
        self.faces['R'] = updated_right_face
        self.faces['D'] = updated_down_face
        self.faces['L'] = updated_left_face
        self.faces['U'] = updated_up_face

        # Rotate the 'B' (Back) face by 90 degrees
        self.faces['B'] = [[self.faces['B'][1][0], self.faces['B'][0][0]], [self.faces['B'][1][1], self.faces['B'][0][1]]]


    def action_5(self):
        """
        Rotate the left layer (y-axis). (clockwise)
        This function affects the 'L' (Left) face and column-based alignment of the front, back, up, and down faces.
        """
        updated_up_face = [[self.faces['B'][0][0], self.faces['U'][0][1]], [self.faces['B'][1][0], self.faces['U'][1][1]]]
        updated_front_face = [[self.faces['F'][0][0], self.faces['U'][1][0]], [self.faces['F'][1][0], self.faces['U'][0][0]]]
        updated_down_face = [[self.faces['D'][0][0], self.faces['F'][0][1]], [self.faces['D'][1][0], self.faces['F'][1][1]]]
        updated_back_face = [[self.faces['D'][1][1], self.faces['B'][0][1]], [self.faces['D'][0][1], self.faces['B'][1][1]]]

        # Update the affected
        self.faces['U'] = updated_up_face
        self.faces['F'] = updated_front_face
        self.faces['D'] = updated_down_face
        self.faces['B'] = updated_back_face

        # Rotate the 'L' (Left) face by 90 degrees
        self.faces['L'] = [[self.faces['L'][0][1], self.faces['L'][1][1]], [self.faces['L'][0][0], self.faces['L'][1][0]]]


    def action_6(self):
        """
        Rotate the right layer (y-axis). (clockwise)
        This function affects the 'R' (Right) face and column-based alignment of the front, back, up, and down faces.
        """
        updated_up_face = [[self.faces['U'][0][0], self.faces['B'][0][1]], [self.faces['U'][1][0], self.faces['B'][1][1]]]
        updated_front_face = [[self.faces['U'][1][1], self.faces['F'][0][1]], [self.faces['U'][0][1], self.faces['F'][1][1]]]
        updated_down_face = [[self.faces['F'][0][0], self.faces['D'][0][1]], [self.faces['F'][1][0], self.faces['D'][1][1]]]
        updated_back_face = [[self.faces['B'][0][0], self.faces['D'][1][0]], [self.faces['B'][1][0], self.faces['D'][0][0]]]

        # Update the affected faces
        self.faces['U'] = updated_up_face
        self.faces['F'] = updated_front_face
        self.faces['D'] = updated_down_face
        self.faces['B'] = updated_back_face

        # Rotate the 'R' (Right) face by 90 degrees
        self.faces['R'] = [[self.faces['R'][1][0], self.faces['R'][0][0]], [self.faces['R'][1][1], self.faces['R'][0][1]]]
    

    def display_cube(self):
        """
        Display the current state of the cube in a readable format.
        Prints each face of the cube and its colors row by row.
        """
        for face, grid in self.faces.items():
            print(f'{face}:')  # Display the face label('U', 'D', 'F', etc)
            for row in grid:
                # Print each color in the current row
                for color in row:
                    print(color, end=' ')
                print('\n')  # Move to the next line after printing a row
            print('\n')  # Separate each face visually with a newline


    def copy(self):
        """
        Create a copy of the current cube state.
        The new cube will have the same face configuration as the original cube.
        """
        new_cube = Pocket_Cube()  # Create a new instance of Pocket_Cube
        # Copy each face grid without modifying the original cube's face
        new_cube.faces = {face: [row[:] for row in grid] for face, grid in self.faces.items()}
        return new_cube  # Return the new cube instance


    def hash_rep(self):
        """
        Create a unique hash representation of the cube's current state.
        This can be used for comparing different cube states.
        """
        result = ''  # Initialize an empty string to store the hash representation
        curr_face = ''  # Store the colors of each face
        # Iterate through the faces and their grids
        for grid in self.faces.values():
            # Flatten each row into a string and add it to the hash
            for row in grid:
                curr_face += ''.join(row)
            result += curr_face  # Add the face's colors to the final result
            curr_face = ''  # Reset for the next face
        return result  # Return the final hash representation
    

    def normalize_cube_by_symmetry(self):
        """
        Normalize the cube state by applying rotations and finding all possible representation
        based on the symmetry. The function rotates the cube in all 24 possible ways to generate all
        symmetrical cube states and return them as a list.
        """
        possible_rotations = []  # Store all possible cube rotations (hash representations)
        counter = 1  # Counter to keep track of the number of rotation sets
        
        while counter < 7:  # Loop through 6 sets of actions (in each set the up-face is other color)

            for _ in range(4):  # Apply 4 rotations (clockwise) for each axis rotation
                self.action_1()  # Perform action 1 (rotation along x-axis)
                self.action_2()  # Perform action 2 (rotation along x-axis)
                possible_rotations.append(self.hash_rep())  # Save the current state’s hash representation

            counter += 1  # Move to the next rotation set
            
            if counter <= 4:
                # Apply action 3 and 4 for rotations around the z-axis
                self.action_3()  # Rotate around z-axis
                self.action_4()  # Rotate around z-axis

            elif counter == 5:
                # Apply action 5 and 6 for rotations around the y-axis
                self.action_5()  # Rotate around y-axis
                self.action_6()  # Rotate around y-axis

            elif counter == 6:
                # Apply two more y-axis rotations to complete the symmetry set
                self.action_5()  # Rotate around y-axis
                self.action_6()  # Rotate around y-axis
                self.action_5()  # Rotate again around y-axis
                self.action_6()  # Rotate again around y-axis
        
        return possible_rotations # Return all 24 possible states of the cube


    def update_faces_by_symmetry(self, state):
        """
        Update the cube's faces based on the provided state string.
        The state string is split into rows of faces, and each face is updated accordingly.
        
        :param state: A string representing the current state of the cube's faces.
        """
        # Convert the state string into rows, each representing 2 face elements
        faces_by_rows = [state[i:i + 2] for i in range(0, len(state), 2)]
        j = 0  # Initialize counter to loop through faces
        
        for key in self.faces:
            # Update each face of the cube using the rows from the state string
            self.faces[key] = [faces_by_rows[j], faces_by_rows[j + 1]]
            j += 2  # Move to the next set of rows for the next face


    def shuffle(self, steps=20):
        """
        Shuffle the cube by applying random moves a specified number of times.
        By default, it will perform 20 random moves.
        """
        for _ in range(steps):
            # Choose a random action from the list of cube manipulations(action_1 to action_6).
            action = random.choice([self.action_1, self.action_2, self.action_3, self.action_4, self.action_5, self.action_6])
            action()  # Apply the chosen random action.
        

    def which_action(self, action_num):
        """
        Returns a description of the action based on the action number.
        This helps identify which move is being applied.
        
        Arguments:
        action_num -- an integer representing the action number (1 to 6)
        
        Returns:
        A string description of the corresponding action.
        """
        if action_num == 1:
            return 'Rotate the top layer (x-axis)'
        elif action_num == 2:
            return 'Rotate the bottom layer (x-axis)'
        elif action_num == 3:
            return 'Rotate the most deeper layer (z-axis)'
        elif action_num == 4:
            return 'Rotate the less deeper layer (z-axis)'
        elif action_num == 5:
            return 'Rotate the left layer (y-axis)'
        elif action_num == 6:
            return 'Rotate the right layer (y-axis)'





    