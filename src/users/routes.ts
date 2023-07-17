import { Router, Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';

import { User, Login } from './interfaces';
import prisma from '../prisma';

const router = Router();

router.post('/new', async (req: Request, res: Response) => {
	let data: User = req.body;

	try {
		data.password = await bcrypt.hash(data.password, 10);

		const user: User | null = await prisma.users.create({
			data,
		});

		if (!user) {
			return res.sendStatus(404);
		}

		console.log(user);
	} catch (err) {
		console.log(err);

		if (err instanceof Prisma.PrismaClientKnownRequestError) {
			if (err.code === 'P2002') {
				return res.status(400).json({ error: 'user exists' });
			}
		}

		return res.sendStatus(400);
	}

	return res.sendStatus(200);
});

router.post('/login', async (req: Request, res: Response) => {
	const { email, password }: Login = req.body;

	if (!email || !password) {
		return res.sendStatus(400);
	}

	try {
		const user: User | null = await prisma.users.findUnique({
			where: { email },
		});

		if (!user) {
			return res.sendStatus(404);
		}

		console.log(user);

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

router.post('/update', (req: Request, res: Response) => {
	//TODO
	return res.sendStatus(200);
});

router.post('/delete', (req: Request, res: Response) => {
	const { email } = req.body;

	prisma.users
		.delete({ where: { email } })
		.then(() => res.sendStatus(200))
		.catch((err) => res.status(500).json(err));
});

router.get('/get', async (req: Request, res: Response) => {
	const users: User[] | null = await prisma.users.findMany();

	return res.status(200).json(users);
});

export default router;
