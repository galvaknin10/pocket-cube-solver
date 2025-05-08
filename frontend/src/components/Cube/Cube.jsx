/**
 * Cube.jsx
 * 
 * Main component responsible for rendering the 3D Pocket Cube simulation.
 * Handles UI modes (3D vs manual input), state management, and user interaction.
 */
import React, { useState, useEffect } from "react";
import "../Cube.css";
import UnfoldedCube from "../UnfoldedCube";
import { scrambleCube, flattenCubeStateByPosition, reorientCubeFromString } from "./CubeUtils";
import rotateLayerCubies from "./CubeTransformer";
import {handleMouseDown, handleMouseMove, handleMouseUp, handleMouseLeave,} from "./CubeLogic";
import { API_BASE_BACKEND_URL } from '../../config';       



// Default solved state of the cube (used for initial load and reset)
// Each cubie is defined by its 3D position and the color on each visible face
const initialCubeState = [
    {
      id: "UBL",
      position: [-1, 1, -1],
      colors: { U: "blue", B: "red", L: "yellow" },
    },
    {
      id: "UBR",
      position: [1, 1, -1],
      colors: { U: "blue", B: "red", R: "white" },
    },
    {
      id: "UFL",
      position: [-1, 1, 1],
      colors: { U: "blue", F: "orange", L: "yellow" },
    },
    {
      id: "UFR",
      position: [1, 1, 1],
      colors: { U: "blue", F: "orange", R: "white" },
    },
    {
      id: "DBL",
      position: [-1, -1, -1],
      colors: { D: "green", B: "red", L: "yellow" },
    },
    {
      id: "DBR",
      position: [1, -1, -1],
      colors: { D: "green", B: "red", R: "white" },
    },
    {
      id: "DFL",
      position: [-1, -1, 1],
      colors: { D: "green", F: "orange", L: "yellow" },
    },
    {
      id: "DFR",
      position: [1, -1, 1],
      colors: { D: "green", F: "orange", R: "white" },
    },
  ];
  
/**
 * Cube component state hooks
 *
 * - cubeState: current color & position of all cubies
 * - rotation: entire cube’s X/Y rotation (for display)
 * - isDragging: whether user is rotating the whole cube
 * - dragStart: mouse position when drag starts
 * - selectedLayer: which layer is about to be rotated
 * - solutionSteps: sequence of moves returned from backend
 * - currentStepIndex: user's progress through solution
 * - guideMode: whether we’re showing guided solve steps
 * - isScrambling: whether cube is auto-scrambling
 * - manualColorMode: toggles between 3D cube and manual color input
 */
