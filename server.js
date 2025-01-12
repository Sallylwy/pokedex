const express = require('express');
const axios = require('axios');
const app = express();

const MAX_POKEMON_COUNT = 1010; // Total Pokémon available in PokeAPI

// Root Route
app.get('/', (req, res) => {
    res.send(`
        <div style="margin-top: 250px; text-align: center; font-family: Arial;">
            <h1>What Pokémon would you like to meet today?</h1>
            <p>To search for a Pokémon, enter its name or ID in the URL, like this:</p>
            <p><code>http://localhost:3001/pikachu</code></p>
            <a href="/random" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Generate a random Pokémon</a>
        </div>
    `);
});

// Random Pokémon Route
app.get('/random', async (req, res) => {
    try {
        // Generate a random Pokémon ID
        const randomId = Math.floor(Math.random() * MAX_POKEMON_COUNT) + 1;

        // Fetch data from PokeAPI for the random Pokémon
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
        const data = response.data;

        // Extract relevant data
        const name = data.name.toUpperCase();
        const image = data.sprites.front_default;
        const types = data.types.map(typeInfo => typeInfo.type.name).join(', ');
        const abilities = data.abilities.map(abilityInfo => abilityInfo.ability.name).join(', ');
        const baseStats = data.stats
            .map(stat => `${stat.stat.name.toUpperCase()}: ${stat.base_stat}`)
            .join('<br>');

        // Send the random Pokémon data
        res.send(`
            <div style="width: 50%; margin: 0 auto; text-align: center; font-family: Arial; border: 2px solid #ccc; border-radius: 10px; padding: 20px; background-color: #f9f9f9; box-shadow: 0px 4px 8px rgba(0,0,0,0.1);">
                <h1 style="text-transform: capitalize;">${name.toLowerCase()}</h1>
                <img src="${image}" alt="${name}" style="border: 1px solid #ddd; border-radius: 8px; padding: 5px; background: white;" />
                
                <div style="margin-top: 20px; padding: 10px; border: 1px solid #ddd; border-radius: 8px; background-color: #fff;">
                    <p><strong>Type:</strong> ${types}</p>
                </div>

                <div style="margin-top: 10px; padding: 10px; border: 1px solid #ddd; border-radius: 8px; background-color: #fff;">
                    <p><strong>Abilities:</strong> ${abilities}</p>
                </div>

                <div style="margin-top: 10px; border: 1px solid #ddd; border-radius: 8px; background-color: #fff;">
                    <p style="text-align: center; font-weight: bold;"><strong>Base Stats:</strong></p>
                    <p style="text-align: left; margin: 30px; line-height: 1.6;">
                        ${baseStats}
                    </p>
                </div>
            </div>
            
            <a href="/random" style="
            display: block;
            font-family: Arial;
            margin: 5vh auto 0 auto; /* Center vertically */
            transform: translateY(-50%); /* Adjust to fully centre */
            width: fit-content;
            padding: 10px 20px;
            background-color: #007bff;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            text-align: center;">
            Generate Another Pokémon
            </a>        
            `);

    } catch (error) {
        res.status(500).send('<h1>Oops, something went wrong!</h1>');
    }
});

// Fetch Pokémon by Name or ID
app.get('/:pokemon', async (req, res) => {
    const pokemon = req.params.pokemon; // Capture the name or ID from the URL
    try {
        // Fetch data from PokeAPI
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
        const data = response.data;

        // Extract relevant data
        const name = data.name.toUpperCase();
        const image = data.sprites.front_default;
        const types = data.types.map(typeInfo => typeInfo.type.name).join(', ');
        const abilities = data.abilities.map(abilityInfo => abilityInfo.ability.name).join(', ');
        const baseStats = data.stats
            .map(stat => `${stat.stat.name.toUpperCase()}: ${stat.base_stat}`)
            .join('<br>');

        // Send the response
        res.send(`
            <div style="width: 50%; margin: 0 auto; text-align: center; font-family: Arial; border: 2px solid #ccc; border-radius: 10px; padding: 20px; background-color: #f9f9f9; box-shadow: 0px 4px 8px rgba(0,0,0,0.1);">
                <h1 style="text-transform: capitalize;">${name.toLowerCase()}</h1>
                <img src="${image}" alt="${name}" style="border: 1px solid #ddd; border-radius: 8px; padding: 5px; background: white;" />
                
                <div style="margin-top: 20px; padding: 10px; border: 1px solid #ddd; border-radius: 8px; background-color: #fff;">
                    <p><strong>Type:</strong> ${types}</p>
                </div>

                <div style="margin-top: 10px; padding: 10px; border: 1px solid #ddd; border-radius: 8px; background-color: #fff;">
                    <p><strong>Abilities:</strong> ${abilities}</p>
                </div>

                <div style="margin-top: 10px; padding: 10px; border: 1px solid #ddd; border-radius: 8px; background-color: #fff;">
                    <p><strong>Base Stats:</strong></p>
                    <p style="text-align: left; margin: 0; line-height: 1.6;">
                        ${baseStats}
                    </p>
                </div>
            </div>
        `);
    } catch (error) {
        res.status(404).send('<h1>Pokémon not found! Check the URL and try again.</h1>');
    }
});

const PORT = 3001; 
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
