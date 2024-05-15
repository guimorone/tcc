import { useEffect, type FC } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Details from './Details';
import Table from './Table';
import { checkIfObjectIsEmpty, showWarningToast } from '../../utils';
import { useTypedOutletContext } from '../../utils/hooks';

const History: FC = () => {
	const { id: paramId } = useParams();
	const { state } = useLocation();
	const { history, setHistory } = useTypedOutletContext();
	const id: string = paramId || state?.id;

	useEffect(() => {
		if (checkIfObjectIsEmpty(history)) return;

		if (id && !history[id]) showWarningToast('Invalid history id');
	}, [history, id]);

	if (checkIfObjectIsEmpty(history))
		return (
			<div className="sm:flex-auto space-y-2">
				<h1 className="text-base font-semibold leading-6 text-gray-900">No records</h1>
				<p className="text-sm text-gray-700">Nothing to see here yet...</p>
			</div>
		);

	return (
		<>
			{id && history[id] ? (
				<Details id={id} details={history[id]} />
			) : (
				<Table history={history} setHistory={setHistory} />
			)}
		</>
	);
};

export default History;
