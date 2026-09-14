const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { sequelize } = require('./models');
const feedbackRouter = require('./routes/feedback');
const { router: authRouter } = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// 🌐 Configure Middlewares & Dynamic Cross-Origin Resource Sharing
app.use(cors({ origin: '*' })); 
app.use(express.json());

// 🚏 Mount API Router Segments [INDEX_0.1.7]
app.use('/api/auth', authRouter);
app.use('/api/feedback', feedbackRouter);

// 🩺 System Health Monitoring Baseline Check
app.get('/health', (req, res) => {
  res.json({ status: "healthy", timestamp: new Date() });
});

// 🚀 Open Connections, Mirror Sequelize Definitions, and Sync Live Server [INDEX_0.1.7, INDEX_0.1.8]
async function bootPlatformServer() {
  try {
    console.log('🔌 Communicating baseline configurations to Neon database cluster...');
    await sequelize.authenticate();
    console.log('✅ Secure link to Cloud Postgres verified successfully.');

    // Sync models to actual tables inside Postgres safely
    await sequelize.sync();
    console.log('✅ System schema models synchronized with remote instance tables.');

    app.listen(PORT, () => {
      console.log(`⚡ =================================================== ⚡`);
      console.log(`🚀 LOOP ENGINE ACTIVE & COMPILING LIVE ON PORT: ${PORT}`);
      console.log(`⚡ =================================================== ⚡`);
    });
  } catch (error) {
    console.error('❌ Critical system breakdown encountered on boot setup:', error);
    process.exit(1);
  }
}

bootPlatformServer();
