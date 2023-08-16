import { Router, Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

import { Product } from './interface';
import prisma from '../prisma';

const router = Router();

const isProduct = (obj: any): obj is Product => {
	return 'id' in obj && 'title' in obj && 'price' in obj && 'img' in obj && 'colors' in obj;
};

router.get('/get', async (req: Request, res: Response) => {
	const products = await prisma.product.findMany();

	if (products.length === 0) {
		return res.status(400).json({ error: 'no products' });
	}

	return res.status(200).json(products);
});

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

router.post('/update', async (req: Request, res: Response) => {
	const data: Product = req.body;

	if (!isProduct(data)) {
		return res.status(400).json({ error: 'wrong data' });
	}

	try {
		const updateUser = await prisma.user.update({
			where: { id: data.id },
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
	const { id } = req.body;

	if (!id) {
		return res.status(400).json({ error: 'no id' });
	}

	prisma.user
		.delete({ where: { id } })
		.then(() => res.sendStatus(200))
		.catch((err) => res.status(500).json(err));
});

export default router;
