import { Group } from 'react-konva';
import { RowClueView } from './RowClueView';

/**
 * @param {{
 *  clues: number[][];
 *  cluesCompletions: boolean[] | null;
 *  fontSize: number;
 *  top: number;
 *  left: number;
 *  cellSize: number;
 *  cluesWidth: number;
 * }} props
 * @returns {JSX.Element}
 */
export function RowCluesView( {
	clues,
	cluesCompletions,
	fontSize,
	top,
	left,
	cellSize,
	cluesWidth,
} ) {
	return (
		<Group>
			{ clues.map( ( clue, index ) => (
				<RowClueView
					key={ index }
					clue={ clue }
					completion={ cluesCompletions && cluesCompletions[ index ] }
					fontSize={ fontSize }
					top={ top + cellSize * index }
					right={ left + cluesWidth }
					width={ cluesWidth }
					height={ cellSize }
				/>
			) ) }
		</Group>
	);
}
