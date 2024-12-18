const venom = require('venom-bot');
let venomClient = null;
let venomError = null;

function initializeVenom() {
  return new Promise((resolve, reject) => {
    venom
      .create(
        {
          session: "apizap",
          multidevice: true,
          headless: true,
          launch: {
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            timeout: 60000,
          }
        },
        (base64Qr, asciiQr) => {
          global.qrCode = base64Qr; 
          if (global.wsClients) {
            global.wsClients.forEach(client => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ event: 'qrCodeGenerated', qrCode: base64Qr }));
              }
            });
          }
        },
        (statusSession) => {
          if (statusSession === 'isLogged' || statusSession === 'qrReadSuccess') {
            global.sucesso === (statusSession === 'isLogged' || statusSession === 'qrReadSuccess')
            if (global.wsClients) {
              global.wsClients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                  client.send(JSON.stringify({
                    event: 'qrCodeStatus',
                    status: 'ok',
                    message: 'QR Code lido com sucesso e a sessão foi iniciada.',
                  }));
                }
              });
            }
          }
        }
      )
      .then((client) => {
        venomClient = client;
        resolve(client);
      })
      .catch((error) => {
        venomError = error;
        reject(error);
      });
  });
}

module.exports = {
  initializeVenom,
  getVenomClient: () => venomClient,
  getVenomError: () => venomError
};
