'use client';

import React, { useEffect, useState } from 'react';

const SearchForm = ({ onSearch }) => {
    const [types, setTypes] = useState([]);
    const [selectedType, setSelectedType] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchTypes = async () => {
            try {
                const res = await fetch('https://pokeapi.co/api/v2/type');
                const data = await res.json();
                setTypes(data.results);
            } catch (error) {
                console.error('Error fetching Pokémon types:', error);
            }
        };

        fetchTypes();
    }, []);

    const handleSelectChange = (event) => {
        setSelectedType(event.target.value);
    };

    const handleInputChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onSearch({ selectedType, searchTerm });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-gray-100 rounded-lg w-2/3">
            <div className="flex">
                <select
                    value={selectedType}
                    onChange={handleSelectChange}
                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
                >
                    <option value="" disabled>
                        Select Type
                    </option>
                    {types.map((type) => (
                        <option key={type.name} value={type.name}>
                            {type.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="flex">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleInputChange}
                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-l-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 flex-1"
                    placeholder="Search Pokémon"
                />
                <button
                    type="submit"
                    className="bg-blue-900 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r-lg"
                >
                    Search
                </button>
            </div>
        </form>
    );
};

export default SearchForm;
