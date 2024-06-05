import ImageProcesser from './ImageProcesser';
import DumpProcesser from './DumpProcesser';
import type { FC } from 'react';

const Home: FC = () => {
	const modules = [
		{
			title: 'Image Processing',
			name: 'ImageProcesser',
			Component: ImageProcesser,
		},
		{
			title: 'Dump Processing',
			name: 'DumpProcesser',
			Component: DumpProcesser,
		},
	];

	return (
		<div className="space-y-8">
			{modules.map(({ title, name, Component }, index) => (
				<div key={`module-${name}-${index}`} className="space-y-2">
					<h2 className="text-gray-700 text-xl md:text-2xl font-semibold">{title}</h2>
					<div className="flex flex-col gap-y-8 items-center justify-center text-center">
						<Component />
					</div>
				</div>
			))}
		</div>
	);
};

export default Home;
