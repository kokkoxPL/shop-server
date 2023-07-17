import { Router, Request, Response } from 'express';

import { Product } from './interface';
import prisma from '../prisma';

const router = Router();

router.post('/new', async (req: Request, res: Response) => {
	const product: Product = req.body;

	try {
		await prisma.products.create({
			data: product,
		});
	} catch {
		return res.sendStatus(400);
	}

	return res.sendStatus(200);
});

router.get('/get', async (req: Request, res: Response) => {
	const products = await prisma.products.findMany();

	if (!products) {
		return res.status(400).json({ error: 'no users' });
	}

	return res.status(200).json(products);
});

router.get('/get/:id', async (req: Request, res: Response) => {
	//magic shit
	const id = ~~req.params.id >>> 0;

	if (!id) {
		return res.status(400).json({ error: 'wrong id' });
	}

	const product = await prisma.products.findUnique({
		where: { id },
	});

	if (!product) {
		return res.status(400).json({ error: 'no product' });
	}

	return res.status(200).json(product);
});

export default router;
