"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Calendar, MapPin, Hotel } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { useLanguage } from "@/components/language-provider";
import { useCities } from "@/context/CityContext";
import { tunisiaRegions } from "@/lib/constant";
import { Input } from "@/components/ui/input";

export default function SearchBar() {
  const { t } = useLanguage();

  const router = useRouter();
  const { cities, loading: citiesLoading } = useCities();
  const [searchType, setSearchType] = useState<
    "hotel" | "tours" | "tickets" | "transfer"
  >("hotel");

  const handleSearchNavigation = (params: any) => {
    let path = "";
    const query: any = { ...params };

    // Format any date objects or ISO strings to YYYY-MM-DD for consistency
    Object.keys(query).forEach((key) => {
      if (query[key] && (key.toLowerCase().includes("date") || key === "checkIn" || key === "checkOut")) {
        try {
          const date = new Date(query[key]);
          if (!isNaN(date.getTime())) {
            query[key] = date.toISOString().split("T")[0];
          }
        } catch (e) {
          // Keep as is if not a valid date
        }
      }
    });

    switch (searchType) {
      case "hotel":
        path = "/hotels";
        break;

      case "tours":
        const tourSubPath = params.subType || "cultural";
        path = `/tours/${tourSubPath}`;
        delete query.subType;
        break;

      case "tickets":
        if (params.type === "ferry") {
          path = "/ferry";
        } else {
          path = "/flights";
        }
        break;

      case "transfer":
        path = "/transfer";
        if (params.pickup) {
          query.from = params.pickup;
          delete query.pickup;
        }
        break;

      default:
        path = "/";
    }

    // Clean up empty params
    Object.keys(query).forEach(key => {
      if (query[key] === undefined || query[key] === null || query[key] === "") {
        delete query[key];
      }
    });

    const queryString = new URLSearchParams(query).toString();
    router.push(queryString ? `${path}?${queryString}` : path);
  };

  return (
    <section className="py-8 container -mt-20 relative z-10">
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 max-w-6xl mx-auto">
        <Tabs
          value={searchType}
          onValueChange={(val: any) => setSearchType(val)}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 md:grid-cols-4 bg-lta-purple/5 p-1 rounded-xl w-full mb-6">
            <TabsTrigger
              value="hotel"
              className="flex items-center gap-2 justify-center py-3 rounded-lg data-[state=active]:bg-lta-purple data-[state=active]:text-white transition-all duration-300"
            >
              <Hotel className="w-4 h-4" />
              <span className="truncate font-bold tracking-tight text-xs md:text-sm">{t.navbar.hotels}</span>
            </TabsTrigger>
            <TabsTrigger
              value="tours"
              className="flex items-center gap-2 justify-center py-3 rounded-lg data-[state=active]:bg-lta-purple data-[state=active]:text-white transition-all duration-300"
            >
              <Compass className="w-4 h-4" />
              <span className="truncate font-bold tracking-tight text-xs md:text-sm">{t.navbar.tours}</span>
            </TabsTrigger>
            <TabsTrigger
              value="tickets"
              className="flex items-center gap-2 justify-center py-3 rounded-lg data-[state=active]:bg-lta-purple data-[state=active]:text-white transition-all duration-300"
            >
              <Search className="w-4 h-4" />
              <span className="truncate font-bold tracking-tight text-xs md:text-sm">{t.navbar.tickets}</span>
            </TabsTrigger>
            <TabsTrigger
              value="transfer"
              className="flex items-center gap-2 justify-center py-3 rounded-lg data-[state=active]:bg-lta-purple data-[state=active]:text-white transition-all duration-300"
            >
              <Truck className="w-4 h-4" />
              <span className="truncate font-bold tracking-tight text-xs md:text-sm">{t.navbar.transfer}</span>
            </TabsTrigger>
          </TabsList>

          {searchType === "hotel" && (
            <HotelSearchSection
              cities={cities}
              loading={citiesLoading}
              onSearch={handleSearchNavigation}
              t={t}
            />
          )}
          {searchType === "tours" && (
            <TourSearchSection
              onSearch={handleSearchNavigation}
              t={t}
            />
          )}
          {searchType === "tickets" && (
            <TicketSearchSection
              onSearch={handleSearchNavigation}
              t={t}
            />
          )}
          {searchType === "transfer" && (
            <TransferSearchSection
              onSearch={handleSearchNavigation}
              t={t}
            />
          )}
        </Tabs>
      </div>
    </section>
  );
}

