export default function Footer() {
  return (
    <>
      <footer
        style={{ backgroundColor: 'var(--primary-color)' }}
        className="flex flex-column align-items-center justify-content-center w-full h-3rem fixed left-0 bottom-0"
      >
        <p className="flex justify-content-center text-l text-blue-900 w-13rem">
          "I like the carton the most."
        </p>
        <p className="flex justify-content-end text-blue-900 w-11rem">🐾</p>
      </footer>
    </>
  );
}
