import { Router } from 'express';
import reportRoutes from './report.routes';

const router = Router();

const API_V1 = '/v1';

router.use(`${API_V1}/reports`, reportRoutes);

router.get('/', (req, res) => {
  res.json({
    name: 'Patient Portal API',
    version: '1.0.0',
    endpoints: {
      reports: `${API_V1}/reports`
    }
  });
});

export default router;