function TourSearchSection({ onSearch, t }: { onSearch: any; t: any }) {
  const [tourType, setTourType] = useState("cultural");
  const [date, setDate] = useState<Date>();

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="space-y-1.5 md:col-span-2">
        <label className="text-sm font-medium block">Tour Type</label>
        <Select value={tourType} onValueChange={setTourType}>
          <SelectTrigger className="h-11">
            <SelectValue placeholder="Select tour type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cultural">{t.tours.cultural}</SelectItem>
            <SelectItem value="adventure">{t.tours.adventure}</SelectItem>
            <SelectItem value="beach">{t.tours.beach}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <DatePicker label="Preferred Date" date={date} setDate={setDate} t={t} />
      <div className="flex items-end">
        <Button
          size="lg"
          className="bg-lta-purple w-full hover:bg-lta-purple-light shadow-lg rounded-xl font-bold uppercase tracking-wider"
          onClick={() => onSearch({ subType: tourType, date: date?.toISOString() || "" })}
        >
          <Search className="mr-2 h-4 w-4" />
          <span className="truncate">{t.general.search}</span>
        </Button>
      </div>
    </div>
  );
}

function TicketSearchSection({ onSearch, t }: { onSearch: any; t: any }) {
  const [type, setType] = useState("flights");
  const [date, setDate] = useState<Date>();

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="space-y-1.5 md:col-span-2">
        <label className="text-sm font-medium block">Ticket Type</label>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="h-11">
            <SelectValue placeholder="Select ticket type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="flights">{t.tickets.flights}</SelectItem>
            <SelectItem value="ferry">{t.tickets.ferry}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <DatePicker label="Departure Date" date={date} setDate={setDate} t={t} />
      <div className="flex items-end">
        <Button
          size="lg"
          className="bg-lta-purple w-full hover:bg-lta-purple-light shadow-lg rounded-xl font-bold uppercase tracking-wider"
          onClick={() => onSearch({ type, date: date?.toISOString() || "" })}
        >
          <Search className="mr-2 h-4 w-4" />
          <span className="truncate">{t.general.search}</span>
        </Button>
      </div>
    </div>
  );
}

function TransferSearchSection({ onSearch, t }: { onSearch: any; t: any }) {
  const [pickup, setPickup] = useState("");
  const [date, setDate] = useState<Date>();

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="space-y-1.5 md:col-span-2">
        <label className="text-sm font-medium block">Pickup Point</label>
        <Input
          placeholder="Airport, Hotel, or Address"
          value={pickup}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPickup(e.target.value)}
          className="h-11"
        />
      </div>
      <DatePicker label="Transfer Date" date={date} setDate={setDate} t={t} />
      <div className="flex items-end">
        <Button
          size="lg"
          className="bg-lta-purple w-full hover:bg-lta-purple-light shadow-lg rounded-xl font-bold uppercase tracking-wider"
          onClick={() => onSearch({ pickup, date: date?.toISOString() || "" })}
        >
          <Search className="mr-2 h-4 w-4" />
          <span className="truncate">{t.general.search}</span>
        </Button>
      </div>
    </div>
  );
}

function Star(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function Compass(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  );
}

function Truck(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 17h4V5H2v12h3m0 0a2 2 0 1 0 4 0m-4 0a2 2 0 1 1 4 0m9-4h3a2 2 0 0 1 2 2v3m-2 0a2 2 0 1 0 4 0m-4 0a2 2 0 1 1 4 0" /><path d="M14 9h8v4h-8z" />
    </svg>
  );
}

function HotelSearchSection({ cities, loading, onSearch, t }: { cities: any[]; loading: boolean; onSearch: any; t: any }) {
  const [cityId, setCityId] = useState<string>();
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();

  const handleSearch = () => {
    onSearch({
      cityId: cityId || "",
      checkIn: checkIn?.toISOString() || "",
      checkOut: checkOut?.toISOString() || "",
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-3 md:gap-4">
      <div className="space-y-1.5 col-span-1 md:col-span-2">
        <label className="text-sm font-medium block">
          {t.hotelSearchPage.selectDestination}
        </label>
        <Select value={cityId} onValueChange={setCityId} disabled={loading}>
          <SelectTrigger className="h-11">
            <SelectValue placeholder={t.hotelSearchPage.selectDestination} />
          </SelectTrigger>
          <SelectContent>
            {cities?.map((city: any) => (
              <SelectItem key={city.Id} value={city.Id?.toString()}>
                {city.Name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DatePicker
        label={t.hotelSearchPage.checkInDate}
        date={checkIn}
        setDate={setCheckIn}
        t={t}
      />

      <DatePicker
        label={t.hotelSearchPage.checkOutDate}
        date={checkOut}
        setDate={setCheckOut}
        t={t}
      />

      <div className="flex items-end">
        <Button
          size="lg"
          className="bg-lta-purple hover:bg-lta-purple-light shadow-lg shadow-lta-purple/20 transition-all duration-300 rounded-xl font-bold uppercase tracking-wider"
          onClick={handleSearch}
        >
          <Search className="mr-2 h-4 w-4" />
          <span className="truncate">{t.general.search}</span>
        </Button>
      </div>
    </div>
  );
}


function DatePicker({ label, date, setDate, t }: { label: string; date?: Date; setDate: any; t: any }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium block">{label}</label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal h-11 truncate"
          >
            <Calendar className="mr-2 h-4 w-4 flex-shrink-0" />
            <span className="truncate">
              {date ? format(date, "PPP") : t.hotelSearchPage.selectDate}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <CalendarComponent
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
