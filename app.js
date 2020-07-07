const express = require('express');
const morgan = require('morgan');

const app = express();

const capitalize = (str) => {
    return str[0].toUpperCase() + str.substring(1).toLowerCase();
}

app.use(morgan('common'));

const playStore = require('./playStore.js');

//methods start here
app.get('/apps', (req, res) => {
    const { search = "", sort, genres } = req.query;

    let newSort, newGenres;

    if (sort) {
        newSort = capitalize(sort);
        if (!['App', 'Rating'].includes(newSort)) {
            return res.status(400).send('Not a valid sort selector.')
        }
    }
 
    if (genres) {
        newGenres = capitalize(genres);
        if (!['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card']
            .includes(newGenres)) {
            return res.status(400).send('Not a valid genre selector.')
        }
    }

    const results = playStore.filter(apps =>
        apps
            .App
            .toLowerCase()
            .includes(search.toLowerCase()))

    if (sort) {
        results.sort((a, b) => {
            return a[newSort] < b[newSort]
                ? 1
                : a[newSort] > b[newSort]
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

module.exports = app;