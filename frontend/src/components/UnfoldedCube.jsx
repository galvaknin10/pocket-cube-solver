import { useState } from "react";
import FaceGrid from "./FaceGrid";

export default function UnfoldedCube({ cubeState, onChangeColor }) {
  // One single state to track which sticker is open (face + cubieId)
  const [openSticker, setOpenSticker] = useState({ face: null, cubieId: null });

  // Toggle or close the menu for a given face/cubie
  const handleOpenSticker = (face, cubieId) => {
    if (openSticker.face === face && openSticker.cubieId === cubieId) {
      // If we click the same sticker, close it
      setOpenSticker({ face: null, cubieId: null });
    } else {
      // Otherwise, open the new one
      setOpenSticker({ face, cubieId });
    }
  };

  return (
    <div className="unfolded-cube">
      {/* U face */}
      <div className="face face-U">
        <FaceGrid
          face="U"
          cubeState={cubeState}
          onChangeColor={onChangeColor}
          openSticker={openSticker}
          onOpenSticker={handleOpenSticker}
          sortFunction={(a, b) => {
            const positionOrderL = {
                "1,1,1": 1,
                "-1,1,1": 2,
                "1,1,-1": 1,
                "-1,1,-1": 2,
            };
            return positionOrderL[a.position.join(",")] - positionOrderL[b.position.join(",")];
            }}
          
        />
      </div>

      {/* L face */}
      <div className="face face-L">
        <FaceGrid
          face="L"
          cubeState={cubeState}
          onChangeColor={onChangeColor}
          openSticker={openSticker}
          onOpenSticker={handleOpenSticker}
          sortFunction={(a, b) => {
            const positionOrderL = {
                "-1,1,1": 2,
                "-1,1,-1": 1,
                "-1,-1,1": 1,
                "-1,-1,-1": 0,
            };
            return positionOrderL[a.position.join(",")] - positionOrderL[b.position.join(",")];
            }}
        />
      </div>

      {/* F face */}
      <div className="face face-F">
        <FaceGrid
          face="F"
          cubeState={cubeState}
          onChangeColor={onChangeColor}
          openSticker={openSticker}
          onOpenSticker={handleOpenSticker}
          sortFunction={(a, b) => {
            const positionOrderL = {
                "-1,1,1": 2,
                "-1,1,-1": 1,
                "-1,-1,1": 1,
                "-1,-1,-1": 0,
            };
            return positionOrderL[a.position.join(",")] - positionOrderL[b.position.join(",")];
            }}
        />
      </div>

      {/* R face */}
      <div className="face face-R">
        <FaceGrid
          face="R"
          cubeState={cubeState}
          onChangeColor={onChangeColor}
          openSticker={openSticker}
          onOpenSticker={handleOpenSticker}
          sortFunction={(a, b) => {
            const positionOrderL = {
                "1,1,1": 3,
                "1,-1,1": 3,
                "1,1,-1": 1,
                "1,-1,-1": 2,
            };
            return positionOrderL[a.position.join(",")] - positionOrderL[b.position.join(",")];
            }}
        />
      </div>

      {/* B face */}
      <div className="face face-B">
        <FaceGrid
          face="B"
          cubeState={cubeState}
          onChangeColor={onChangeColor}
          openSticker={openSticker}
          onOpenSticker={handleOpenSticker}
        />
      </div>

      {/* D face */}
      <div className="face face-D">
        <FaceGrid
          face="D"
          cubeState={cubeState}
          onChangeColor={onChangeColor}
          openSticker={openSticker}
          onOpenSticker={handleOpenSticker}
        />
      </div>
    </div>
  );
}

