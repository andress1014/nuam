import jwt from 'jsonwebtoken'

const  { JWT_SECRET }: any = process.env;

/**
 * Crea un token con llave jwt
 * @param data información contenida en el token jwt
 * @return string con token generado
 * */
export const createToken = (data:any):string=>{
	let token = jwt.sign({ user: data }, JWT_SECRET);
	return token;
}

/**
 * Desencripta la información de un token
 * @param token string con el token encriptado
 * @return información decodificada del token
 * */
export const verifyToken = (token:any):any=>{
	token?.includes("Bearer") ?token = token.split(" ")[1] : token;
	let decoded = jwt.verify(token, JWT_SECRET);
	return decoded;
}

