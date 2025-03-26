const colorOptions = [
  { name: "White", hex: "#ffffff" },
  { name: "Yellow", hex: "#ffff00" },
  { name: "Blue", hex: "#0000ff" },
  { name: "Green", hex: "#006400" },
  { name: "Red", hex: "#ff0000" },
  { name: "Orange", hex: "#ffa500" },
];

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

  // Apply custom sort if provided, otherwise fallback to default
  if (sortFunction) {
    faceStickers.sort(sortFunction);
  } else {
    faceStickers.sort((a, b) => a.id.localeCompare(b.id));
  }

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

// If storing hex codes in state, make sure we can handle them
function colorToHex(color) {
  if (color.startsWith("#")) return color;
  const map = {
    white: "#ffffff",
    yellow: "#ffff00",
    blue: "#0000ff",
    green: "#006400",
    red: "#ff0000",
    orange: "#ffa500",
  };
  return map[color.toLowerCase()] || "#000000";
}
