import { Server } from "@hapi/hapi";

declare global {
    var __SERVER__: Server;
}