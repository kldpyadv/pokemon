import Link from 'next/link';

const PokemonCard = ({ name, imageUrl }) => {
    return (
        <div className="w-64 rounded overflow-hidden shadow-lg bg-gray-100">
            <div className="h-44 bg-white flex items-center justify-center">
                <img className="w-36" src={imageUrl} alt={name} />
            </div>
            <div className="px-6 py-4">
                <div className="font-semibold text-lg mb-2">{name}</div>
            </div>
            <div className="px-6 pt-4 pb-2" >
                <Link href={`/pokemon/${name}`} className="text-blue-500">
                    Details →
                </Link>
            </div>
        </div>
    );
};

export default PokemonCard;
