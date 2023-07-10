import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

import { User } from './interfaces';

const router = Router();

router.post('/new', async (req: Request, res: Response) => {
	const user: User = req.body;

	const prisma = new PrismaClient();

	try {
		await prisma.users.create({
			data: user,
		});
	} catch {
		return res.sendStatus(400);
	}

	return res.sendStatus(200);
});

router.get('/get', async (req, res) => {
	const prisma = new PrismaClient();

	const users = await prisma.users.findMany();

	if (!users) {
		return res.status(400).send({ error: 'no users' });
	}

	return res.status(200).send(users);
});

router.get('/get/:id', async (req: Request, res: Response) => {
	const prisma = new PrismaClient();

	//magic shit
	const id = ~~req.params.id >>> 0;

	if (!id) {
		return res.status(400).send({ error: 'wrong id' });
	}

	const user = await prisma.users.findUnique({
		where: { id },
	});

	if (!user) {
		return res.status(400).send({ error: 'no user' });
	}

	return res.status(200).send(user);
});

export default router;
