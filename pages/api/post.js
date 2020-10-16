import nextConnect from 'next-connect';
import { v4 } from 'uuid';
import middleware from '../../middlewares/middleware';

const handler = nextConnect();

handler.use(middleware);

handler.post(async (req, res) => {

    const {title, description, creatorId} = req.body;
    if(!title || !description || !creatorId) return res.status(400).send('Faltan campos requeridos');
    if (await req.db.collection('users').countDocuments({ email: creatorId }) > 0) {
        const post = await req.db
        .collection('posts')
        .insertOne({
          _id: v4(),
          title,
          description,
          creatorId,
          createdAt: new Date()
        });
        return res.status(201).end();
    }
    return res.status(400).send('Id de creador no válido');
});

handler.get(async (req, res) => {
  const posts = await req.db.collection('posts').find({}).sort({createdAt: -1}).toArray(); // Last input first output (LIFO)
  res.send(posts);
});

export default handler;