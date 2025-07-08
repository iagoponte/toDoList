const app = require('./app');
require('dotenv').config();
const router = require('./routes/index');

const PORT = process.env.PORT || 3333;

app.use(router);

//rodar o servidor
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));