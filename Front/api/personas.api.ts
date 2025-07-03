import { NextApiRequest, NextApiResponse } from 'next';
import obtenerPersonasPorReserva from '../src/utils/obtenerPersonasPorReserva';


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const reservaId = req.query.reservaId;
    const personas = await obtenerPersonasPorReserva(reservaId);
    return res.json(personas);
  }

  return res.status(405).json({ error: 'Method not allowed' });
};

export default handler;