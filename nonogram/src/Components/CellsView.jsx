import { Board } from "../../../src/Board";
import { Rect } from "react-konva";

const COLOR_FILLED = "#333";
const COLOR_EMPTY = "transparent";

const PADDING = 0.5;
const STROKE_WIDTH = 1;

/**
 * @param {{
 * 		board: Board;
 * 		cells: { id: string; x: number; y: number; filled: boolean; }[];
 * 		top: number;
 * 		left: number;
 * 		cellSize: number;
 * 		isDragging: boolean;
 * 		currentState: 'fill' | 'clear' | null;
 * 		onMouseDown: (event: KonvaEventObject<MouseEvent>) => void;
 * 		setBoardData: (boardData: string) => void;
 * }} param
 */
export function CellsView({
  board,
  cells,
  top,
  left,
  cellSize,
  isDragging,
  currentState,
  onMouseDown: onParentMouseDown,
  setBoardData,
}) {
  const onMouseDown = (event) => {
    const cell = cells.find((cell) => cell.id === event.target.attrs.id);
    if (cell) {
      cell.filled ? board.clear(cell.x, cell.y) : board.fill(cell.x, cell.y);
      onParentMouseDown(cell.filled ? "clear" : "fill");
      setBoardData(board.serialize());
    }
  };

  const onMouseOver = (event) => {
    if (!isDragging || currentState == null) return;

    const cell = cells.find((cell) => cell.id === event.target.attrs.id);
    if (cell) {
      currentState === "fill"
        ? board.fill(cell.x, cell.y)
        : board.clear(cell.x, cell.y);
      setBoardData(board.serialize());
    }
  };

  return (
    <>
      {cells.map(({ id, x, y, filled }) => (
        <Rect
          key={id}
          id={id}
          x={left + x * cellSize + PADDING}
          y={top + y * cellSize + PADDING}
          width={cellSize - PADDING - STROKE_WIDTH}
          height={cellSize - PADDING - STROKE_WIDTH}
          fill={filled ? COLOR_FILLED : COLOR_EMPTY}
          strokeEnabled={false}
          onMouseDown={onMouseDown}
          onMouseOver={onMouseOver}
        />
      ))}
    </>
  );
}
