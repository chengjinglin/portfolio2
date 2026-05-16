export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black py-12 text-center">
      <p className="text-sm tracking-widest text-white/40">
        &copy; {new Date().getFullYear()} PHOTOGRAPHY. ALL RIGHTS RESERVED.
      </p>
    </footer>
  );
}
