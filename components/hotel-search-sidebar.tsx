"use client";

import { useState } from "react";
import {
  CalendarIcon,
  MapPin,
  Users,
  Plus,
  Minus,
  X,
  Search,
  Tag,
  Grid3X3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { SearchDetails } from "@/lib/types";
import { useCities } from "@/context/CityContext";
// import { useTags } from "@/context/TagContext";
// import { useCategorys } from "@/context/CategoryContext";
import { useLanguage } from "./language-provider";

interface HotelSearchSidebarProps {
  initialSearch: SearchDetails;
  onSearch: (searchDetails: SearchDetails) => void;
}

export default function HotelSearchSidebar({
  initialSearch,
  onSearch,
}: HotelSearchSidebarProps) {
  const { t } = useLanguage();
  const [searchDetails, setSearchDetails] =
    useState<SearchDetails>(initialSearch);
  const [checkInDate, setCheckInDate] = useState<Date | undefined>(
    initialSearch.BookingDetails.CheckIn
      ? new Date(initialSearch.BookingDetails.CheckIn)
      : undefined
  );
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(
    initialSearch.BookingDetails.CheckOut
      ? new Date(initialSearch.BookingDetails.CheckOut)
      : undefined
  );
  const { cities, loading: citiesLoading } = useCities();
  // const { tags, loading: tagsLoading } = useTags();
  // const { categories, loading: categoriesLoading } = useCategorys();

  const handleCheckInSelect = (date: Date | undefined) => {
    setCheckInDate(date);
    if (date) {
      setSearchDetails({
        ...searchDetails,
        BookingDetails: {
          ...searchDetails.BookingDetails,
          CheckIn: date.toISOString().split("T")[0],
        },
      });

      // If checkout date is before check-in date, update it
      if (checkOutDate && date > checkOutDate) {
        const newCheckOut = new Date(date);
        newCheckOut.setDate(date.getDate() + 3);
        setCheckOutDate(newCheckOut);
        setSearchDetails((prev) => ({
          ...prev,
          BookingDetails: {
            ...prev.BookingDetails,
            CheckOut: newCheckOut.toISOString().split("T")[0],
          },
        }));
      }
    }
  };

  const handleCheckOutSelect = (date: Date | undefined) => {
    setCheckOutDate(date);
    if (date) {
      setSearchDetails({
        ...searchDetails,
        BookingDetails: {
          ...searchDetails.BookingDetails,
          CheckOut: date.toISOString().split("T")[0],
        },
      });
    }
  };

  const handleCityChange = (cityId: string) => {
    setSearchDetails({
      ...searchDetails,
      BookingDetails: {
        ...searchDetails.BookingDetails,
        City: Number(cityId),
      },
    });
  };

  // const handleTagToggle = (tagId: string) => {
  //   const currentTags = searchDetails.Filters.Tags || [];
  //   const newTags = currentTags.includes(tagId)
  //     ? currentTags.filter((id) => id !== tagId)
  //     : [...currentTags, tagId];

  //   setSearchDetails({
  //     ...searchDetails,
  //     Filters: {
  //       ...searchDetails.Filters,
  //       Tags: newTags,
  //     },
  //   });
  // };

  // const handleCategoryToggle = (categoryId: string) => {
  //   const currentCategories = searchDetails.Filters.Category || [];
  //   const newCategories = currentCategories.includes(categoryId)
  //     ? currentCategories.filter((id) => id !== categoryId)
  //     : [...currentCategories, categoryId];

  //   setSearchDetails({
  //     ...searchDetails,
  //     Filters: {
  //       ...searchDetails.Filters,
  //       Category: newCategories,
  //     },
  //   });
  // };

  const addRoom = () => {
    setSearchDetails({
      ...searchDetails,
      Rooms: [...searchDetails.Rooms, { Adult: 1 }],
    });
  };

  const removeRoom = (index: number) => {
    if (searchDetails.Rooms.length > 1) {
      setSearchDetails({
        ...searchDetails,
        Rooms: searchDetails.Rooms.filter((_, i) => i !== index),
      });
    }
  };

  const updateRoomAdults = (index: number, value: number) => {
    const updatedRooms = [...searchDetails.Rooms];
    updatedRooms[index] = {
      ...updatedRooms[index],
      Adult: Math.max(1, value),
    };
    setSearchDetails({
      ...searchDetails,
      Rooms: updatedRooms,
    });
  };

  const addChild = (roomIndex: number) => {
    const updatedRooms = [...searchDetails.Rooms];
    const currentRoom = updatedRooms[roomIndex];

    updatedRooms[roomIndex] = {
      ...currentRoom,
      Child: [...(currentRoom.Child || []), 0],
    };

    setSearchDetails({
      ...searchDetails,
      Rooms: updatedRooms,
    });
  };

  const removeChild = (roomIndex: number, childIndex: number) => {
    const updatedRooms = [...searchDetails.Rooms];
    const currentRoom = updatedRooms[roomIndex];

    if (currentRoom.Child) {
      updatedRooms[roomIndex] = {
        ...currentRoom,
        Child: currentRoom.Child.filter((_, i) => i !== childIndex),
      };

      // If no children left, remove the Child property
      if (updatedRooms[roomIndex].Child?.length === 0) {
        delete updatedRooms[roomIndex].Child;
      }

      setSearchDetails({
        ...searchDetails,
        Rooms: updatedRooms,
      });
    }
  };

  const updateChildAge = (
    roomIndex: number,
    childIndex: number,
    age: number
  ) => {
    const updatedRooms = [...searchDetails.Rooms];
    const currentRoom = updatedRooms[roomIndex];

    if (currentRoom.Child) {
      const updatedChildren = [...currentRoom.Child];
      updatedChildren[childIndex] = age;

      updatedRooms[roomIndex] = {
        ...currentRoom,
        Child: updatedChildren,
      };

      setSearchDetails({
        ...searchDetails,
        Rooms: updatedRooms,
      });
    }
  };

  const handleSearch = () => {
    console.log(searchDetails);
    onSearch(searchDetails);
  };

  const resetFilters = () => {
    const resetSearchDetails = {
      ...searchDetails,
      Filters: {
        Keywords: "",
        Category: [],
        OnlyAvailable: true,
        Tags: [],
      },
    };
    setSearchDetails(resetSearchDetails);
    onSearch(resetSearchDetails);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b">
        <div className="p-3 md:p-4">
          <h2 className="text-lg md:text-xl font-bold mb-1 md:mb-2">
            {t.hotelSearchPage.filtersAndSearch}
          </h2>
          <p className="text-xs md:text-sm text-muted-foreground">
            {t.hotelSearchPage.findYourPerfectStay}
          </p>
        </div>
        <div className="px-3 md:px-4 pb-3 md:pb-4">
          <Input
            placeholder={t.hotelSearchPage.searchPlaceholder}
            value={searchDetails.Filters.Keywords || ""}
            onChange={(e) =>
              setSearchDetails({
                ...searchDetails,
                Filters: {
                  ...searchDetails.Filters,
                  Keywords: e.target.value,
                },
              })
            }
          />
        </div>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto p-3 md:p-4">
        {/* Dates */}
        <div className="border-b p-3 md:p-4">
          <h3 className="text-sm font-medium mb-2 md:mb-3">
            {t.hotelSearchPage.dates}
          </h3>
          <div className="space-y-3 md:space-y-4">
            <div className="space-y-2">
              <Label htmlFor="check-in"> {t.hotelSearchPage.checkInDate}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="check-in"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !checkInDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {checkInDate ? (
                      format(checkInDate, "PPP")
                    ) : (
                      <span> {t.hotelSearchPage.selectDate}</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={checkInDate}
                    onSelect={handleCheckInSelect}
                    initialFocus
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="check-out">
                {" "}
                {t.hotelSearchPage.checkOutDate}
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="check-out"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !checkOutDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {checkOutDate ? (
                      format(checkOutDate, "PPP")
                    ) : (
                      <span> {t.hotelSearchPage.selectDate}</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={checkOutDate}
                    onSelect={handleCheckOutSelect}
                    initialFocus
                    disabled={(date) => date < (checkInDate || new Date())}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        {/* City */}
        <div className="border-b p-3 md:p-4">
          <h3 className="text-sm font-medium mb-2 md:mb-3 flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            {t.hotelSearchPage.destination}
          </h3>
          <div>
            <Select
              value={searchDetails.BookingDetails.City?.toString() || ""}
              onValueChange={handleCityChange}
            >
              <SelectTrigger id="destination" className="w-full">
                <SelectValue placeholder={t.hotelSearchPage.selectDestination}>
                  {citiesLoading
                    ? "Loading cities..."
                    : searchDetails.BookingDetails.City
                      ? cities.find(
                        (city) =>
                          city.Id?.toString() ===
                          searchDetails.BookingDetails.City?.toString()
                      )?.Name || "Select destination1"
                      : "Select destination"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {citiesLoading ? (
                  <SelectItem value="loading" disabled>
                    {t.hotelSearchPage.loadingCities}
                  </SelectItem>
                ) : (
                  cities.map((city) => (
                    <SelectItem
                      key={city.Id}
                      value={city?.Id?.toString() || "10"}
                    >
                      {city.Name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Room Configuration */}
        <div className="border-b p-3 md:p-4">
          <h3 className="text-sm font-medium mb-2 md:mb-3 flex items-center">
            <Users className="h-4 w-4 mr-2" />
            {t.hotelSearchPage.roomsAndGuests}
          </h3>
          <div>
            <Accordion type="multiple" className="w-full">
              {searchDetails.Rooms.map((room, roomIndex) => (
                <AccordionItem key={roomIndex} value={`room-${roomIndex}`}>
                  <AccordionTrigger className="py-2">
                    <div className="flex justify-between items-center w-full pr-4">
                      <span>
                        {t.hotelSearchPage.room} {roomIndex + 1}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {room.Adult}{" "}
                        {room.Adult === 1
                          ? t.hotelSearchPage.adult
                          : t.hotelSearchPage.adults}
                        {room.Child &&
                          room.Child.length > 0 &&
                          `, ${room.Child.length} ${room.Child.length === 1 ? "child" : "children"
                          }`}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      {/* Adults */}
                      <div>
                        <Label className="mb-2 block">
                          {" "}
                          {t.hotelSearchPage.adults}
                        </Label>
                        <div className="flex items-center">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() =>
                              updateRoomAdults(roomIndex, room.Adult - 1)
                            }
                            disabled={room.Adult <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="mx-4 min-w-[2rem] text-center">
                            {room.Adult}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() =>
                              updateRoomAdults(roomIndex, room.Adult + 1)
                            }
                            disabled={room.Adult >= 4}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Children */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <Label> {t.hotelSearchPage.children}</Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 text-xs"
                            onClick={() => addChild(roomIndex)}
                          >
                            {t.hotelSearchPage.addChild}
                          </Button>
                        </div>

                        {room.Child && room.Child.length > 0 ? (
                          <div className="space-y-2">
                            {room.Child.map((age, childIndex) => (
                              <div
                                key={childIndex}
                                className="flex items-center gap-2"
                              >
                                <Select
                                  value={age.toString()}
                                  onValueChange={(value) =>
                                    updateChildAge(
                                      roomIndex,
                                      childIndex,
                                      Number.parseInt(value)
                                    )
                                  }
                                >
                                  <SelectTrigger className="flex-1">
                                    <SelectValue placeholder="Age">
                                      {age === 0
                                        ? t?.hotelSearchPage?.selectAge
                                        : `${age} years old`}
                                    </SelectValue>
                                  </SelectTrigger>
                                  <SelectContent>
                                    {Array.from(
                                      { length: 18 },
                                      (_, i) => i
                                    ).map((age) => (
                                      <SelectItem
                                        key={age}
                                        value={age.toString()}
                                      >
                                        {age === 0
                                          ? t.hotelSearchPage.lessThanOneYear
                                          : `${age} years old`}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() =>
                                    removeChild(roomIndex, childIndex)
                                  }
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-sm text-muted-foreground">
                            {t.hotelSearchPage.noChildren}
                          </div>
                        )}
                      </div>

                      {/* Room actions */}
                      {searchDetails.Rooms.length > 1 && (
                        <Button
                          variant="destructive"
                          size="sm"
                          className="w-full mt-2"
                          onClick={() => removeRoom(roomIndex)}
                        >
                          {t.hotelSearchPage.removeRoom}
                        </Button>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <Button
              variant="outline"
              size="sm"
              className="w-full mt-4"
              onClick={addRoom}
            >
              <Plus className="h-4 w-4 mr-2" /> {t.hotelSearchPage.addRoom}
            </Button>
          </div>
        </div>

        {/* Categories
        <div className="border-b p-3 md:p-4">
          <h3 className="text-sm font-medium mb-2 md:mb-3 flex items-center">
            <Grid3X3 className="h-4 w-4 mr-2" />
            {t.hotelSearchPage.hotelCategories}
          </h3>
          <div className="space-y-2">
            {categoriesLoading ? (
              <div className="text-sm text-muted-foreground">
                {t.hotelSearchPage.loadingCategories}
              </div>
            ) : (
              categories.map((category) => (
                <div key={category.Id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category.Id}`}
                    checked={searchDetails.Filters.Category.includes(
                      category.Id
                    )}
                    onCheckedChange={() => handleCategoryToggle(category.Id)}
                  />
                  <Label
                    htmlFor={`category-${category.Id}`}
                    className="flex items-center"
                  >
                    {category.Title}
                    {category.Star && (
                      <span className="ml-2 flex">
                        {Array.from({ length: category.Star }).map((_, i) => (
                          <span key={i} className="text-yellow-400">
                            ★
                          </span>
                        ))}
                      </span>
                    )}
                  </Label>
                </div>
              ))
            )}
          </div>
        </div>

       Tags 
        <div className="border-b p-3 md:p-4">
          <h3 className="text-sm font-medium mb-2 md:mb-3 flex items-center">
            <Tag className="h-4 w-4 mr-2" />
            {t.hotelSearchPage.tags}
          </h3>
          <div>
            {tagsLoading ? (
              <div className="text-sm text-muted-foreground">
                {t.hotelSearchPage.loadingTags}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => {
                  const isSelected = searchDetails.Filters.Tags?.includes(
                    tag.Id
                  );
                  return (
                    <Badge
                      key={tag.Id}
                      variant={isSelected ? "default" : "outline"}
                      className={cn(
                        "cursor-pointer",
                        isSelected ? "bg-lta-purple" : ""
                      )}
                      onClick={() => handleTagToggle(tag.Id)}
                    >
                      {tag.Title}
                    </Badge>
                  );
                })}
              </div>
            )}
          </div>
        </div> */}

        {/* Additional Options */}
        <div className="p-3 md:p-4">
          <h3 className="text-sm font-medium mb-2 md:mb-3">
            {t.hotelSearchPage.additionalOptions}
          </h3>
          <div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="available"
                checked={searchDetails.Filters.OnlyAvailable}
                onCheckedChange={(checked) => {
                  setSearchDetails({
                    ...searchDetails,
                    Filters: {
                      ...searchDetails.Filters,
                      OnlyAvailable: !!checked,
                    },
                  });
                }}
              />
              <Label htmlFor="available">
                {" "}
                {t.hotelSearchPage.showOnlyAvailableHotels}
              </Label>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t p-3 md:p-4 bg-white sticky bottom-0 z-10">
        <div className="space-y-2">
          <Button
            className="w-full bg-lta-purple hover:bg-lta-purple/90"
            onClick={handleSearch}
          >
            <Search className="h-4 w-4 mr-2" />
            {t.hotelSearchPage.searchHotels}
          </Button>
          <Button variant="outline" className="w-full" onClick={resetFilters}>
            {t.hotelSearchPage.resetFilters}
          </Button>
        </div>
      </div>
    </div>
  );
}
