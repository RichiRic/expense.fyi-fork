import { useState } from 'react';

import { Switch } from '@headlessui/react';

import { showErrorToast, showSuccessToast } from 'components/Toast';

import { formatCurrency } from 'utils/formatter';

import data from 'data/currency.json';

export default function General({ user }) {
	const [currencyData, setCurrencyData] = useState({ currency: user.currency, locale: user.locale });
	const [emailReport, setEmailReport] = useState(user.email_reports);

	const onChange = async (toggle) => {
		setEmailReport(toggle);
		try {
			const res = await fetch('/api/user/update', {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email_reports: toggle }),
			});

			if (!res.ok) {
				const error = await res.json();
				throw new Error(error.message || res.statusText);
			}

			if (toggle) {
				showSuccessToast('Email based insights are turned on.', 3000);
			} else {
				showSuccessToast('Email based insights are turned off.', 3000);
			}
		} catch (error) {
			showErrorToast(error.message);
			setEmailReport(false);
		}
	};

	const onUpdate = async (data) => {
		const { currency, locale } = data;
		try {
			const res = await fetch('/api/user/update', {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ currency, locale }),
			});

			if (!res.ok) {
				const error = await res.json();
				throw new Error(error.message || res.statusText);
			}

			showSuccessToast('Currency is updated!');
			setCurrencyData(data);
		} catch (error) {
			showErrorToast(error.message);
		}
	};

	return (
		<div className="mt-4 mb-8 w-full max-w-2xl rounded-lg bg-white p-3 text-left shadow shadow-gray-200 md:mt-0">
			<h3 className="p-3 py-3 text-xl font-extrabold leading-6 text-black">Account</h3>
			<div className="grid gap-6 p-3 sm:grid-cols-2">
				<label className="block">
					<span className="block text-sm font-medium text-zinc-600">Email</span>
					<div className="flex flex-col sm:flex-row">
						<input
							className="mt-2 block h-10 w-full appearance-none rounded-md bg-white px-3 text-sm text-black shadow-sm ring-1 ring-gray-300 focus:outline-none  disabled:cursor-not-allowed disabled:bg-slate-50 disabled:shadow-none"
							type="email"
							defaultValue={user.email}
							disabled
						/>
					</div>
				</label>
				<label className="block">
					<span className="block text-sm font-medium text-zinc-600">Currency</span>
					<div className="flex flex-col sm:flex-row">
						<select
							name="currency"
							className="mt-2 block h-10 w-full appearance-none rounded-md bg-white py-2 px-3 pr-8 text-sm text-black shadow-sm ring-1 ring-gray-300 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-gray-900 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:shadow-none"
							onChange={(event) => {
								const [currency, locale] = event.target.value.split('-');
								onUpdate({ currency, locale });
							}}
							value={`${currencyData.currency}-${currencyData.locale}`}
						>
							{Object.keys(data).map((key) => {
								const { languages = [], currency } = data[key];
								const [currencyCode] = currency;

								return languages.map((language) => (
									<option key={language} value={`${currencyCode}-${language}`}>
										{data[key].name} - {language}
									</option>
								));
							})}
						</select>
					</div>
					<span className="mt-[8px] inline-block text-sm">
						Eg:{' '}
						<span className="font-medium text-orange-600">
							{formatCurrency(100, currencyData.currency, currencyData.locale)}
						</span>
					</span>
				</label>
			</div>
			{user.isPremiumPlan && !user.isPremiumPlanEnded ? (
				<>
					<h4 className="flex p-3 py-3 pb-0 text-lg font-extrabold leading-6 text-black">Reports</h4>
					<div className="grid gap-6 p-3 sm:grid-cols-1">
						<label className="block">
							<div className="flex items-center justify-between text-sm text-black">
								<p className="max-w-[280px] xs:max-w-full">
									Get email insights on your monthly spendings on last working day.
								</p>
								<Switch
									checked={emailReport}
									onChange={onChange}
									className={`${emailReport ? 'bg-green-600' : 'bg-gray-400'}
          relative inline-flex h-[21px] w-[38px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
								>
									<span className="sr-only">Email report</span>
									<span
										aria-hidden="true"
										className={`${emailReport ? 'translate-x-4' : 'translate-x-0'}
            pointer-events-none inline-block h-[17px] w-[17px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
									/>
								</Switch>
							</div>
						</label>
					</div>
				</>
			) : null}
		</div>
	);
}
