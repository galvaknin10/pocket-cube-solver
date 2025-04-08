// List of selectable colors with readable names
const colorOptions = [
  { name: "White", hex: "#ffffff" },
  { name: "Yellow", hex: "#ffff00" },
  { name: "Blue", hex: "#0000ff" },
  { name: "Green", hex: "#006400" },
  { name: "Red", hex: "#ff0000" },
  { name: "Orange", hex: "#ffa500" },
];

// Grid for one cube face with interactive color pickers
export default function FaceGrid({
  face,
  cubeState,
  onChangeColor,
  openSticker,
  onOpenSticker,
  sortFunction,
}) {
  // Filter stickers for this face
  const faceStickers = cubeState.filter((cubie) => cubie.colors[face]);

   // Sort stickers by a provided function
  faceStickers.sort(sortFunction);

  const handleStickerClick = (cubieId) => {
    // Let parent manage which sticker is open
    onOpenSticker(face, cubieId);
  };

  const handleColorPick = (cubieId, newHexColor) => {
    // Update the color
    onChangeColor(cubieId, face, newHexColor);
    // Also close the picker
    onOpenSticker(null, null);
  };

  return (
    <div className="face-grid">
      {faceStickers.map((cubie) => {
        const isOpen =
          openSticker.face === face && openSticker.cubieId === cubie.id;
        const currentColor = cubie.colors[face]; // might be "green" or "#006400"

        return (
          <div
            key={cubie.id}
            className="sticker"
            style={{
              backgroundColor: colorToHex(currentColor),
              position: "relative",
              cursor: "pointer",
            }}
            onClick={() => handleStickerClick(cubie.id)}
          >
            {isOpen && (
              <div
                className="color-menu"
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  backgroundColor: "#fff",
                  padding: "5px",
                  display: "flex",
                  gap: "5px",
                  zIndex: 999,
                }}
              >
                {colorOptions.map((opt) => (
                  <div
                    key={opt.hex}
                    style={{
                      width: "20px",
                      height: "20px",
                      backgroundColor: opt.hex,
                      border: "5px solid #ccc",
                    }}
                    title={opt.name}
                    onClick={(e) => {
                      e.stopPropagation(); // Don’t trigger sticker click again
                      handleColorPick(cubie.id, opt.hex);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// Normalize color names to hex codes
function colorToHex(color) {
  if (color.startsWith("#")) return color;
  const map = {
    white: "#ffffff",
    yellow: "#ffea00",
    blue: "#0000ff",
    green: "#006400",
    red: "#ff0000",
    orange: "#ffa500",
  };
  return map[color.toLowerCase()] || "#000000";
}
