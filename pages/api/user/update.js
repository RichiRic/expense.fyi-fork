import { withUserAuth } from 'lib/auth';
import prisma from 'lib/prisma';

export default withUserAuth(async (req, res, user) => {
	if (req.method === 'PATCH') {
		const { currency, locale, email_reports } = req.body;

		const data = {};

		if (currency !== undefined && locale !== undefined) {
			data.currency = currency;
			data.locale = locale;
		}

		if (email_reports !== undefined) {
			data.email_reports = email_reports;
		}

		try {
			await prisma.users.update({ data, where: { id: user.id } });
			res.status(200).json({ message: 'Updated' });
		} catch (error) {
			res.status(500).json({ error, message: 'Failed to updated, please try again.' });
		}
	} else {
		res.setHeader('Allow', ['PATCH']);
		return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
	}
});
