import React, { memo } from "react";
import Link from "next/link";
import { MapPin, Bookmark } from "lucide-react";

// Currency mapping for some common countries
const currencyMap = {
  KE: { code: "KES", symbol: "Ksh" },
  US: { code: "USD", symbol: "$" },
  GB: { code: "GBP", symbol: "£" },
  NG: { code: "NGN", symbol: "₦" },
  ZA: { code: "ZAR", symbol: "R" },
  EU: { code: "EUR", symbol: "€" },
  // Add more as needed
};

function getUserCurrency() {
  const locale = navigator.language || "en-US";
  const country = locale.split("-")[1] || "US";
  return currencyMap[country] || { code: "USD", symbol: "$" };
}

function formatPrice(price, currencyCode, locale) {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currencyCode,
      maximumFractionDigits: 0,
    }).format(price);
  } catch {
    return `${currencyCode} ${price}`;
  }
}

const PropertyCard = memo(({ property, onBookmarkToggle }) => {
  const {
    id,
    title,
    price,
    location,
    image,
    isBookmarked,
    type,
    nights, // optional, for BnB multi-night stays
  } = property;

  const locale = navigator.language || "en-US";
  const { code: currencyCode, symbol } = getUserCurrency();
  const formattedPrice = formatPrice(price, currencyCode, locale);

  // BnB price text
  let priceText = formattedPrice;
  if (type === "bnb") {
    if (nights && nights > 1) {
      priceText = `${symbol}${price.toLocaleString()} for ${nights} days`;
    } else {
      priceText = `${symbol}${price.toLocaleString()} per night`;
    }
  }

  // Property type status labels with colors
  const getStatusLabel = (type) => {
    const statusMap = {
      apartment: { label: "For Rent", color: "from-[#009688] to-[#00bcd4]" },
      house: { label: "For Sale", color: "from-[#009688] to-[#33bbaa]" },
      townhouse: { label: "For Sale", color: "from-[#009688] to-[#33bbaa]" },
      condo: { label: "For Sale", color: "from-[#009688] to-[#33bbaa]" },
      bnb: {
        label: "BnB - Contact Only",
        color: "from-[#00acc1] to-[#26c6da]",
      },
      commercial: { label: "For Lease", color: "from-[#00838f] to-[#0097a7]" },
      land: { label: "For Sale", color: "from-[#004d40] to-[#00695c]" },
      loft: { label: "For Rent", color: "from-[#009688] to-[#00bcd4]" },
    };
    return (
      statusMap[type] || {
        label: "Available",
        color: "from-[#009688] to-[#33bbaa]",
      }
    );
  };

  const statusInfo = getStatusLabel(type);

  return (
    <div className="group bg-gradient-to-br from-white via-gray-50/30 to-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 ease-out border border-gray-200/50 backdrop-blur-sm hover:border-[#009688]/20">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Link href={`/property/${id}`} className="block">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            loading="lazy"
            decoding="async"
          />
        </Link>

        {/* Property Status Overlay */}
        <div
          className={`absolute top-3 left-3 px-3 py-1.5 bg-gradient-to-r ${statusInfo.color} text-white text-xs font-semibold rounded-full shadow-lg backdrop-blur-sm`}
        >
          {statusInfo.label}
        </div>

        {/* Bookmark Button */}
        <button
          className="absolute top-3 right-3 p-2 rounded-full bg-white/95 backdrop-blur-sm hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onBookmarkToggle?.(id);
          }}
        >
          <Bookmark
            className={`h-4 w-4 transition-colors duration-300 ${
              isBookmarked
                ? "fill-[#009688] text-[#009688]"
                : "text-gray-400 hover:text-[#009688]"
            }`}
          />
        </button>

        {/* Gradient Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>

      <div className="p-4 bg-gradient-to-br from-white to-gray-50/50">
        <Link href={`/property/${id}`} className="block">
          <h3 className="text-base font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-[#009688] transition-colors duration-300">
            {title}
          </h3>

          <p className="text-sm text-gray-600 mb-3 flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-[#009688] flex-shrink-0" />
            <span className="line-clamp-1">{location}</span>
          </p>

          <div className="flex items-center justify-between mb-4">
            <p className="text-lg font-bold bg-gradient-to-r from-[#009688] to-[#33bbaa] bg-clip-text text-transparent">
              {type === "bnb" ? priceText : formattedPrice}
            </p>
          </div>
        </Link>
        <Link href={`/property/${id}`} className="block">
          <button className="w-full bg-gradient-to-r from-[#009688] to-[#33bbaa] text-white py-3 px-4 rounded-xl hover:from-[#00796b] hover:to-[#26a69a] transition-all duration-300 text-sm font-semibold shadow-md hover:shadow-lg transform hover:scale-[1.02]">
            View Details
          </button>
        </Link>
      </div>
    </div>
  );
});

PropertyCard.displayName = "PropertyCard";

export default PropertyCard;
