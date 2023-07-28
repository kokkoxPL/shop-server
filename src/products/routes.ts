import { Router, Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

import { Product } from './interface';
import prisma from '../prisma';

const router = Router();

router.post('/new', async (req: Request, res: Response) => {
	const body: Omit<Product, 'id'> = req.body;

	const id = uuidv4();

	const data: Product = { id, ...body };

	try {
		await prisma.product.create({ data });
	} catch (err) {
		console.log(err);

		if (err instanceof Prisma.PrismaClientKnownRequestError) {
			if (err.code === 'P2002') {
				return res.status(400).json({ error: 'product exists' });
			}
		}
		return res.sendStatus(400);
	}

	return res.status(200).json({ data });
});

router.get('/get', async (req: Request, res: Response) => {
	const products = await prisma.product.findMany();

	if (!products) {
		return res.status(400).json({ error: 'no users' });
	}

	return res.status(200).json(products);
});

router.get('/get/:id', async (req: Request, res: Response) => {
	const id: string = req.params.id;

	if (!id) {
		return res.status(400).json({ error: 'wrong id' });
	}

	const product: Product | null = await prisma.product.findUnique({
		where: { id },
	});

	if (!product) {
		return res.status(400).json({ error: 'no product' });
	}

	return res.status(200).json(product);
});

export default router;
