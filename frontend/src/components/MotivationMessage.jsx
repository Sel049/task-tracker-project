function MotivationMessage({ motivation }) {
  if (!motivation) return null;
  return (
    <div className="mb-4 px-4 py-2 bg-green-100 text-green-700 rounded border border-green-300 w-full text-center animate-fade-in">
      {motivation}
    </div>
  );
}

export default MotivationMessage;
