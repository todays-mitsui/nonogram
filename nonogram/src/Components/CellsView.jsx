import { useCallback } from "@wordpress/element";
import { Board } from "../../../src/Board";
import { Cell } from "./Cell";

/**
 * @param {{
 *  board: Board;
 *  cells: { id: string; x: number; y: number; status: 'unknown' | 'space' | 'filled'; }[];
 *  top: number;
 *  left: number;
 *  cellSize: number;
 *  nextStatus: 'unknown' | 'space' | 'filled' | null;
 *  enableSpaceStatus: boolean;
 *  setNextStatus: (nextStatus: string | null) => void;
 *  setBoardData: (boardData: string) => void;
 * }} param
 */
export function CellsView({
  board,
  cells,
  top,
  left,
  cellSize,
  nextStatus,
  enableSpaceStatus,
  setNextStatus,
  setBoardData,
}) {
  const decideNextStatus = useCallback((event, prevStatus) => {
    return enableSpaceStatus
      ? decideNextStatusWithSpaceStatusAndRightClick(event, prevStatus)
      : decideNextStatusWithoutSpaceStatus(prevStatus);
  }, [enableSpaceStatus]);

  const onMouseDown = (event) => {
    const cell = cells.find((cell) => cell.id === event.target.attrs.id);
    if (cell) {
      const prevStatus = cell.status;
      const nextStatus = decideNextStatus(event, prevStatus);
      board.changeStatus(cell.x, cell.y, nextStatus);
      setBoardData(board.serialize());
      setNextStatus(nextStatus);
    }
  };

  const onMouseOver = (event) => {
    if (event.evt.buttons === 0) {
      setNextStatus(null);
      return;
    }

    if (nextStatus == null) return;

    const cell = cells.find((cell) => cell.id === event.target.attrs.id);
    if (cell) {
      board.changeStatus(cell.x, cell.y, nextStatus);
      setBoardData(board.serialize());
    }
  };

  return (
    <>
      {cells.map(({ id, x, y, status }) => (
        <Cell
          key={id}
          id={id}
          top={top + y * cellSize}
          left={left + x * cellSize}
          cellSize={cellSize}
          status={status}
          enableSpaceStatus={enableSpaceStatus}
          onMouseDown={onMouseDown}
          onMouseOver={onMouseOver}
        />
      ))}
    </>
  );
}

function decideNextStatusWithSpaceStatus(prevStatus) {
  switch (true) {
    case prevStatus === "filled":
      return "space";
    case prevStatus === "space":
      return "unknown";
    case prevStatus === "unknown":
      return "filled";
    default:
      throw new Error("Invalid status");
  }
}

function decideNextStatusWithSpaceStatusAndRightClick(event, prevStatus) {
  const isRightClick = event.evt.button === 2 ||
    event.evt.altKey ||
    event.evt.ctrlKey ||
    event.evt.shiftKey;

  switch (true) {
    case prevStatus === "filled" && !isRightClick:
      return "unknown";
    case prevStatus === "filled" && isRightClick:
      return "space";
    case prevStatus === "space" && !isRightClick:
      return "filled";
    case prevStatus === "space" && isRightClick:
      return "unknown";
    case prevStatus === "unknown" && !isRightClick:
      return "filled";
    case prevStatus === "unknown" && isRightClick:
      return "space";
    default:
      throw new Error("Invalid status");
  }
}

function decideNextStatusWithoutSpaceStatus(prevStatus) {
  switch (true) {
    case prevStatus === "filled":
      return "space";
    case prevStatus === "space" || prevStatus === "unknown":
      return "filled";
    default:
      throw new Error("Invalid status");
  }
}
