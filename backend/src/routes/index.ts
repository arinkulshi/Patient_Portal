import { Router } from 'express';
import reportRoutes from './report.routes';

const router = Router();

// API version prefix
const API_V1 = '/v1';

// Register all routes with versioning
router.use(`${API_V1}/reports`, reportRoutes);

// API information endpoint
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