const Cube = () => {
    const [cubeState, setCubeState] = useState(initialCubeState);
    const [rotation, setRotation] = useState({ x: -30, y: 45 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [selectedLayer, setSelectedLayer] = useState(null);
    const [solutionSteps, setSolutionSteps] = useState([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [guideMode, setGuideMode] = useState(false);
    const [isScrambling, setIsScrambling] = useState(false);
    const [manualColorMode, setManualColorMode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);  // for the spinner
    const [isLocked,  setIsLocked]  = useState(false);  // for the overlay
    


    /**
     * Handles a 90-degree rotation of a specific cube layer.
     * Delegates the rotation logic to `rotateLayerCubies`, and updates cube state.
     *
     * @param {string} layer - The layer to rotate (e.g., "U", "D", "L", etc.)
     * @param {number} direction - Rotation direction in degrees (90 or -90)
     */
    const handleRotateLayer = (layer, direction) => {
        setCubeState(prev => rotateLayerCubies(layer, direction, prev));
      };

    /**
     * Handles the scramble button action.
     * Triggers a cube scramble by calling the `scrambleCube` utility,
     * passing in the rotation handler, a state setter for scrambling mode,
     * and a callback to show a completion message.
     */
    const handleScramble = () => {
        scrambleCube(handleRotateLayer, setIsScrambling, showScrambleMessage);
      };
  
    /**
     * Handles the process of solving the cube.
     * 1. Converts current cube state to a compact string.
     * 2. Sends it to the backend to find a matching or symmetrical state.
     * 3. If found, possibly reorients the cube and fetches solution steps.
     * 4. Updates UI with solution or appropriate feedback messages.
     */
    const handleFindSolution = async () => {
        const cubeString = flattenCubeStateByPosition(cubeState);
        setIsLoading(true);
        setIsLocked(true);
    
        try {
        // Step 1: Check if current cube state (or its symmetrical variant) exists in DB
        const symmetryRes = await fetch(`${API_BASE_BACKEND_URL}/find_symmetry`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cube_data: cubeString }),
        });
    
        const symmetryData = await symmetryRes.json();
    
        if (!symmetryData.found) {
            showErrorMessage("Invalid pocket cube. Can't solve.");
            setSolutionSteps(null);
            return;
        }
    
        let noticeMessage = false;
    
        // Step 2: If symmetry found, update cube orientation
        if (symmetryData.state !== cubeString) {
            reorientCubeFromString(symmetryData.state, setCubeState);
            showNoticeMessage(
              `Solution found! Notice: Cube has been switched to an identical symmetric state. 
               Feel free to adapt your cube to this new orientation and when ready, 
               click on <span style="font-family: 'Courier New', cursive; font-weight: 900; font-size: 1.2em; color: #ff5722; text-shadow: 1px 1px 2px #000;">GUIDE ME</span>.`
            );
            
            noticeMessage = true;
        }
    
        // Step 3: Request the solution path from the backend
        const solveRes = await fetch(`${API_BASE_BACKEND_URL}/solve`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cube_data: symmetryData.state }),
        });
    
        const solveData = await solveRes.json();
        console.log(solveData.solution);
    
        // Step 4: Handle result - either already solved or solution found
        if (solveData.solution[0] === "Congratulations!") {
            showCubeAlreadySolvedMessage("Cube is already in its solved state, nothing to do...");
            setSolutionSteps([]);
            setIsLocked(false);
            return;
        } else if (!noticeMessage) {
            showSolutionFoundMessage(`Solution found! click on <span style="font-family: 'Courier New', cursive; font-weight: 900; font-size: 1.2em; color: #ff5722; text-shadow: 1px 1px 2px #000;">GUIDE ME</span>.`);
        }
    
        setSolutionSteps(solveData.solution); // Update state with solution path
    
        } catch (err) {
        console.error("Error finding or solving:", err);
        } finally {
          setIsLoading(false)
        }
    };

    /**
     * Displays a temporary message on screen with a specific style.
     * 
     * @param {string} message - The message text to display.
     * @param {string} messageType - CSS class for styling the message (e.g., "error-message").
     * @param {number} duration - How long to display the message (in milliseconds).
     */
    const showMessage = (message, messageType, duration = 3000) => {
      // Only remove other messages (not fun-fact ones)
      if (messageType !== "fun-fact-message") {
        document.querySelectorAll('.message').forEach(msg => msg.remove());
      }
    
      const messageBox = document.createElement("div");
    
      if (messageType === "fun-fact-message") {
        messageBox.classList.add("fun-fact-message");
      } else {
        messageBox.classList.add("message", messageType);
      }
    
      messageBox.innerHTML = message.toUpperCase();
      document.body.appendChild(messageBox);
    
      // Remove all messages after their specific duration
      setTimeout(() => {
        messageBox.remove();
      }, duration);
    };
    
    
    
    // Shortcut functions for different types of messages
    const showErrorMessage = (message) => showMessage(message, "error-message", 4000);
    const showNoticeMessage = (message) => showMessage(message, "notice-message", 15000);
    const showSolutionFoundMessage = (message) => showMessage(message, "solution-message", 4000);
    const showSuccessMessage = (message) => showMessage(message, "success-message", 4000);
    const showCubeAlreadySolvedMessage = (message) => showMessage(message, "already-solved-message", 4000);
    const showNoSolutionMessage = (message) => showMessage(message, "no-solution-message", 4000);
    const showGuidingArrowsMessage = (message) => showMessage(message, "guiding-arrows-message", 4000);
    const showRestartCubeMessage = (message) => showMessage(message, "restart-cube-message", 4000);
    const showScrambleMessage = (message) => showMessage(message, "scramble-cube-message", 7000);
    const showFunFactMessage = (message) => {
      // Remove any existing fun-fact message first
      document.querySelectorAll('.fun-fact-message').forEach(msg => msg.remove());
    
      showMessage(message, "fun-fact-message", 20000);
    };


    /**
     * Handles the "Guide Me" button click.
     * Starts the guided solving process step-by-step.
     */
    const handleGuideMe = () => {
      setIsLocked(false); // Stop loading

      if (!solutionSteps || solutionSteps.length === 0) {
      showNoSolutionMessage("No solution steps. Click 'Find Solution' first.");
      return;
      }
      // Start from the first move
      setGuideMode(true);
      setCurrentStepIndex(0);
      showManualStep(0);

      showGuidingArrowsMessage("Follow the guiding arrows to proceed!");
    };

    /**
     * Displays the next step in the solution guide.
     * Shows rotation arrows on the correct face or finishes if cube is solved.
     *
     * @param {number} index - The current step index in the solutionSteps array.
     */
    const showManualStep = (index) => {
      const layer = solutionSteps[index];
    // If it's some special marker like "Congratulations!"
    if (layer === "Congratulations!") {
      showSuccessMessage("Cube Solved!");
      setGuideMode(false);
      setSolutionSteps([]);
      // setCurrentStepIndex(0);
      return;
    }
  
    // Determine arrow direction
    let direction = 90;
    if (layer === "B" || layer === "L") {
      direction = -90;
    }
  
    // Display the arrow on the correct face
    showArrowsOnLayer(layer, direction);
  
    // Now we wait for the user to rotate manually...
    // The user will click "Next" or some UI button once they’ve done the move
  };

    /**
     * Called when the user finishes a manual rotation.
     * Proceeds to the next step in the solution and removes the current arrow.
     */
    const handleUserRotationDone = () => {
    // Remove the arrow from the current face
    const layer = solutionSteps[currentStepIndex];
    removeArrowsFromLayer(layer);
  
    // Move on to the next step
    const nextIndex = currentStepIndex + 1;
    setCurrentStepIndex(nextIndex);
    showManualStep(nextIndex);
  };
  
    /**
     * Displays a rotation arrow on the specified layer in the given direction.
     *
     * @param {string} layer - The cube layer (e.g., "U", "F", "L", etc.)
     * @param {number} direction - Rotation direction: 90 for CW, -90 for CCW
     */
    const showArrowsOnLayer = (layer, direction) => {
    setTimeout(() => {
      // Grab all .cubie-face elements whose data-face matches
      const faceElements = document.querySelectorAll(`.cubie-face[data-face="${layer}"]`);
  
      faceElements.forEach((face) => {
        // Create the arrow element
        const arrow = document.createElement("div");
        arrow.classList.add("rotation-arrow");
  
        if (layer === "U") {
          arrow.innerHTML = direction < 0 ? "↻" : "↺";
        } else {
          arrow.innerHTML = direction > 0 ? "↻" : "↺";
        }
  
        // Append the arrow to the face
        face.appendChild(arrow);
      });
    }, 200); // Delay of 200ms; adjust as needed
  };
      
    /**
     * Removes any visual arrows from all cubies belonging to the given layer.
     *
     * @param {string} layer - The face layer to clear (e.g., "U", "D", etc.)
     */
    const removeArrowsFromLayer = (layer) => {
    const faceElements = document.querySelectorAll(`.cubie-face[data-face="${layer}"]`);

    faceElements.forEach((face) => {
      const arrow = face.querySelector(".rotation-arrow");
      if (arrow) arrow.remove();
    });
  };

    /**
     * Resets the cube state to the solved position and clears all visual elements and steps.
     */
    const handleReset = () => {
    const solvedCubeString = "BBBBGGGGOOOORRRRWWWWYYYY";
    reorientCubeFromString(solvedCubeString, setCubeState);
    setCubeState(initialCubeState);
    setIsLocked(false)
    setIsLoading(false)
    setSolutionSteps([]);
    setIsScrambling(false);
    setCurrentStepIndex(0);
    setGuideMode(false);
    const layers = ["U", "D", "L", "R", "F", "B"];
    for (const layer of layers) {
      removeArrowsFromLayer(layer);
    }
    
    showRestartCubeMessage("Restart cube state");
  };



  
    const handleFunFact = async () => {
      try {
        const res = await fetch(`${API_BASE_BACKEND_URL}/fun-fact`);
        const data = await res.json();
    
        if (data.fact) {
          showFunFactMessage(data.fact);
        } else if (data.error) {
          if (data.error.includes("quota") || data.error.includes("exceeded")) {
            showNoticeMessage("The AI is getting a little overwhelmed. Try again later!");
          } else {
            showNoticeMessage("🤫 Shh… Gemini’s sleeping 💤—click again in a sec! ⏱️");
          }
        } else {
          showErrorMessage("Unexpected response from Backend.");
        }
      } catch (err) {
        showErrorMessage("Failed to fetch fun fact.");
        console.error(err);
      }
    };
    



    // Renders all cubies (each small cube) in the cubeState
    const renderCubies = () =>
    cubeState.map((cubie) => {
      const { id, position, colors } = cubie;
      const [cx, cy, cz] = position;
  
      return (
        <div
          key={id}
          className="cubie"
          data-x={cx}
          data-y={cy}
          data-z={cz}
          style={{
            position: "absolute",
            width: "88px",
            height: "88px",
            transform: `translate3d(${cx * 45}px, ${-cy * 45}px, ${cz * 45}px)`,
            transformStyle: "preserve-3d",
          }}
        >
          {/* Render each visible face of the cubie */}
          {Object.entries(colors).map(([face, color]) => (
            <div
              key={face}
              className="cubie-face"
              data-face={face}
              style={{
                position: "absolute",
                width: "80px",
                height: "80px",
                border: "8px solid black",
                backgroundColor: color,
                transform: getFaceTransform(face),
              }}
            />
          ))}
        </div>
      );
    });
  
    // Determines the correct 3D transform for each face based on its direction
    const getFaceTransform = (face) => {
    switch (face) {
      case "U":
        return "rotateX(90deg) translateZ(45px)";
      case "D":
        return "rotateX(-90deg) translateZ(45px)";
      case "F":
        return "translateZ(45px)";
      case "B":
        return "rotateY(180deg) translateZ(45px)";
      case "L":
        return "rotateY(-90deg) translateZ(45px)";
      case "R":
        return "rotateY(90deg) translateZ(45px)";
      default:
        return "";
    }
  };
  
    // Maps hex color values (used in color picker) to color names used in cube logic
    const colorDict = {
    "#ffffff": "white",
    "#ffff00": "yellow",
    "#0000ff": "blue",
    "#006400": "green",
    "#ff0000": "red",
    "#ffa500": "orange",
  };


