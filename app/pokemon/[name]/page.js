'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const PokemonDetails = ({ params }) => {
  const { name } = params;
  const [pokemon, setPokemon] = useState(null);

  useEffect(() => {
    if (!name) return;

    const fetchPokemonDetails = async () => {
      try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        const data = await res.json();
        setPokemon(data);
      } catch (error) {
        console.error('Error fetching Pokémon details:', error);
      }
    };

    fetchPokemonDetails();
  }, [name]);

  if (!pokemon) {
    return <div>Loading...</div>;
  }

  const { sprites, types, stats, abilities, moves } = pokemon;

  return (
    <div className="flex flex-col items-center px-4 py-10 bg-gray-50 min-h-screen">
      <button onClick={() => window.history.back()} className="text-blue-500 absolute top-4 left-4">{'< Back'}</button>
      <div className="bg-cyan-500 mt-5 shadow-md rounded-lg overflow-hidden w-full max-w-md">
        <div className="h-96 flex items-center justify-center">
            <img src={sprites.other['official-artwork'].front_default} alt={name} className="w-72" />
        </div>
        <div className="p-4 bg-orange-300">
          <h1 className="text-2xl font-bold mb-2 capitalize">{name}</h1>
          <p><strong>Type:</strong> {types.map(type => type.type.name).join(', ')}</p>
          <p><strong>Stats:</strong> {stats.map(stat => stat.stat.name).join(', ')}</p>
          <p><strong>Abilities:</strong> {abilities.map(ability => ability.ability.name).join(', ')}</p>
          <p><strong>Some Moves:</strong> {moves.slice(0, 5).map(move => move.move.name).join(', ')}</p>
        </div>
      </div>
    </div>
  );
};

export default PokemonDetails;
