import express from 'express';
import { Blum } from './blum_worker.mjs';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log('Time: ', Date.now());
  next();
});

app.get('/', (_, res) => {
  res.send('KALIAN LUAR BIASA ');
})

app.post('/blum', async (req, res) => {
  const { gameId, points } = req.body;

  try {
    const challenge = await Blum.getChallenge(gameId);
    const uuidChallenge = Blum.getUUID();

    const payload = Blum.getPayload(
      gameId,
      {
        id: uuidChallenge,
        nonce: challenge.nonce,
        hash: challenge.hash,
      },
      {
        CLOVER: {
          amount: points.toString(),
        }
      }
    );
    console.log(payload);
    res.status(200).json({ gameId, points, payload });
  } catch (error) {
    console.error("Error in getPayload:", error);
    res.status(500).send('An error occurred while generating the payload');
  }
});

app.listen(3000, () => console.log('Example app is listening on port 3000.'));
