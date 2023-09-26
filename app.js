const express = require('express');
const dummy_data = require("./data/dummy_data");
const app = express();
const port = 3000;

const expressLayouts = require('express-ejs-layouts');
app.use(expressLayouts);

app.use(express.static('public'));


app.set('view engine', 'ejs');
app.set('views', 'views');


app.get('/', (req, res) => {
    const data = {title: "Admin - Index"};
    res.render('index', data);
});


app.get('/dashboard', (req, res) => {
    const data = {title: "Admin - Dashboard", activeDashboard: true, dummy_data};
    res.render('dashboard', data);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
