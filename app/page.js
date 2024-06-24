'use client';

import React, { useEffect, useState } from 'react';
import SearchForm from '@/components/SearchForm';
import PokemonCard from '@/components/PokemonCard';

export default function Home() {
  const [pokemonList, setPokemonList] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({ selectedType: '', searchTerm: '' });

  const loadMorePokemon = async (reset = false) => {
    if (loading) return; // Prevent multiple simultaneous fetches
    setLoading(true);

    try {
      const currentOffset = reset ? 0 : offset;
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${currentOffset}&limit=20`);
      const data = await res.json();

      const pokemonDetails = await Promise.all(
        data.results.map(async (pokemon) => {
          const pokemonRes = await fetch(pokemon.url);
          const pokemonData = await pokemonRes.json();
          return {
            name: pokemon.name,
            imageUrl: pokemonData.sprites.other['official-artwork'].front_default,
            types: pokemonData.types.map((typeInfo) => typeInfo.type.name),
          };
        })
      );

      setPokemonList((prevList) => reset ? pokemonDetails : [...prevList, ...pokemonDetails]);
      setOffset(currentOffset + 20);
      if (!data.next) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    } catch (error) {
      console.error('Error fetching Pokémon:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilteredPokemon = async (type, searchTerm) => {
    setLoading(true);
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=1000`);
      const data = await res.json();

      const allPokemon = await Promise.all(
        data.results.map(async (pokemon) => {
          const pokemonRes = await fetch(pokemon.url);
          const pokemonData = await pokemonRes.json();
          return {
            name: pokemon.name,
            imageUrl: pokemonData.sprites.other['official-artwork'].front_default,
            types: pokemonData.types.map((typeInfo) => typeInfo.type.name),
          };
        })
      );

      let filteredPokemon = allPokemon;

      if (type) {
        filteredPokemon = filteredPokemon.filter((pokemon) => pokemon.types.includes(type));
      }

      if (searchTerm) {
        filteredPokemon = filteredPokemon.filter((pokemon) =>
          pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setPokemonList(filteredPokemon);
      setOffset(0);
      setHasMore(false); // Disable infinite scrolling for filtered results
    } catch (error) {
      console.error('Error fetching Pokémon:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMorePokemon();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || loading || !hasMore) {
        return;
      }
      loadMorePokemon();
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore]);

  useEffect(() => {
    if (filters.selectedType || filters.searchTerm) {
      fetchFilteredPokemon(filters.selectedType, filters.searchTerm);
    } else {
      loadMorePokemon(true);
    }
  }, [filters]);

  const handleSearch = (searchParams) => {
    setFilters(searchParams);
  };

  return (
    <div className="flex flex-col px-2 py-2 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Pokémon Search</h1>
      <SearchForm onSearch={handleSearch} />
      <div className="flex flex-col items-center px-2 py-4 bg-gray-50">
        <h1 className="text-3xl font-bold mb-6">Pokémon Cards</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pokemonList.map((pokemon, index) => (
            <PokemonCard key={`${pokemon.name}-${index}`} name={pokemon.name} imageUrl={pokemon.imageUrl} />
          ))}
        </div>
        {loading && <div className="flex items-center justify-center mt-6">Loading...</div>}
      </div>
    </div>
  );
}