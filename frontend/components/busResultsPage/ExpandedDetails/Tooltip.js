const Tooltip = ({ seat, position }) => {
  return (
    <div
      className="fixed z-50 w-64 p-3 bg-white border shadow-xl pointer-events-none rounded-xl"
      style={{ top: position?.y + 10, left: position?.x + 10 }}
    >
      <h2 className="mb-2 text-sm font-semibold text-gray-800">
        Seat Information
      </h2>

      <div className="flex justify-between text-sm">
        <span className="text-gray-500">Seat No</span>
        <span className="font-medium">{seat?.name}</span>
      </div>

      <div className="flex justify-between mt-2 text-sm">
        <span className="text-gray-500">Status</span>
        <span className="font-medium capitalize">{seat?.type}</span>
      </div>

      {seat?.type !== 'booked' && (
        <div className="flex justify-between mt-2 text-sm">
          <span className="text-gray-500">Reservation</span>
          <span className="font-medium capitalize">
            {seat?.gender === 'ladies' ? 'Women Only' : 'Open'}
          </span>
        </div>
      )}

      <div className="flex justify-between pt-2 mt-3 text-sm border-t">
        <span className="font-medium text-gray-600">Fare</span>
        <span className="font-semibold text-green-600">₹{seat?.price}</span>
      </div>
    </div>
  );
};

export default Tooltip;