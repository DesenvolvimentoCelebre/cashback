const pool = require('../database/connection');

const {initializeVenom, getVenomClient} = require('../utils/wpp/conf')

async function orderCreate(cpf, recebido, vpoint, bp) {
    try {
        const QClient = "SELECT id, tel as telefone, name FROM client WHERE cpf = ?";
    const [qclient] = await pool.query(QClient, [cpf]);

    const venomClient = getVenomClient();
    
    if (qclient.length === 0 || !qclient) {
        return {
            success: false,
            error: ["cliente nÃ£o encontrado"]
        }
    }

    const clientId = qclient[0].id;
    const clientTel = qclient[0].telefone;
    const clientName = qclient[0].name;

    const telefone = `55${clientTel}@c.us`;

    const QPCB = "SELECT value FROM sys WHERE id = 2";
    const [qpbc] = await pool.query(QPCB);
    const porcentagem_cashback = qpbc[0].value;

    let point = 0
    bp == 1 ? point = 0 : point = (porcentagem_cashback / 100) * recebido;

    const SDMIN = "SELECT value FROM sys WHERE id = 3";
    const [sdmin] = await pool.query(SDMIN);
    const saldo_minimo = sdmin[0].value;

    const PC = "SELECT point as pontos_cliente FROM client WHERE id = ?";
    const [pc] = await pool.query(PC, [clientId]);
    const pontos_cliente = pc[0].pontos_cliente;

    

    const QCreateOrder = "INSERT INTO purchases (id_client, value_pay, point, date, time, vpoint, bp) VALUES (?, ?, ?, current_date, current_time, ?, ?)"
    
    const values = [clientId, recebido, point, vpoint, bp];

    if (pontos_cliente < saldo_minimo && bp == 1) {
        return {
            success: false,
            error: [`O cliente sÃ³ pode utilizar o saldo de cashback a partir de ${saldo_minimo}`]
        }
    }

    
    if (pontos_cliente < vpoint && bp == 1) {
        return {
            success: false,
            error: ["Saldo CashBack insuficiente"]
        }
    }

    

    const result = await pool.query(QCreateOrder, values);

    const QNSD = "SELECT point FROM client WHERE cpf = ?"
    const [qnsd] = await pool.query(QNSD, [cpf]);
    const novosaldo = qnsd[0].point;
    
    const message = `Oi, ${clientName}! ðŸ˜Š
O seu saldo de cashback Ã© de R$ ${novosaldo}. Use-o para tornar a sua prÃ³xima compra ainda mais especial! ðŸ’• Estamos ansiosos por vÃª-lo(a) novamente.

Um abraÃ§o,
Toca do AÃ§aÃ­`;
    
    if (pontos_cliente != null) {
        await venomClient.sendText(telefone, message);   
    }

    return {
        success: true,
        message: ["Pedido inserido com sucesso"]
    }

    } catch (error) {
        if (error.sqlMessage && error.sqlMessage.includes('chk_point_positive')) {
            return {
                success: false,
                error: ["Saldo cashback insuficiente"]
            };
        }

        return {
            success: false,
            error: ["Erro inesperado ao criar pedido"]
        };
    }
}

module.exports = {
    orderCreate
}
