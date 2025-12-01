import { Router } from "express";
import resourceRoutes from './resource.routes';

const routes = Router();

routes.use('/resources', resourceRoutes);

export default routes;