const express = require('express');
const morgan = require('morgan');

const app = express();

const capitalize = (str) => {
    return str[0].toUpperCase() + str.substring(1).toLowerCase();
}

app.use(morgan('common'));

const playStore = require('./playStore.js');

app.get('/apps', (req, res) => {
    const { search = "", sort, genres } = req.query;

    if (sort) {
        if (!['app', 'rating'].includes(sort)) {
            return res.status(400).send('Not a valid sort selector.')
        }
    }
    let newGenres = capitalize(genres);

    if (newGenres)
        if (!['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card']
            .includes(newGenres)) {
            return res.status(400).send('Not a valid genre selector.')
        }

    const results = playStore.filter(apps =>
        apps
            .App
            .toLowerCase()
            .includes(search.toLowerCase()))

    if (sort) {
        const sortCap = capitalize(sort);
        results.sort((a, b) => {
            return a[sortCap] > b[sortCap]
                ? 1
                : a[sortCap] < b[sortCap]
                    ? -1
                    : 0;
        });
    }
    let newVar = results;

    if (newGenres) {
        newVar = results.filter(selected => selected["Genres"] == newGenres);
    }

    res.json(newVar);
})


app.listen(8000, () => {
    console.log('Server started on PORT 8000...');
});