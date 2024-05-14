import { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Details from './Details';
import Table from './Table';
import { getLocalStorageItem, showWarningToast } from '../../utils';
import type { FC } from 'react';
import type { HistoryType } from '../../@types';

const History: FC = () => {
	const { id: paramId } = useParams();
	const { state } = useLocation();
	const history: HistoryType | null = getLocalStorageItem('history');
	const id: string = paramId || state?.id;

	useEffect(() => {
		if (!history) return;

		if (id && !history[id]) showWarningToast('Invalid history id');
	}, [history, id]);

	if (!history) return <h3 className="text-lg text-gray-900">Nothing to see here yet...</h3>;

	return <>{id && history[id] ? <Details id={id} details={history[id]} /> : <Table history={history} />}</>;
};

export default History;
