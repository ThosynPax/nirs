Backend Code

const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'logs')));

// In-memory data store (replace with MongoDB/PostgreSQL)
let dataStore = [];
let assetGraph = { nodes: [], edges: [] };

// Logging setup
const log = async (level, message) => {
  const logEntry = `${new Date().toISOString()} - ${level} - ${message}\n`;
  await fs.appendFile(path.join(__dirname, 'logs/nirs.log'), logEntry);
};

// Simulated signing (post-quantum placeholder)
const signData = (dataStr) => `signed_${Buffer.from(dataStr).toString('base64').slice(0, 10)}`;

// API: Ingest regulatory data
app.post('/api/ingest', async (req, res) => {
  try {
    const data = req.body;
    const newEntries = Object.entries(data).reduce((acc, [key, values]) => {
      values.forEach((val, idx) => {
        acc[idx] = acc[idx] || {};
        acc[idx][key] = val;
      });
      return acc;
    }, []).map(entry => ({
      ...entry,
      timestamp: new Date().toISOString(),
      signature: signData(JSON.stringify(entry))
    }));
    dataStore.push(...newEntries);
    await log('INFO', `Ingested ${newEntries.length} records. Total: ${dataStore.length}`);
    res.json({ message: `Ingested ${newEntries.length} records`, data: dataStore });
  } catch (e) {
    await log('ERROR', `Ingestion error: ${e.message}`);
    res.status(400).json({ error: 'Invalid JSON' });
  }
});

// API: Query data
app.get('/api/data', async (req, res) => {
  const filters = req.query;
  let result = dataStore;
  if (filters.amount) {
    result = result.filter(row => row.amount > parseFloat(filters.amount));
  }
  res.json(result);
});

// API: AI analysis (simulated)
app.post('/api/ai-analysis', async (req, res) => {
  try {
    const features = req.body.features || ['amount', 'risk_score', 'timestamp'];
    const predictions = dataStore.map(() => Math.random() > 0.5 ? 1 : 0);
    const importance = Array(5).fill(0).map(() => Math.random() * 0.01);
    await log('INFO', `AI analysis completed: ${predictions.length} predictions`);
    res.json({ predictions, explanations: { feature_importance: importance } });
  } catch (e) {
    await log('ERROR', `AI error: ${e.message}`);
    res.status(500).json({ error: 'Analysis failed' });
  }
});

// API: Parse digital asset
app.post('/api/digital-asset', async (req, res) => {
  try {
    const { transactions } = req.body;
    const anomalies = transactions.filter(tx => tx.value > 1000000);
    const nodes = [...new Set(transactions.flatMap(tx => [tx.from, tx.to]))].map((id, idx) => ({ id: idx + 1, label: id }));
    const edges = transactions.map((tx, idx) => ({ from: nodes.find(n => n.label === tx.from).id, to: nodes.find(n => n.label === tx.to).id }));
    assetGraph = { nodes, edges };
    await log('INFO', `${anomalies.length} anomalies detected`);
    res.json({ anomalies, summary: `${anomalies.length} anomalies detected`, graph: assetGraph });
  } catch (e) {
    await log('ERROR', `Parse error: ${e.message}`);
    res.status(400).json({ error: 'Invalid JSON' });
  }
});

// API: Federated learning simulation
app.post('/api/federated', async (req, res) => {
  await log('INFO', 'Federated model updated');
  res.json({ message: 'Federated model updated (privacy preserved)' });
});

// API: Cyber threat detection
app.post('/api/cyber-threat', async (req, res) => {
  const { text } = req.body;
  const threats = [];
  if (text.toLowerCase().includes('http')) threats.push('phishing');
  if (text.toLowerCase().includes('exe')) threats.push('malware');
  res.json({ threats, risk_level: threats.length > 0 ? 'High' : 'Low' });
});

// API: Cross-border exchange
app.post('/api/cross-border', async (req, res) => {
  try {
    const data = req.body;
    const newEntries = Object.entries(data).reduce((acc, [key, values]) => {
      values.forEach((val, idx) => {
        acc[idx] = acc[idx] || {};
        acc[idx][key] = val;
      });
      return acc;
    }, []).map(entry => ({
      ...entry,
      timestamp: new Date().toISOString(),
      signature: signData(JSON.stringify(entry))
    }));
    dataStore.push(...newEntries);
    await log('INFO', 'Cross-border data exchanged');
    res.json({ message: 'Cross-border data exchanged', data: dataStore });
  } catch (e) {
    await log('ERROR', `Cross-border error: ${e.message}`);
    res.status(400).json({ error: 'Invalid JSON' });
  }
});

// API: KPIs and report
app.get('/api/kpis', async (req, res) => {
  const kpis = {
    connected_institutions: 90,
    anomaly_detection_speed: (Math.random() * 1).toFixed(2),
    compliance_reduction: 40,
    anomalies_detected: dataStore.filter(row => row.risk_score > 0.5).length,
    open_source_components: 5,
    sandbox_onboarding: 2.5,
    global_pilots: 2
  };
  await log('INFO', `KPIs generated: ${JSON.stringify(kpis)}`);
  res.json(kpis);
});

app.listen(port, () => console.log(`Backend running on http://localhost:${port}`));