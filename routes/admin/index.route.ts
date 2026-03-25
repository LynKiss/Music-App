
import { Express } from 'express';
import { dashboardRoutes } from './dashboard.route';
import { systemConfig } from '../../config/system';
import { topicRoutes } from './topic.route';
import { singerRoutes } from './singer.route';
import { songRoutes } from './song.route';
import { uploadRoutes } from './upload.route';

const adminRoutes = (app: Express): void => {
    const PATH_ADMIN = systemConfig.prefixAdmin;
    app.use(`${PATH_ADMIN}/dashboard`, dashboardRoutes);
    app.use(`${PATH_ADMIN}/topics`, topicRoutes);
    app.use(`${PATH_ADMIN}/singers`, singerRoutes);
    app.use(`${PATH_ADMIN}/songs`, songRoutes);
    app.use(`${PATH_ADMIN}/upload`, uploadRoutes);

};

export default adminRoutes;
