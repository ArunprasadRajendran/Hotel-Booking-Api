/* eslint-disable @typescript-eslint/no-explicit-any */
import dotenv from 'dotenv';
import express, { Application, ErrorRequestHandler, NextFunction, Request, RequestHandler, Response } from 'express';
import fs from 'fs';
import apiRouter from './routes';
import cors from 'cors';
import morgan from 'morgan';
import { logger } from './logger/index';

export class DBServer {
    private port: number;
    private server: Application;

    constructor() {
        dotenv.config();
        this.port = (process.env.PORT || 3000) as number;
        this.config();
    }

    private config(): void {
        this.server = express();
        this.server.use(express.json());

        // Use middleware for enabling CORS
        this.server.use(cors());

        // Use middleware for live reloading
        this.server.use(morgan('dev'));

        // Use middleware for parsing incoming request bodies with a URL-encoded format
        this.server.use(express.urlencoded({ limit: '30mb', extended: true }));

        // Requests start with /api will be handled by the apiRouter page
        this.server.use('/api', apiRouter);

        // Use to see all the Api endpoints
        this.server.get('/', (req: Request, res: Response) => {
            const apiHtml: any = this.getAPIRoutes(apiRouter.stack);
            let html: string = fs.readFileSync(`${__dirname}/index.html`, 'utf8');
            html = html.replace('{{content}}', apiHtml);
            res.status(200).send(html);
        });

        // Middleware for handling route not found errors
        const routeNotFoundHandler: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
            const error: any = new Error('Route not found');
            logger.warn(`${req.url} - ${error.message}`);
            error.status = 404;
            next(error);
        };

        // Middleware for handling general errors
        const errorHandler: ErrorRequestHandler = (err: any, req: Request, res: Response) => {
            const status: any = err.status || 500;
            const message: any = err.message || 'Something went wrong';
            res.status(status).json({ status, message });
            logger.error(`${req.url} - ${err.message} - ${err.stack}`);
        };

        // Route that throws an error
        this.server.get('/error', (req: Request) => {
            logger.error(`${req.url} - Something went wrong`);
            throw new Error('Something went wrong');
        });

        // Use the middlewares for route not found and error handling
        this.server.use(routeNotFoundHandler);
        this.server.use(errorHandler);
    }

    private getAPIRoutes(stacks: Record<string, any>[]): string {
        const colorMapper: Record<string, string> = {
            get: 'info',
            post: 'success',
            put: 'warning',
            patch: 'warning',
            delete: 'danger',
        };
        let html: any = '<div class="row pt-4">';
        stacks.forEach((stack: Record<string, any>, index: number) => {
            const guid: any = `accordion-${(Math.random().toString(36) + '00000000000000000').slice(2, 8)}-${index}`;
            const routerName: any = stack.regexp
                .toString()
                .replace(/[^\w\s]/g, '')
                .slice(0, -1);
            html += `<div class="card p-0 mb-4">
                <div class="card-header">
                    <span class="card-title text-primary">${routerName}</span>
                </div>
                <div class="card-body">
                    <div class="accordion" id="${guid}">`;
            let content: any = '';
            stack.handle.stack.forEach((routeObj: Record<string, any>, i: number) => {
                const routeType: string = Object.keys(routeObj.route.methods)[0];
                const textColor: any = colorMapper[routeType];
                const itemGuid: any = (Math.random().toString(36) + '00000000000000000').slice(2, 8);
                const itemHeaderId: any = `heading-${itemGuid}-${i}`;
                const itemContentId: any = `collapse-${itemGuid}-${i}`;
                content += `<div class="accordion-item">
                    <h2 class="accordion-header" id="${itemHeaderId}">
                        <button class="accordion-button py-2 collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${itemContentId}" aria-expanded="false" aria-controls="${itemContentId}">
                           <span class="text-uppercase text-${textColor}" style="width:70px">${routeType}</span> 
                           <span class="text-primary">/api/${routerName + routeObj.route.path}</span>
                        </button>
                    </h2>
                    <div id="${itemContentId}" class="accordion-collapse collapse" aria-labelledby="${itemHeaderId}" data-bs-parent="#${guid}">
                        <div class="accordion-body">
                            Route Schema
                        </div>
                    </div>
                </div>`;
            });
            html += content + '</div></div></div>';
        });
        html += '</div>';
        return html;
    }

    public start(): void {
        this.server.listen(this.port, () => {
            console.log(`Express server listening on port ${this.port}`);
        });
    }
}

const server: DBServer = new DBServer();
server.start();
