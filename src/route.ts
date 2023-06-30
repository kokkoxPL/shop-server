import { Router, Request, Response } from "express";

const router = Router();

router.post("/hello", (req: Request, res: Response) => {
	return res.json({ hello: "world" });
});

export default router;
