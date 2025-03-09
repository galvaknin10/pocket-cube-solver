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
    

    def copy(self):
        """
        Creates a deep copy of the current cube state.

        This method generates a new instance of the Pocket_Cube class with the same
        face configuration as the original cube. It ensures that modifications to the
        new cube do not affect the original cube's state.

        Returns:
            Pocket_Cube: A new cube instance with an identical configuration to the original.
        """
        # Create a new instance of Pocket_Cube
        new_cube = Pocket_Cube()

        # Deep copy each face grid to ensure the original is not modified
        new_cube.faces = {
            face: [row[:] for row in grid]  # Copy each row in the grid
            for face, grid in self.faces.items()
        }

        # Return the new cube instance
        return new_cube


    def hash_rep(self):
        """
        Generates a unique hash representation of the cube's current state.

        This method flattens the cube's face grids into a single string, where
        each character represents the color of a sticker. The resulting hash
        is useful for comparing cube states or storing them in data structures
        like sets or dictionaries.

        Returns:
            str: A string representing the hash of the cube's current state.
        """
        result = ''  # Initialize an empty string to store the hash representation

        # Iterate through each face's grid
        for grid in self.faces.values():
            # Flatten each row and concatenate into the result
            for row in grid:
                result += ''.join(row)

        # Return the final hash representation
        return result

    
    def normalize_cube_by_symmetry(self):
        """
        Generate all 24 symmetrical representations of the cube by applying rotations.

        The cube is rotated in all possible orientations to account for its full symmetry.
        For each orientation, a unique hash representation of the cube's state is generated.
        This is useful for normalizing cube states, comparing states, or generating
        symmetrical solutions.

        Returns:
            list: A list containing hash representations of the cube for all 24 symmetrical states.
        """
        possible_rotations = []  # Store all hash representations of cube states
        counter = 1  # Track the rotation sets (one for each face in the "up" position)

        # Generate symmetrical states by iterating through rotation sets
        while counter <= 6:  # There are 6 unique sets based on the face in the "up" position
            for _ in range(4):  # Rotate the cube 4 times (clockwise) for each set
                self.action_1()  # Rotate along the x-axis
                self.action_2()  # Apply further rotation along the x-axis
                possible_rotations.append(self.hash_rep())  # Store the hash of the current state

            counter += 1  # Move to the next set of rotations

            if counter <= 4:
                # Rotate the cube around the z-axis for sets 1-4
                self.action_3()  # Rotate around the z-axis
                self.action_4()  # Further rotate around the z-axis
            elif counter == 5:
                # Rotate the cube around the y-axis for set 5
                self.action_5()  # Rotate around the y-axis
                self.action_6()  # Further rotate around the y-axis
            elif counter == 6:
                # Complete the symmetry with additional y-axis rotations
                self.action_5()  # Rotate around the y-axis
                self.action_6()  # Further rotate around the y-axis
                self.action_5()  # Rotate again around the y-axis
                self.action_6()  # Rotate again around the y-axis

        return possible_rotations  # Return all 24 symmetrical states of the cube


    def update_faces_by_symmetry(self, state):
        """
        Updates the cube's faces based on a provided state string.

        The state string represents the cube's configuration in a linear format, where each
        pair of characters corresponds to a single row on a face. This method parses the state
        string, splits it into rows, and updates each face of the cube accordingly.

        Args:
            state (str): A string representing the current state of the cube's faces.
                         The string length must be divisible into 2-character rows for each face.
        """
        # Convert the state string into rows, each representing 2 elements of a face
        faces_by_rows = [state[i:i + 2] for i in range(0, len(state), 2)]

        # Initialize a counter to track which rows belong to which face
        j = 0

        # Iterate through the cube's faces and update them
        for key in self.faces:
            # Assign two rows from the state string to the current face
            self.faces[key] = [faces_by_rows[j], faces_by_rows[j + 1]]
            j += 2  # Advance to the next set of rows for the next face


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