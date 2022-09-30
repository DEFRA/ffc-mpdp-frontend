'use strict';

import Hapi from '@hapi/hapi';
import { Server } from '@hapi/hapi';

const init = async function(): Promise<Server> {
    const server = Hapi.server({
        port: process.env.PORT || 3000,
        routes: {
            validate: {
                options: {
                    abortEarly: false
                }
            }
        },
        router: {
            stripTrailingSlash: true
        }
    });

    await server.register(require('@hapi/inert'))
    await server.register(require('./plugins/router'))
    
    return server;
};

export const start = async function (): Promise<Server> {
    const server = await init()
    console.log(`Listening on ${server.settings.host}:${server.settings.port}`);
    await server.start();
    return server;
};