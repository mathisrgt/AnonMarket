import Fastify from 'fastify'
import cors from '@fastify/cors'

import { withdrawRoutes } from './routes.js';


const app = Fastify({
    logger: true
})

withdrawRoutes(app)

export default app

