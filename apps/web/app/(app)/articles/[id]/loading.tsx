export default function ArticleLoading() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading story"
      className="-mx-3 -mt-7 animate-fade-in lg:mx-0 lg:mt-0 lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:items-start lg:gap-12"
    >
      <div className="skeleton h-104 rounded-[2rem] lg:aspect-4/5 lg:h-auto" />
      <div className="space-y-6 px-4 pt-8 lg:px-0 lg:pt-2">
        <div className="flex gap-8">
          <div className="skeleton h-7 w-28 rounded-lg" />
          <div className="skeleton h-5 w-16 rounded-lg" />
        </div>
        <div className="flex justify-between gap-3">
          <div className="skeleton h-8 w-24 rounded-lg" />
          <div className="skeleton h-8 w-24 rounded-lg" />
          <div className="skeleton h-8 w-24 rounded-lg" />
        </div>
        <div className="space-y-3">
          <div className="skeleton h-4 w-full rounded-md" />
          <div className="skeleton h-4 w-full rounded-md" />
          <div className="skeleton h-4 w-3/4 rounded-md" />
        </div>
        <div className="skeleton h-14 w-full rounded-2xl" />
      </div>
    </div>
  );
}
