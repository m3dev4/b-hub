import morgan from 'morgan';

const loggingMiddleware = morgan('combined', {
    // Log all requests, including those with status codes < 400
    skip: () => false // Do not skip any requests
});

export default loggingMiddleware;
