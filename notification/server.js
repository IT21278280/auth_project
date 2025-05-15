const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config({ path: './.env' });
console.log('SMTP Config:', {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS ? '[REDACTED]' : undefined,
    portApp: process.env.PORT
});
const app = express();

app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.originalUrl}`);
    next();
});

app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));
app.get('/debug', (req, res) => res.json({ status: 'Notification service OK' }));
app.get('/routes', (req, res) => {
    const routes = [];
    app._router.stack.forEach((middleware) => {
        if (middleware.route) {
            routes.push(`${Object.keys(middleware.route.methods).join(',')} ${middleware.route.path}`);
        } else if (middleware.name === 'router' && middleware.handle.stack) {
            middleware.handle.stack.forEach((handler) => {
                if (handler.route) {
                    routes.push(`${Object.keys(handler.route.methods).join(',')} ${middleware.regexp.source}${handler.route.path}`);
                }
            });
        }
    });
    res.json({ routes });
});

app.use(express.json());
console.log('Checking routes directory');
try {
    const routesPath = path.join(__dirname, 'routes');
    console.log('Routes directory contents:', fs.readdirSync(routesPath));
} catch (error) {
    console.error('Failed to read routes directory:', error.message);
}

let notifyRoutes;
console.log('Attempting to load notify.js');
try {
    notifyRoutes = require('./routes/notify');
    console.log('Successfully loaded notify.js');
} catch (error) {
    console.error('Failed to load notify.js:', error.message);
}

console.log('Mounting /api/notify route');
if (notifyRoutes) {
    app.use('/api/notify', notifyRoutes);
    console.log('Successfully mounted /api/notify route');
} else {
    console.error('notifyRoutes is undefined, skipping /api/notify mount');
}

app.post('/api/notify/fallback', (req, res) => {
    console.log('Fallback route hit');
    res.json({ status: 'Fallback route hit' });
});

app.use((req, res, next) => {
    console.warn(`Unhandled request: ${req.method} ${req.originalUrl}`);
    res.status(404).json({ error: `Cannot ${req.method} ${req.originalUrl}` });
});

module.exports = app;










// const express = require('express');
// const dotenv = require('dotenv');
// const notifyRoutes = require('./routes/notify');

// dotenv.config({ path: './.env' });
// console.log('SMTP Config:', {
//     host: process.env.SMTP_HOST,
//     port: process.env.SMTP_PORT,
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS ? '[REDACTED]' : undefined,
//     portApp: process.env.PORT
// });
// const app = express();

// app.use((req, res, next) => {
//     console.log(`Incoming request: ${req.method} ${req.originalUrl}`);
//     next();
// });

// app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));
// app.get('/debug', (req, res) => res.json({ status: 'Notification service OK' }));
// app.get('/routes', (req, res) => {
//     const routes = [];
//     app._router.stack.forEach((middleware) => {
//         if (middleware.route) {
//             routes.push(`${Object.keys(middleware.route.methods).join(',')} ${middleware.route.path}`);
//         } else if (middleware.name === 'router' && middleware.handle.stack) {
//             middleware.handle.stack.forEach((handler) => {
//                 if (handler.route) {
//                     routes.push(`${Object.keys(handler.route.methods).join(',')} ${middleware.regexp.source}${handler.route.path}`);
//                 }
//             });
//         }
//     });
//     res.json({ routes });
// });

// app.use(express.json());
// console.log('Mounting /api/notify route');
// try {
//     app.use('/api/notify', notifyRoutes);
//     console.log('Successfully mounted /api/notify route');
// } catch (error) {
//     console.error('Failed to mount /api/notify route:', error.message);
// }

// app.use((req, res, next) => {
//     console.warn(`Unhandled request: ${req.method} ${req.originalUrl}`);
//     next();
// });


// app.post('/api/notify/fallback', (req, res) => res.json({ status: 'Fallback route hit' }));

// module.exports = app;





