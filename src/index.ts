import express from 'express';
import { OAuth2Client } from 'google-auth-library';

const app = express();
const PORT = process.env.PORT || 9092;

app.use(express.static(__dirname + '/../public'));

const CLIENT_ID = "536995723053-q33c79mihoakvq62psritept2qfnpps7.apps.googleusercontent.com";
const client = new OAuth2Client(CLIENT_ID);

const authMiddlewares = async (req: express.Request, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer', '');

    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];

    next();
}

app.get('/values', authMiddlewares, (req, res) => {
    res.json({
        value: 'Teste método protegido'
    })
});

app.get('/', (req, res) => {
    res.sendFile('index.html');

})

app.listen(PORT, () => console.log('Servidor iniciando na porta ' + PORT));

