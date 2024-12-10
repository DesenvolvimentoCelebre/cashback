const pool = require('../database/connection');

const {initializeVenom, getVenomClient} = require('../utils/wpp/conf')

async function welcome(tel) {
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

        return {
            success: true,
            msg: ["Boas vindas inviada com sucesso"]
        }
}

async function clientPoint(id) {
    const query = "SELECT name, point, tel FROM client WHERE id = ?"
    const [infoClient] = await pool.query(query, [id]);
    const clientName = infoClient[0].name;
    const clientPoint = infoClient[0].point;
    const clientPhone = infoClient[0].tel;
    const venomClient = getVenomClient();

    const message = `Oi, ${clientName}! ðŸ˜Š
O seu saldo de cashback Ã© de R$ ${clientPoint}. Use-o para tornar a sua prÃ³xima compra ainda mais especial! ðŸ’• Estamos ansiosos por vÃª-lo(a) novamente.

Um abraÃ§o,
Toca do AÃ§aÃ­`;

const tele = `55${clientPhone}@c.us`

        await venomClient.sendText(tele, message);

        return {
            success: true,
            msg: ["Saldo do cliente enviado com sucesso"]
        }
}

module.exports = {
    welcome,
    clientPoint
}