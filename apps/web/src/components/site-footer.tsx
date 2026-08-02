export function SiteFooter() {
  return (
    <footer className="bg-primary text-white py-20 mt-24">
      <div className="mx-auto w-[min(1280px,92%)] flex flex-col gap-4">
        <p className="font-heading font-bold text-lg">South Coast Residents&apos; Association</p>
        <p className="text-white/80 max-w-xl">
          Representing residents, property owners and businesses from Likoni to Lunga Lunga.
        </p>
        <p className="text-white/60 text-sm mt-8">
          © {new Date().getFullYear()} South Coast Residents&apos; Association. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
