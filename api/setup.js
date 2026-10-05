const { execSync } = require('child_process');

module.exports = async (req, res) => {
  try {
    const result = execSync('node /var/task/setup-richmenu.js', {
      timeout: 25000,
      encoding: 'utf8'
    });
    res.status(200).send('<pre>' + result + '</pre>');
  } catch (e) {
    res.status(500).send('<pre>' + e.message + '\n' + e.stdout + '</pre>');
  }
};
