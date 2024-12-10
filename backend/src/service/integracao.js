const pool = require('../database/connection');

const {initializeVenom, getVenomClient} = require('../utils/wpp/conf')

async function welcome(tel) {
    const venomClient = getVenomClient();
    const message = `
🌟 Bem-vindo à Toca do Açaí! 🌟

Ficamos muito felizes em ter você como cliente. Aqui, além de saborear o melhor açaí da região, você acumula *cashback* em todas as suas compras!

💰 Como funciona o Cashback?
A cada compra que você fizer, você vai acumular um saldo de cashback. Quando esse saldo atingir R$3,00 ou mais, você poderá utilizá-lo como desconto nas suas próximas compras!

🍧 Não perca a oportunidade de aproveitar ainda mais nossos deliciosos açaís com descontos exclusivos.

Fique à vontade para aproveitar todos os benefícios e continue saboreando o melhor do açaí! 😋
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

    const message = `Oi, ${clientName}! 😊
O seu saldo de cashback é de R$ ${clientPoint}. Use-o para tornar a sua próxima compra ainda mais especial! 💕 Estamos ansiosos por vê-lo(a) novamente.

Um abraço,
Toca do Açaí­`;

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