const app = require('./server');
const dotenv = require('dotenv');

dotenv.config();
const PORT = process.env.PORT || 3003;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));