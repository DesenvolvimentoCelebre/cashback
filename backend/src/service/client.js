const pool = require('../database/connection');
const {initializeVenom, getVenomClient} = require('../utils/wpp/conf')


async function clientCreate(cpf, name, tel) {
    const query = "INSERT INTO client (cpf, name, tel, point) VALUES (?, ?, ?, 0)";

    try {
        const result = await pool.query(query, [cpf, name, tel]);		
	
	const venomClient = getVenomClient();
	
	const message = `
ðŸŒŸ *Bem-vindo Ã  Toca do AÃ§aÃ­!* ðŸŒŸ

Ficamos muito felizes em ter vocÃª como cliente. Aqui, alÃ©m de saborear o melhor aÃ§aÃ­ da regiÃ£o, vocÃª acumula **cashback** em todas as suas compras!

ðŸ’° *Como funciona o Cashback?*
A cada compra que vocÃª fizer, vocÃª vai acumular um saldo de cashback. Quando esse saldo atingir *R$3,00 ou mais*, vocÃª poderÃ¡ utilizÃ¡-lo como desconto nas suas prÃ³ximas compras!

ðŸ§ *NÃ£o perca a oportunidade de aproveitar ainda mais nossos deliciosos aÃ§aÃ­s com descontos exclusivos.*

Fique Ã  vontade para aproveitar todos os benefÃ­cios e continue saboreando o melhor do aÃ§aÃ­! ðŸ˜‹
`;

        const tele = `55${tel}@c.us`

        await venomClient.sendText(tele, message);

	if (result[0] && result[0].affectedRows == 1) {
	return {
	success: true,
	message: ["Cliente criado com sucesso"]
}
}        
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return {
                success: false,
                message: ["Cliente jÃ¡ cadastrado"],
            };
        }

        throw error;
    }
}


async function clientList() {
    const query = "SELECT * FROM client";   

    const [result] = await pool.query(query);

    if (result.length === 0) {
        return {
            success: true,
            message: ["Nenhum cliente encontrado"]
        }
    }

    return {
        success: true,
        message: result
    }
}

async function clientSerach(cpf) {
    try {
        const query = "SELECT * FROM client WHERE cpf = ?";

        const [result] = await pool.query(query, [cpf])
        
        if (!result || result == null, result == 0, result == undefined) {
            return {
                success: false,
                error: ["NÃ£o existe cliente cadastrado para o cpf informado"]
            }
        }

        return {
            success: true,
            message: result 
        }
    } catch (error) {
        return {
            success: false,
            error: ["Erro ao buscar cliente, por favor contate o administrador"]
        }
    }
}

async function clientDelete(id) {
    const query = "DELETE FROM client WHERE id = ?";
    const [result] = await pool.query(query, [id]);

    return {
        success: true,
        message: ["Cliente excluÃ­do com sucesso"]
    }
}

async function clientUpdate(nome, cpf, tel, id) {
    const query = "UPDATE client SET nome = ?, cpf = ?, tel = ? WHERE id = ?";
    const values = [nome, cpf, tel, id]

    const [result] = await pool.query(query, values);

    return {
        success: true,
        message: ["InformaÃ§Ãµes do cliente atualizada com sucesso"]
    }
}
module.exports = {
    clientCreate,
    clientList,
    clientSerach,
    clientDelete,
    clientUpdate
}
