import { Router, Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import isEmail from 'validator/lib/isEmail';

import { User } from './interfaces';
import prisma from '../prisma';

const router = Router();

const isUser = (obj: any): obj is Omit<User, 'id'> => {
	return (
		'email' in obj &&
		'name' in obj &&
		'surname' in obj &&
		'password' in obj &&
		'phone' in obj &&
		'isAdmin' in obj
	);
};

router.post('/new', async (req: Request, res: Response) => {
	const body: Omit<User, 'id'> = req.body;

	if (!isUser(body)) {
		return res.status(400).json({ error: 'wrong data' });
	}

	if (!isEmail(body.email)) {
		return res.status(400).json({ error: 'email is wrong' });
	}

	const id = uuidv4();

	const data: User = { id, ...body };

	try {
		data.password = await bcrypt.hash(data.password, 10);

		const user: User = await prisma.user.create({ data });
		console.log(user);

		return res.sendStatus(200);
	} catch (err) {
		console.log(err);

		if (err instanceof Prisma.PrismaClientKnownRequestError) {
			if (err.code === 'P2002') {
				return res.status(400).json({ error: 'user exists' });
			}
		}

		return res.sendStatus(400);
	}
});

router.post('/login', async (req: Request, res: Response) => {
	const { email, password }: { email: string; password: string } = req.body;

	if (!email || !password) {
		return res.sendStatus(400);
	}

	try {
		const user: User | null = await prisma.user.findUnique({ where: { email } });

		if (!user) {
			return res.sendStatus(404);
		}

		const result = await bcrypt.compare(password, user.password);

		if (result) {
			return res.status(200).json(user);
		}

		return res.status(400).json({ error: 'wrong password' });
	} catch (err) {
		console.error(err);
		return res.status(500);
	}
});

router.post('/update', async (req: Request, res: Response) => {
	const data: User = req.body;

	if (!isUser(data)) {
		return res.status(400).json({ error: 'wrong data' });
	}

	try {
		const updateUser = await prisma.user.update({
			where: { email: data.email },
			data,
		});

		console.log(updateUser);

		return res.sendStatus(200);
	} catch (err) {
		console.log(err);
		return res.sendStatus(400);
	}
});

router.post('/delete', (req: Request, res: Response) => {
	const { email } = req.body;

	if (!email) {
		return res.status(400).json({ error: 'no email' });
	}

	prisma.user
		.delete({ where: { email } })
		.then(() => res.sendStatus(200))
		.catch((err) => res.status(500).json(err));
});

router.get('/get', async (req: Request, res: Response) => {
	const users: User[] | null = await prisma.user.findMany();

	return res.status(200).json(users);
});

export default router;
