var childProc = require('child_process');
childProc.exec(`open -a "Brave Browser" http://localhost:${process.env.PORT}/admin`);