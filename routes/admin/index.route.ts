
import { Express } from 'express';
import { dashboardRoutes } from './dashboard.route';
import { systemConfig } from '../../config/system';

const adminRoutes = (app: Express): void => {
    const PATH_ADMIN = systemConfig.prefixAdmin;
    app.use(`${PATH_ADMIN}/dashboard`, dashboardRoutes);

};

export default adminRoutes;
