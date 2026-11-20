const CARD_COUNT = 4;
const ROW_COUNT = 5;

export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading stories" className="animate-fade-in space-y-8 lg:space-y-10">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-3">
          <div className="skeleton h-8 w-44 rounded-xl" />
          <div className="skeleton h-4 w-36 rounded-lg" />
        </div>
        <div className="skeleton h-14 w-full rounded-2xl lg:w-96" />
      </div>

      <div className="space-y-5">
        <div className="skeleton h-6 w-32 rounded-lg" />
        <div className="-mx-6 flex gap-5 overflow-hidden px-6 lg:mx-0 lg:grid lg:grid-cols-4 lg:px-0">
          {Array.from({ length: CARD_COUNT }, (_, index) => (
            <div key={index} className="skeleton aspect-3/4 w-64 shrink-0 rounded-[1.75rem] lg:w-auto" />
          ))}
        </div>
      </div>

      <div className="divide-y divide-neutral-100">
        {Array.from({ length: ROW_COUNT }, (_, index) => (
          <div key={index} className="flex gap-4 py-4">
            <div className="flex-1 space-y-2.5">
              <div className="skeleton h-3 w-28 rounded-md" />
              <div className="skeleton h-4 w-full rounded-md" />
              <div className="skeleton h-4 w-4/5 rounded-md" />
              <div className="skeleton h-3 w-24 rounded-md" />
            </div>
            <div className="skeleton size-22 shrink-0 rounded-2xl lg:size-28" />
          </div>
        ))}
      </div>
    </div>
  );
}
