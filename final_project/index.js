const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req, res, next) {
    try {
        // Get token from headers
        const token = req.headers['authorization'];

        if (!token) {
            return res.status(403).json({ message: "No token provided" });
        }

        // Verify token (remove 'Bearer ' if present)
        const accessToken = token.split(' ')[1];

        jwt.verify(accessToken, "access", (err, user) => {
            if (err) {
                return res.status(403).json({ message: "Invalid token" });
            }

            // Store user info in session
            req.session.user = user;

            next();
        });

    } catch (error) {
        return res.status(500).json({ message: "Authentication failed" });
    }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
