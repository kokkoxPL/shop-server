interface User {
	name: string;
	surname: string;
	email: string;
	password: string;
	phone: number;
	admin: boolean;
}

interface Login {
	email: string;
	password: string;
}

export type { User, Login };
