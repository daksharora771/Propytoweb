"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle, Circle } from "lucide-react";
import { toast } from "react-hot-toast";

const userName = "Meet Mangukiya";

const steps = [
  { label: "Basic Details" },
  { label: "Location Details" },
  { label: "Property Profile" },
  { label: "Photos, Videos" },
  { label: "Pricing & Others" },
];

const residential = [
  "Flat/Apartment",
  "Independent House / Villa",
  "Independent / Builder Floor",
  "Plot / Land",
  "1 RK/ Studio Apartment",
  "Serviced Apartment",
  "Farmhouse",
  "Other",
];

const commercial = [
  "Office",
  "Retail",
  "Plot / Land",
  "Storage",
  "Industry",
  "Hospitality",
  "Other",
];

const SellFormPage = () => {
    
  const [currentStep, setCurrentStep] = useState(0);
  const [propertyScore, setPropertyScore] = useState(20);

  const [lookingFor, setLookingFor] = useState("Sell");
  const [selectedType, setSelectedType] = useState("Residential");
  const [categoryList, setCategoryList] = useState(residential);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [extraOptions, setExtraOptions] = useState<string[]>([]);
  const [selectedExtraOption, setSelectedExtraOption] = useState<string | null>(
    null
  );

  const [selectedCity, setSelectedCity] = useState("");
  const [selectedLocality, setSelectedLocality] = useState("");
  const [selectedSubLocality, setSelectedSubLocality] = useState("");

  // Step 3 related states
  const [bedrooms, setBedrooms] = useState<number | null>(null);
  const [bathrooms, setBathrooms] = useState<number | null>(null);
  const [balconies, setBalconies] = useState<number | null>(null);

  const [areaType, setAreaType] = useState<string>("Carpet Area");
  const [areaValue, setAreaValue] = useState<string>("");

  const [addedAreas, setAddedAreas] = useState<string[]>([]);

  const [selectedOtherRooms, setSelectedOtherRooms] = useState<string[]>([]);
  const [furnishing, setFurnishing] = useState<string | null>(null);

  const [coveredParking, setCoveredParking] = useState<number>(0);
  const [openParking, setOpenParking] = useState<number>(0);

  const [totalFloors, setTotalFloors] = useState<string>("");
  const [floorOn, setFloorOn] = useState<string>("");

  const [availabilityStatus, setAvailabilityStatus] = useState<string | null>(
    null
  );

  const [ownership, setOwnership] = useState<string | null>(null);
  const [expectedPrice, setExpectedPrice] = useState<string>("");
  const [pricePerSqft, setPricePerSqft] = useState<string>("");
  const [isAllInclusive, setIsAllInclusive] = useState<boolean>(false);
  const [isTaxExcluded, setIsTaxExcluded] = useState<boolean>(false);
  const [isNegotiable, setIsNegotiable] = useState<boolean>(false);
  const [propertyDescription, setPropertyDescription] = useState<string>("");


  useEffect(() => {
    setPropertyScore(((currentStep + 1) / steps.length) * 100);
  }, [currentStep]);

  useEffect(() => {
    if (selectedType === "Residential") {
      setCategoryList(
        lookingFor === "Rent / Lease"
          ? residential.filter((item) => item !== "Plot / Land")
          : residential
      );
    } else {
      setCategoryList(commercial);
    }
    setSelectedCategory(null);
    setExtraOptions([]);
    setSelectedExtraOption(null);
  }, [selectedType, lookingFor]);

//   useEffect(() => {
//     if (selectedCategory && propertyOptions[selectedCategory]) {
//       setExtraOptions(propertyOptions[selectedCategory]);
//     } else {
//       setExtraOptions([]);
//     }
//     setSelectedExtraOption(null);
//   }, [selectedCategory]);

  const isContinueDisabled = () => {
    if (currentStep === 0) {
      return (
        !selectedCategory || (extraOptions.length > 0 && !selectedExtraOption)
      );
    }
    if (currentStep === 1) {
      return !selectedCity || !selectedLocality || !selectedSubLocality;
    }
    if (currentStep === 2) {
      return (
        bedrooms === null ||
        bathrooms === null ||
        balconies === null ||
        areaValue.trim() === ""
      );
    }
    return false;
  };

  const handleContinue = () => {
    if (!isContinueDisabled() && currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmitForm = () => {
    toast.success("🎉 Form Submitted Successfully!");
  };

  return (
    <div className="min-h-screen bg-[#0A0A23] text-gray-200 flex  flex-col 3xl:flex-row justify-center  gap-6 p-8">
      {/* Sidebar */}
      <div className="col-span-1">
  {/* Steps - Vertical for md+, Horizontal scroll for mobile */}
  <div className="flex 3xl:flex-col gap-4 overflow-x-auto pb-4">
    {steps.map((step, index) => (
      <div
        key={index}
        className="flex flex-shrink-0 3xl:flex-shrink 3xl:flex-row 3xl:items-center items-center justify-between gap-2 min-w-max 3xl:min-w-0"
      >
        <div className="flex flex-col items-center gap-4">
          {index <= currentStep ? (
            <CheckCircle className="text-[#FFD700] flex-shrink-0" />
          ) : (
            <Circle className="text-gray-600 flex-shrink-0" />
          )}
          <div className="flex flex-col">
            <h2
              className={`text-base font-semibold ${
                index <= currentStep ? "text-[#FFD700]" : "text-gray-500"
              }`}
            >
              {step.label}
            </h2>
            <p className="text-xs text-gray-400">Step {index + 1}</p>
          </div>
        </div>

        {index < currentStep && (
          <button
            className="text-xs text-[#FFD700] underline hidden 3xl:block"
            onClick={() => setCurrentStep(index)}
          >
            Edit
          </button>
        )}
      </div>
    ))}
  </div>

  {/* Progress Bar */}
  <div className="mt-6 3xl:mt-10">
    <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
      <div
        className="h-full bg-[#FFD700] transition-all duration-500 ease-in-out"
        style={{ width: `${propertyScore}%` }}
      ></div>
    </div>
    <p className="text-sm text-gray-400 mt-2 text-center 3xl:text-left">
      {Math.round(propertyScore)}% Completed
    </p>
  </div>
</div>


      {/* Form Area */}
      <div className="col-span-3 bg-[#12122D] rounded-2xl p-8 space-y-8 shadow-lg">
        <h1 className="text-2xl font-bold">
          Welcome back <span className="text-[#FFD700]">{userName}</span>,<br />
          Fill out basic details
        </h1>

        {/* STEP 1 - Basic Details */}
        {currentStep === 0 && (
          <div className="space-y-6">
            <div>
              <p className="text-gray-400 mb-2">I am looking to</p>
              <div className="flex gap-4">
                {["Sell", "Rent / Lease"].map((option) => (
                  <button
                    key={option}
                    onClick={() => setLookingFor(option)}
                    className={`px-4 py-2 border ${
                      lookingFor === option
                        ? "border-[#FFD700] bg-[#FFD700]/20"
                        : "border-gray-600"
                    } rounded-full hover:bg-[#FFD700]/30 text-sm transition`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-gray-400 mb-2">
                What kind of property do you have?
              </p>
              <div className="flex gap-6">
                {["Residential", "Commercial"].map((option) => (
                  <label
                    key={option}
                    className="flex items-center gap-2 text-sm cursor-pointer"
                    onClick={() => setSelectedType(option)}
                  >
                    <input
                      type="radio"
                      name="propertyType"
                      checked={selectedType === option}
                      className="accent-[#FFD700]"
                      readOnly
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 3xl:grid-cols-3 gap-4 mt-4">
              {categoryList.map((property) => (
                <div
                  key={property}
                  onClick={() => setSelectedCategory(property)}
                  className={`border ${
                    selectedCategory === property
                      ? "border-[#FFD700] bg-[#FFD700]/20"
                      : "border-gray-600"
                  } text-gray-300 rounded-full px-4 py-2 text-sm hover:bg-[#FFD700]/30 cursor-pointer transition`}
                >
                  {property}
                </div>
              ))}
            </div>

            {extraOptions.length > 0 && (
              <div>
                <p className="text-gray-400 mt-6 mb-2">Select more details:</p>
                <div className="grid grid-cols-2 3xl:grid-cols-3 gap-4">
                  {extraOptions.map((option) => (
                    <div
                      key={option}
                      onClick={() => setSelectedExtraOption(option)}
                      className={`border ${
                        selectedExtraOption === option
                          ? "border-[#FFD700] bg-[#FFD700]/20"
                          : "border-gray-600"
                      } text-gray-300 rounded-full px-4 py-2 text-sm hover:bg-[#FFD700]/30 cursor-pointer transition`}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 2 - Location Details */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <p className="text-gray-400 mb-2">Enter City</p>
              <input
                type="text"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                placeholder="Enter your city name"
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
              />
            </div>

            {selectedCity && (
              <div>
                <p className="text-gray-400 mt-6 mb-2">Enter Locality</p>
                <input
                  type="text"
                  value={selectedLocality}
                  onChange={(e) => setSelectedLocality(e.target.value)}
                  placeholder="Enter your locality name"
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                />
              </div>
            )}

            {selectedLocality && (
              <div>
                <p className="text-gray-400 mt-6 mb-2">Enter Sub-Locality</p>
                <input
                  type="text"
                  value={selectedSubLocality}
                  onChange={(e) => setSelectedSubLocality(e.target.value)}
                  placeholder="Enter your sub-locality name"
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                />
              </div>
            )}
          </div>
        )}

        {/* STEP 3 - Property Profile */}
        {currentStep === 2 && (
          <div className="space-y-8">
            {/* Room Details */}
            <div>
              <h2 className="text-lg font-semibold text-[#FFD700] mb-4">
                Add Room Details
              </h2>
              <div className="space-y-6">
                {/* Bedrooms */}
                <div>
                  <p className="text-gray-400 mb-2">No. of Bedrooms</p>
                  <div className="flex flex-wrap gap-3">
                    {[1, 2, 3, 4].map((num) => (
                      <button
                        key={num}
                        onClick={() => setBedrooms(num)}
                        className={`px-4 py-2 border ${
                          bedrooms === num
                            ? "border-[#FFD700] bg-[#FFD700]/20"
                            : "border-gray-600"
                        } rounded-full hover:bg-[#FFD700]/30 text-sm`}
                      >
                        {num}
                      </button>
                    ))}
                    <button className="px-4 py-2 text-sm text-[#FFD700] underline">
                      + Add other
                    </button>
                  </div>
                </div>

                {/* Bathrooms */}
                <div>
                  <p className="text-gray-400 mb-2">No. of Bathrooms</p>
                  <div className="flex flex-wrap gap-3">
                    {[1, 2, 3, 4].map((num) => (
                      <button
                        key={num}
                        onClick={() => setBathrooms(num)}
                        className={`px-4 py-2 border ${
                          bathrooms === num
                            ? "border-[#FFD700] bg-[#FFD700]/20"
                            : "border-gray-600"
                        } rounded-full hover:bg-[#FFD700]/30 text-sm`}
                      >
                        {num}
                      </button>
                    ))}
                    <button className="px-4 py-2 text-sm text-[#FFD700] underline">
                      + Add other
                    </button>
                  </div>
                </div>

                {/* Balconies */}
                <div>
                  <p className="text-gray-400 mb-2">Balconies</p>
                  <div className="flex flex-wrap gap-3">
                    {[0, 1, 2, 3].map((num) => (
                      <button
                        key={num}
                        onClick={() => setBalconies(num)}
                        className={`px-4 py-2 border ${
                          balconies === num
                            ? "border-[#FFD700] bg-[#FFD700]/20"
                            : "border-gray-600"
                        } rounded-full hover:bg-[#FFD700]/30 text-sm`}
                      >
                        {num}
                      </button>
                    ))}
                    <button
                      onClick={() => setBalconies(4)}
                      className={`px-4 py-2 border ${
                        balconies === 4
                          ? "border-[#FFD700] bg-[#FFD700]/20"
                          : "border-gray-600"
                      } rounded-full hover:bg-[#FFD700]/30 text-sm`}
                    >
                      More than 3
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Area Details */}
            <div>
              <h2 className="text-lg font-semibold text-[#FFD700] mb-4">
                Add Area Details <span className="text-red-500 text-sm">*</span>
              </h2>
              <div className="flex gap-4">
                <select
                  value={areaType}
                  onChange={(e) => setAreaType(e.target.value)}
                  className="w-1/2 bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-gray-200 focus:ring-2 focus:ring-[#FFD700]"
                >
                  <option>Carpet Area</option>
                </select>
                <input
                  type="text"
                  value={areaValue}
                  onChange={(e) => setAreaValue(e.target.value)}
                  placeholder="Enter Area in sq.ft."
                  className="w-1/2 bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-[#FFD700]"
                />
              </div>

              <div className="flex gap-6 mt-4">
                <button
                  onClick={() =>
                    !addedAreas.includes("Built-up Area") &&
                    setAddedAreas([...addedAreas, "Built-up Area"])
                  }
                  className="text-sm text-[#FFD700] underline"
                >
                  + Add Built-up Area
                </button>
                <button
                  onClick={() =>
                    !addedAreas.includes("Super Built-up Area") &&
                    setAddedAreas([...addedAreas, "Super Built-up Area"])
                  }
                  className="text-sm text-[#FFD700] underline"
                >
                  + Add Super Built-up Area
                </button>
              </div>

              {addedAreas.length > 0 && (
                <div className="flex flex-col mt-4 gap-2">
                  {addedAreas.map((area, idx) => (
                    <div key={idx} className="flex gap-4 items-center">
                      <span className="text-gray-300">{area}</span>
                      <input
                        type="text"
                        placeholder={`Enter ${area} in sq.ft.`}
                        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-[#FFD700]"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Other Rooms */}
            <div>
              <h2 className="text-lg font-semibold text-[#FFD700] mb-4">
                Other Rooms (Optional)
              </h2>
              <div className="flex flex-wrap gap-3">
                {["Pooja Room", "Study Room", "Servant Room", "Store Room"].map(
                  (room) => (
                    <button
                      key={room}
                      onClick={() =>
                        selectedOtherRooms.includes(room)
                          ? setSelectedOtherRooms(
                              selectedOtherRooms.filter((r) => r !== room)
                            )
                          : setSelectedOtherRooms([...selectedOtherRooms, room])
                      }
                      className={`px-4 py-2 border ${
                        selectedOtherRooms.includes(room)
                          ? "border-[#FFD700] bg-[#FFD700]/20"
                          : "border-gray-600"
                      } rounded-full hover:bg-[#FFD700]/30 text-sm`}
                    >
                      + {room}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Furnishing */}
            <div>
              <h2 className="text-lg font-semibold text-[#FFD700] mb-4">
                Furnishing (Optional)
              </h2>
              <div className="flex gap-4">
                {["Furnished", "Semi-furnished", "Un-furnished"].map((item) => (
                  <button
                    key={item}
                    onClick={() => setFurnishing(item)}
                    className={`px-4 py-2 border ${
                      furnishing === item
                        ? "border-[#FFD700] bg-[#FFD700]/20"
                        : "border-gray-600"
                    } rounded-full hover:bg-[#FFD700]/30 text-sm`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Parking */}
            <div>
              <h2 className="text-lg font-semibold text-[#FFD700] mb-4">
                Reserved Parking (Optional)
              </h2>
              <div className="flex flex-col 3xl:flex-row gap-6">
                <div className="flex items-center gap-3">
                  <span>Covered Parking</span>
                  <button
                    onClick={() =>
                      setCoveredParking(Math.max(0, coveredParking - 1))
                    }
                    className="border border-gray-600 rounded-full w-8 h-8 flex items-center justify-center"
                  >
                    -
                  </button>
                  <span>{coveredParking}</span>
                  <button
                    onClick={() => setCoveredParking(coveredParking + 1)}
                    className="border border-gray-600 rounded-full w-8 h-8 flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <span>Open Parking</span>
                  <button
                    onClick={() => setOpenParking(Math.max(0, openParking - 1))}
                    className="border border-gray-600 rounded-full w-8 h-8 flex items-center justify-center"
                  >
                    -
                  </button>
                  <span>{openParking}</span>
                  <button
                    onClick={() => setOpenParking(openParking + 1)}
                    className="border border-gray-600 rounded-full w-8 h-8 flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Floor Details */}
            <div>
              <h2 className="text-lg font-semibold text-[#FFD700] mb-4">
                Floor Details
              </h2>
              <div className="flex gap-4">
                <input
                  type="text"
                  value={totalFloors}
                  onChange={(e) => setTotalFloors(e.target.value)}
                  placeholder="Total Floors"
                  className="w-1/2 bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-[#FFD700]"
                />
                <input
                  type="text"
                  value={floorOn}
                  onChange={(e) => setFloorOn(e.target.value)}
                  placeholder="Property on Floor"
                  className="w-1/2 bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-[#FFD700]"
                />
              </div>
            </div>

            {/* Availability Status */}
            <div>
              <h2 className="text-lg font-semibold text-[#FFD700] mb-4">
                Availability Status
              </h2>
              <div className="flex gap-4">
                {["Ready to move", "Under construction"].map((item) => (
                  <button
                    key={item}
                    onClick={() => setAvailabilityStatus(item)}
                    className={`px-4 py-2 border ${
                      availabilityStatus === item
                        ? "border-[#FFD700] bg-[#FFD700]/20"
                        : "border-gray-600"
                    } rounded-full hover:bg-[#FFD700]/30 text-sm`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-10">
            {/* Upload Video Section */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white">
                Add one video of property
              </h2>
              <p className="text-gray-400 text-sm">
                A video is worth a thousand pictures. Properties with videos get
                higher page views.
              </p>
              <p className="text-[#FFD700] underline text-sm cursor-pointer">
                Make sure it follows the Video Guidelines
              </p>

              {/* Upload Video Box */}
              <div className="bg-gray-800 border-2 border-dashed border-gray-600 rounded-xl p-6 text-center space-y-4 relative">
                <div className="flex justify-center">
                  <span className="bg-[#FFD700] text-black text-xs font-bold px-2 py-1 rounded-full mb-2">
                    NEW
                  </span>
                </div>
                <h3 className="text-lg font-semibold">Upload Video</h3>
                <div className="flex flex-col items-center justify-center gap-2 mt-4">
                  <div className="text-4xl">📹</div>
                  <label
                    htmlFor="video-upload"
                    className="text-sm text-gray-400 cursor-pointer"
                  >
                    Drag your videos here or{" "}
                    <span className="underline text-[#FFD700]">Upload</span>
                  </label>
                  <input
                    id="video-upload"
                    type="file"
                    accept="video/mp4,video/x-m4v,video/*"
                    className="hidden"
                    onChange={(e) =>
                      console.log("Video Selected:", e.target.files)
                    }
                  />
                  <p className="text-xs text-gray-500">
                    Max size 80MB, formats: .mov, .mp4, .H264
                    <br />
                    Duration: less than 10 mins
                  </p>
                </div>
              </div>

              {/* No Video Warning */}
              <div className="bg-yellow-600/20 border border-yellow-400 text-yellow-400 rounded-md p-4 text-sm">
                Do not have a Video? We can help you create one with our Paid
                Plans, Contact to Upgrade
              </div>
            </div>

            {/* Upload Photos Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">
                Add photos of your property{" "}
                <span className="text-sm text-gray-400">(Optional)</span>
              </h2>
              <p className="text-gray-400 text-sm">
                A picture is worth a thousand words. 87% of buyers look at
                photos before buying.
              </p>

              {/* Upload Photo Box */}
              <div className="bg-gray-800 border-2 border-dashed border-gray-600 rounded-xl p-6 text-center space-y-4 relative">
                <div className="text-4xl">🖼️</div>
                <label
                  htmlFor="photo-upload"
                  className="text-[#FFD700] underline text-sm cursor-pointer"
                >
                  + Add atleast 5 photos
                </label>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/png, image/jpeg, image/webp, image/heif, image/heic"
                  multiple
                  className="hidden"
                  onChange={(e) =>
                    console.log("Photos Selected:", e.target.files)
                  }
                />
                <p className="text-sm text-gray-400">
                  Drag and drop your photos here
                </p>
                <p className="text-xs text-gray-500">
                  Upto 50 photos • Max size 10MB each • Formats: png, jpg, jpeg,
                  gif, webp, heic, heif
                </p>

                {/* Button triggers input click */}
                <label
                  htmlFor="photo-upload"
                  className="mt-4 inline-block bg-[#FFD700] hover:bg-[#FFD700]/80 text-black font-semibold px-6 py-2 rounded-lg cursor-pointer"
                >
                  Upload Photos Now
                </label>
              </div>

              {/* Tip Card */}
              <div className="bg-[#0A0A23] border-l-4 border-[#FFD700] p-4 space-y-2">
                <p className="text-sm text-white">
                  💡{" "}
                  <span className="font-semibold">Add 4+ property photos</span>{" "}
                  to increase responses upto 21%!
                </p>
              </div>

              {/* Upload via Phone Section */}
              <div className="bg-gray-800 border border-gray-600 rounded-xl p-6 space-y-4">
                <p className="text-sm text-gray-400">
                  Now you can also upload photos directly from your phone
                </p>
                <p className="text-white text-sm">
                  With your registered number{" "}
                  <span className="text-[#FFD700]">+91-9825802522</span>
                </p>

                <div className="flex flex-col 3xl:flex-row gap-4 mt-4">
                  <button className="flex-1 border border-green-500 text-green-400 font-semibold px-4 py-2 rounded-lg flex items-center justify-center gap-2">
                    <span>📲</span> Send photos over WhatsApp
                  </button>
                  <button className="flex-1 border border-blue-400 text-blue-300 font-semibold px-4 py-2 rounded-lg flex items-center justify-center gap-2">
                    <span>🔗</span> Get photo upload link over SMS
                  </button>
                </div>

                <div className="mt-4 text-xs text-yellow-400">
                  ⚠️ Without photos your ad will be ignored by buyers
                </div>
              </div>

            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-10">
            {/* Ownership Section */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white">
                Add Pricing and Details
              </h2>

              <p className="text-gray-400 text-sm flex items-center gap-1">
                Ownership <span className="text-[#FFD700] text-xs">ℹ️</span>
              </p>

              {/* Ownership Buttons */}
              <div className="flex flex-wrap gap-4">
                {[
                  "Freehold",
                  "Leasehold",
                  "Co-operative society",
                  "Power of Attorney",
                ].map((option) => (
                  <button
                    key={option}
                    onClick={() => setOwnership(option)}
                    className={`px-4 py-2 border ${
                      ownership === option
                        ? "border-[#FFD700] bg-[#FFD700]/20"
                        : "border-gray-600"
                    } rounded-full hover:bg-[#FFD700]/30 text-sm transition`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Details Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">
                Price Details
              </h3>

              {/* Price Inputs */}
              <div className="grid grid-cols-1 3xl:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={expectedPrice}
                  onChange={(e) => setExpectedPrice(e.target.value)}
                  placeholder="₹ Expected Price"
                  className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-[#FFD700]"
                />
                <input
                  type="text"
                  value={pricePerSqft}
                  onChange={(e) => setPricePerSqft(e.target.value)}
                  placeholder="₹ Price per sq.ft."
                  className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-[#FFD700]"
                />
              </div>

              {/* Price in Words Info */}
              <p className="text-xs text-gray-400 mt-2">₹ Price in words</p>

              {/* Pricing Options */}
              <div className="flex flex-wrap gap-6 mt-4">
                <label className="flex items-center gap-2 text-gray-300 text-sm">
                  <input
                    type="checkbox"
                    checked={isAllInclusive}
                    onChange={() => setIsAllInclusive(!isAllInclusive)}
                    className="accent-[#FFD700]"
                  />
                  All inclusive price{" "}
                  <span className="text-[#FFD700] text-xs">ℹ️</span>
                </label>

                <label className="flex items-center gap-2 text-gray-300 text-sm">
                  <input
                    type="checkbox"
                    checked={isTaxExcluded}
                    onChange={() => setIsTaxExcluded(!isTaxExcluded)}
                    className="accent-[#FFD700]"
                  />
                  Tax and Govt. charges excluded
                </label>

                <label className="flex items-center gap-2 text-gray-300 text-sm">
                  <input
                    type="checkbox"
                    checked={isNegotiable}
                    onChange={() => setIsNegotiable(!isNegotiable)}
                    className="accent-[#FFD700]"
                  />
                  Price Negotiable
                </label>
              </div>

              {/* Add More Pricing Details Link */}
              <button className="text-sm text-[#FFD700] underline mt-4">
                + Add more pricing details
              </button>
            </div>

            {/* Property Description Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">
                What makes your property unique
              </h3>
              <p className="text-gray-400 text-sm">
                Adding a description will increase your listing visibility
              </p>

              <textarea
                value={propertyDescription}
                onChange={(e) => setPropertyDescription(e.target.value)}
                placeholder="Share details about your property like spacious rooms, well-maintained society, premium location, etc."
                rows={5}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-[#FFD700]"
              />

              <div className="text-xs text-gray-400 flex justify-between">
                <span>Minimum 30 characters required</span>
                <span>{propertyDescription.length}/5000</span>
              </div>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-between">
          {currentStep > 0 && (
            <button
              onClick={handleBack}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold px-6 py-3 rounded-lg transition"
            >
              Back
            </button>
          )}
          {currentStep < steps.length - 1 ? (
            <button
              onClick={handleContinue}
              disabled={isContinueDisabled()}
              className={`${
                isContinueDisabled()
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-[#FFD700] hover:bg-[#FFD700]/80"
              } text-black font-bold px-8 py-3 rounded-lg transition`}
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handleSubmitForm}
              disabled={isContinueDisabled()}
              className={`${
                isContinueDisabled()
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-[#FFD700] hover:bg-[#FFD700]/80"
              } text-black font-bold px-8 py-3 rounded-lg transition`}
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellFormPage;
