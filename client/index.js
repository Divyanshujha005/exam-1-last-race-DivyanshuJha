import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import sqlite3 from 'sqlite3';
import crypto from 'crypto';

// ============================================================================
// 1. DATABASE INITIALIZATION
// ============================================================================
const db = new sqlite3.Database('database.db', (err) => {
    if (err) {
        console.error('Error connecting to SQLite database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        // Enable foreign key constraints explicitly for SQLite
        db.run('PRAGMA foreign_keys = ON;');
    }
});

// ============================================================================
// 2. EXPRESS & MIDDLEWARE SETUP
// ============================================================================
const app = express();
const PORT = 3001;

// Logger for incoming requests
app.use(morgan('dev'));

// Parse incoming JSON payloads
app.use(express.json());

// CORS configuration (Crucial for the "Two Servers Pattern")
app.use(cors({
    origin: 'http://localhost:5173', // Your React SPA Vite development port
    credentials: true,               // Allows session cookies to pass through
}));

// Session configuration
app.use(session({
    secret: 'metro-game-super-secret-key', // Change this to a secure env variable later
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false, // Set to true if using HTTPS in production
        sameSite: 'lax'
    }
}));

// Initialize Passport authentication middleware
app.use(passport.initialize());
app.use(passport.session());

// ============================================================================
// 3. PASSPORT LOCAL STRATEGY & SERIALIZATION
// ============================================================================
passport.use(new LocalStrategy(function verify(username, password, cb) {
    const query = 'SELECT * FROM users WHERE username = ?';
    
    db.get(query, [username], (err, row) => {
        if (err) return cb(err);
        if (!row) return cb(null, false, { message: 'Incorrect username or password.' });

        // Verify password using crypto.scrypt
        crypto.scrypt(password, row.salt, 32, (err, hashedPassword) => {
            if (err) return cb(err);
            
            if (!crypto.timingSafeEqual(Buffer.from(row.password_hash, 'hex'), hashedPassword)) {
                return cb(null, false, { message: 'Incorrect username or password.' });
            }
            
            // Success: return user object
            return cb(null, { id: row.id, username: row.username });
        });
    });
}));

passport.serializeUser((user, cb) => {
    cb(null, { id: user.id, username: user.username });
});

passport.deserializeUser((user, cb) => {
    cb(null, user); // User object is automatically attached to req.user
});

// Helper Middleware to guard protected API endpoints
const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    return res.status(401).json({ error: 'Not authenticated' });
};

// ============================================================================
// 4. API ROUTES PLACEHOLDERS
// ============================================================================

// --- Authentication APIs ---
app.post('/api/sessions', passport.authenticate('local'), (req, res) => {
    res.status(201).json(req.user);
});

app.delete('/api/sessions/current', (req, res) => {
    req.logout((err) => {
        if (err) return res.status(500).json({ error: 'Logout failed' });
        res.status(200).json({ message: 'Logged out successfully' });
    });
});

app.get('/api/sessions/current', (req, res) => {
    if (req.isAuthenticated()) {
        res.json(req.user);
    } else {
        res.status(401).json({ error: 'No active session' });
    }
});

// --- Game APIs ---
app.get('/api/network/setup', isLoggedIn, (req, res) => {
    // TODO: Fetch stations, lines, and connections from DB
    res.json({ message: "Network details route" });
});

app.post('/api/games', isLoggedIn, (req, res) => {
    // TODO: Pick random start/destination with distance >= 3
    res.json({ message: "Create game route" });
});

app.post('/api/games/:id/submit-route', isLoggedIn, (req, res) => {
    // TODO: Validate route, compute steps/events, save execution
    res.json({ message: "Submit route validation" });
});

app.get('/api/ranking', (req, res) => {
    // TODO: Fetch high scores leaderboard
    res.json({ message: "Leaderboard route" });
});

// ============================================================================
// 5. START SERVER
// ============================================================================
app.listen(PORT, () => {
    console.log(`Server is driving down the line on http://localhost:${PORT}`);
});