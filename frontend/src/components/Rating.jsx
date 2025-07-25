import { FaStar } from 'react-icons/fa';

export default function Rating({ value, onChange, readOnly = false, showDeleteHint = false }) {
  const stars = Array(5).fill(0);
  
  return (
    <div className="flex items-center space-x-2">
      <div className="flex">
        {stars.map((_, i) => {
          const ratingValue = i + 1;
          return (
            <label key={i} className="cursor-pointer">
              <input
                type="radio"
                name="rating"
                value={ratingValue}
                onClick={() => !readOnly && onChange(ratingValue)}
                className="hidden"
              />
              <FaStar
                color={ratingValue <= value ? '#ffc107' : '#e4e5e9'}
                size={20}
                className="transition-colors duration-200"
              />
            </label>
          );
        })}
      </div>
      {showDeleteHint && value === 1 && (
        <span className="text-xs text-red-600 font-medium">
          (1 star = delete)
        </span>
      )}
    </div>
  );
}