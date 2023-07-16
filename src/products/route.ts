import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

import { Product } from './interface';

const router = Router();

router.post('/new', async (req: Request, res: Response) => {
	const product: Product = req.body;

	const prisma = new PrismaClient();

	try {
		await prisma.products.create({
			data: product,
		});
	} catch {
		return res.sendStatus(400);
	}

	return res.sendStatus(200);
});

router.get('/get/:id', async (req: Request, res: Response) => {
	const prisma = new PrismaClient();

	//magic shit
	const id = ~~req.params.id >>> 0;

	if (!id) {
		return res.status(400).send({ error: 'wrong id' });
	}

	const product = await prisma.products.findUnique({
		where: { id },
	});

	if (!product) {
		return res.status(400).send({ error: 'no user' });
	}

	return res.status(200).send(product);
});

export default router;
