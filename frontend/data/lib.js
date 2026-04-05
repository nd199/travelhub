export const cities = [
  "Bangalore",
  "Chennai",
  "Hyderabad",
  "Mumbai",
  "Delhi",
  "Kolkata",
  "Pune",
  "Jaipur",
  "Ahmedabad",
  "Kochi",
  "Goa",
  "Coimbatore",
  "Madurai",
  "Trivandrum",
  "Vizag",
  "Mysore",
  "Chandigarh",
  "Lucknow",
  "Bhubaneswar",
  "Ranchi"
]

export const cityCodes = {
  "Bangalore": "BLR",
  "Chennai": "MAS",
  "Hyderabad": "HYD",
  "Mumbai": "BOM",
  "Delhi": "DEL",
  "Kolkata": "CCU",
  "Pune": "PNQ",
  "Jaipur": "JAI",
  "Ahmedabad": "AMD",
  "Kochi": "COK",
  "Goa": "GOI",
  "Coimbatore": "CJB",
  "Madurai": "IXM",
  "Trivandrum": "TRV",
  "Vizag": "VTZ",
  "Mysore": "MYQ",
  "Chandigarh": "IXC",
  "Lucknow": "LKO",
  "Bhubaneswar": "BBI",
  "Ranchi": "IXR"
}

export const busRoutes = [
  { from: "Bangalore", to: "Chennai", price: 800 },
  { from: "Bangalore", to: "Hyderabad", price: 1200 },
  { from: "Mumbai", to: "Pune", price: 400 },
  { from: "Chennai", to: "Coimbatore", price: 600 },
  { from: "Hyderabad", to: "Vizag", price: 900 },
  { from: "Delhi", to: "Jaipur", price: 500 },
  { from: "Kolkata", to: "Bhubaneswar", price: 700 },
  { from: "Kochi", to: "Trivandrum", price: 350 },
]

export const trainRoutes = [
  { from: "Bangalore", to: "Chennai", price: 450 },
  { from: "Mumbai", to: "Delhi", price: 1200 },
  { from: "Chennai", to: "Kolkata", price: 1100 },
  { from: "Delhi", to: "Lucknow", price: 400 },
  { from: "Hyderabad", to: "Mumbai", price: 950 },
  { from: "Pune", to: "Mumbai", price: 250 },
  { from: "Jaipur", to: "Delhi", price: 300 },
]

export const flightRoutes = [
  { from: "Bangalore", to: "Delhi", price: 4500 },
  { from: "Chennai", to: "Mumbai", price: 3800 },
  { from: "Hyderabad", to: "Bangalore", price: 2800 },
  { from: "Mumbai", to: "Delhi", price: 5000 },
  { from: "Kolkata", to: "Bangalore", price: 4200 },
  { from: "Pune", to: "Goa", price: 2200 },
  { from: "Kochi", to: "Chennai", price: 2500 },
  { from: "Trivandrum", to: "Mumbai", price: 3500 },
]

// Mock Search Results
export const mockBusResults = [
  {
    id: 1,
    operator: 'KSRTC',
    departure: '08:00',
    arrival: '14:00',
    price: 850,
    seats: 12,
    womenSeats: 3,
  },
  {
    id: 2,
    operator: 'SRS Travels',
    departure: '10:30',
    arrival: '16:30',
    price: 750,
    seats: 8,
    womenSeats: 0,
  },
  {
    id: 3,
    operator: 'Orange Tours',
    departure: '14:00',
    arrival: '20:00',
    price: 900,
    seats: 15,
    womenSeats: 4,
  },
  {
    id: 4,
    operator: 'VRL Travels',
    departure: '18:00',
    arrival: '00:00',
    price: 800,
    seats: 5,
    womenSeats: 2,
  },
]

export const mockTrainResults = [
  { id: 1, trainName: "Vande Bharat Exp", trainNumber: "20601", departure: "06:00", arrival: "12:00", duration: "6h", price: { "All Class": 450, "General": 450, "AC 3 Tier": 1100, "AC 2 Tier": 1800, "AC First Class": 3000, "Executive": 3500 }, seats: { "All Class": 5, "General": 15, "AC 3 Tier": 8, "AC 2 Tier": 3, "AC First Class": 1, "Executive": 2 } },
  { id: 2, trainName: "Shatabdi Express", trainNumber: "12026", departure: "08:30", arrival: "14:30", duration: "6h", price: { "All Class": 550, "General": 550, "AC 3 Tier": 1250, "AC 2 Tier": 2000, "AC First Class": 3200, "Executive": 3800 }, seats: { "All Class": 12, "General": 20, "AC 3 Tier": 10, "AC 2 Tier": 5, "AC First Class": 2, "Executive": 3 } },
  { id: 3, trainName: "Rajdhani Express", trainNumber: "12301", departure: "14:00", arrival: "21:00", duration: "7h", price: { "All Class": 650, "General": 650, "AC 3 Tier": 1400, "AC 2 Tier": 2200, "AC First Class": 3800, "Executive": 4200 }, seats: { "All Class": 8, "General": 18, "AC 3 Tier": 6, "AC 2 Tier": 4, "AC First Class": 2, "Executive": 1 } },
  { id: 4, trainName: "Garib Rath", trainNumber: "12235", departure: "18:00", arrival: "01:00", duration: "7h", price: { "All Class": 350, "General": 350, "AC 3 Tier": 850, "AC 2 Tier": 1400, "AC First Class": 2200, "Executive": 0 }, seats: { "All Class": 20, "General": 25, "AC 3 Tier": 15, "AC 2 Tier": 8, "AC First Class": 4, "Executive": 0 } },
]

export const mockFlightResults = [
  { id: 1, airline: 'IndiGo', flightNumber: '6E 123', departure: '06:00', arrival: '08:30', duration: '2h 30m', price: { Economy: 3200, Business: 7500 }, seats: { Economy: 18, Business: 4 } },
  { id: 2, airline: 'Air India', flightNumber: 'AI 456', departure: '09:30', arrival: '12:00', duration: '2h 30m', price: { Economy: 3800, Business: 8200 }, seats: { Economy: 12, Business: 6 } },
  { id: 3, airline: 'SpiceJet', flightNumber: 'SG 789', departure: '13:15', arrival: '15:45', duration: '2h 30m', price: { Economy: 2900, Business: 6800 }, seats: { Economy: 25, Business: 2 } },
  { id: 4, airline: 'Vistara', flightNumber: 'UK 321', departure: '17:45', arrival: '20:15', duration: '2h 30m', price: { Economy: 4100, Business: 9000 }, seats: { Economy: 8, Business: 5 } },
  { id: 5, airline: 'Air Asia', flightNumber: 'I5 654', departure: '21:00', arrival: '23:30', duration: '2h 30m', price: { Economy: 2500, Business: 6200 }, seats: { Economy: 30, Business: 7 } },
]

export const mockPnrResult = {
  pnr: '',
  trainName: 'Vande Bharat Exp',
  trainNumber: '20601',
  status: 'Confirmed',
  from: 'Bangalore',
  to: 'Chennai',
  date: '',
  trainClass: 'AC 3 Tier'
}