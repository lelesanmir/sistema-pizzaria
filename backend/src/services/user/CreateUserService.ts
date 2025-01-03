import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs'

interface UserRequest {
    name: string;
    email: string;
    password: string;
}

const prisma = new PrismaClient();  // Instanciando o Prisma Client

class CreateUserService {
    async execute({ name, email, password }: UserRequest) {
        // Verificar se o email foi fornecido
        if (!email) {
            throw new Error("Email incorreto");
        }

        // Verificar se o email já está cadastrado
        const userAlreadyExists = await prisma.user.findUnique({
            where: {
                email: email,  // Procurando usuário pelo campo 'email', que é único
            },
        });

        if (userAlreadyExists) {
            throw new Error("User Already Exists");
        }

        const passwordHash = await hash(password, 8);

        // Criar o novo usuário
        const user = await prisma.user.create({
            data: {
                name: name,
                email: email,
                password: passwordHash,
            },
            select:{
                id: true,
                name: true,
                email: true,
            }
        });

        console.log(name);

        return user;
    }
}

export { CreateUserService };
