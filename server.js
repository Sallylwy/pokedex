const express = require('express');
const axios = require('axios');
const app = express();

// Route to retrieve Pokémon data from PokeAPI
app.get('/:pokemon', async (req, res) => {
    const pokemon = req.params.pokemon; // Get the Pokémon name or ID from the URL

    try {
        // Fetch data from the PokeAPI
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

        // Send the response to the user
        res.send(`
        <div style="width: 50%; margin: 0 auto; text-align: center; font-family: Arial; border: 2px solid #ccc; border-radius: 10px; padding: 20px; background-color: #f9f9f9; box-shadow: 0px 4px 8px rgba(0,0,0,0.1);">
        <h1 style="text-transform: capitalize;">${name.toLowerCase()}</h1>
        <img src="${image}" alt="${name}" style="border: 1px solid #ddd; border-radius: 8px; padding: 5px; background: white; width: 20%;" />
        
        <div style="margin-top: 20px; padding: 10px; border: 1px solid #ddd; border-radius: 8px; background-color: #fff;">
            <p><strong>Type:</strong> ${types}</p>
        </div>

        <div style="margin-top: 10px; padding: 10px; border: 1px solid #ddd; border-radius: 8px; background-color: #fff;">
            <p><strong>Abilities:</strong> ${abilities}</p>
        </div>

        <div style="margin-top: 10px; padding: 10px; border: 1px solid #ddd; border-radius: 8px; background-color: #fff;">
            <p><strong>Base Stats:</strong></p>
            <p style="text-align: left; margin-left: 20px; line-height: 1.6;">
                ${baseStats}
            </p>
        </div>
        </div>
        `);
       
    } catch (error) {
        // Handle errors (e.g., Pokémon not found)
        res.status(404).send('<h1>Opps, Pokémon not found!</h1>');
    }
});

const PORT = 3001; 
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
