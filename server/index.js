//entry point for server
const express = require('express');
const app = express();
const morgan = require('morgan');
const path = require('path');
const port = process.env.PORT || 3000;
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//mount all api routes4 on /api
app.use('/api', require('./api/index'));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.use((err, req, res, next) => {
  console.error(err);
  console.error(err.stack);
  res
    .status(err.status || 500)
    .send(err.message || 'DANG! Internal server error.');
});

app.listen(port, () => {
  console.log(`Mixin' it up on ${port}`);
});