// Expose a helper to set the cube state externally (used in tests)
useEffect(() => {
  window.setCubeStateFromTest = (flatStateString) => {
    reorientCubeFromString(flatStateString, setCubeState);
  };
}, []);

// Expose a helper to set solution steps externally (used in tests)
useEffect(() => {
  window.setSolutionStepsFromTest = (steps) => {
    setSolutionSteps(steps);
  };
}, []);

// Expose helpers for tests: set steps and trigger a manual rotation step
useEffect(() => {
  window.setSolutionStepsFromTest = (steps) => setSolutionSteps(steps);
  window.handleUserRotationDone = () => handleUserRotationDone();
}, [solutionSteps, currentStepIndex]);

  
  
    // Render the full Cube component UI:
    // Includes buttons, 3D cube or manual color grid, and user interaction handlers.
    return (
      <div>
        {isLoading && (
          <div className="spinner-overlay">
            <div className="spinner"></div>
            <p className="spinner-text">Hang tight! We're solving your cube — meanwhile, why not check a Gemini Insight?</p>

          </div>
        )}
    
        {/* --- BUTTONS PANEL --- */}
        <div className="button-container">
          <button className="scramble" onClick={handleScramble} disabled={isScrambling || guideMode || isLoading || isLocked}>Scramble</button>
          <button className="find-solution" onClick={handleFindSolution} disabled={guideMode || isScrambling || isLocked || isLoading}>Solve</button>
          <button className="guide-me" onClick={handleGuideMe} disabled={guideMode || isScrambling || isLoading}>Guide Me</button>
          <button className="reset" onClick={handleReset} disabled={cubeState === initialCubeState || isScrambling || isLoading}>Reset</button>
          <button className="manual-color" onClick={() => setManualColorMode((prev) => !prev)} disabled={guideMode || isLoading || isLocked}>
            {manualColorMode ? "Back to 3D Cube" : "Manual Color Pick"}
          </button>
          <button className="fun-fact" onClick={handleFunFact}>Gemini Insight 🔮</button>
        </div>
    
        {/* --- CUBE VIEW --- */}
        {manualColorMode ? (
          <UnfoldedCube
            cubeState={cubeState}
            onChangeColor={(cubieId, face, newColor) => {
              setCubeState((prev) =>
                prev.map((cubie) =>
                  cubie.id === cubieId
                    ? { ...cubie, colors: { ...cubie.colors, [face]: colorDict[newColor] } }
                    : cubie
                )
              );
            }}
          />
        ) : (
          <div
          
            className="cube-container"
            onMouseDown={(e) => handleMouseDown(e, setSelectedLayer, setDragStart, setIsDragging)}
            onMouseMove={(e) =>
              handleMouseMove(e, {
                isDragging,
                dragStart,
                setRotation,
                setDragStart,
                selectedLayer,
                setSelectedLayer,
                handleRotateLayer,
                cubeState,
                guideMode,
                solutionSteps,
                currentStepIndex,
                handleUserRotationDone,
              })
            }
            onMouseUp={() => handleMouseUp(setIsDragging, setSelectedLayer)}
            onMouseLeave={() => handleMouseLeave(setIsDragging, setSelectedLayer)}
          >
            {(isLoading ||isLocked || isScrambling) && <div className="cube-lock-overlay"></div>}
            <div
              className="cube"
              draggable="false"
              style={{
                transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
              }}
            >
              {renderCubies()}
            </div>
          </div>
        )}
      </div>
    );    
}

// Export the main Cube component
export default Cube;

  