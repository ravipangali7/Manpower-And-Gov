import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

export type LogoCarouselItem = {
  id: number;
  label: string;
  logo_url?: string | null;
  url?: string;
};

type LogoCarouselProps = {
  items: LogoCarouselItem[];
  /** Tailwind basis classes for each slide, e.g. "basis-1/2 md:basis-1/3" */
  itemBasis: string;
  /** Extra class on each slide cell */
  cellClassName?: string;
  /** Image max height class */
  imageClassName?: string;
};

const navBtn =
  "absolute top-1/2 z-10 h-9 w-9 -translate-y-1/2 rounded-none border-0 bg-brand-red text-white shadow-none hover:bg-brand-red/90 hover:text-white disabled:bg-brand-red/40 disabled:opacity-100";

export function LogoCarousel({
  items,
  itemBasis,
  cellClassName,
  imageClassName = "max-h-16 max-w-[160px] object-contain",
}: LogoCarouselProps) {
  if (!items.length) return null;

  return (
    <Carousel
      opts={{
        align: "start",
        loop: items.length > 3,
        skipSnaps: false,
      }}
      className="relative mx-auto w-full max-w-[1100px] px-12"
    >
      <CarouselContent className="-ml-2 md:-ml-4">
        {items.map((item) => {
          const inner = item.logo_url ? (
            <img src={item.logo_url} alt={item.label} className={imageClassName} loading="lazy" />
          ) : (
            <span className="px-2 text-center text-sm font-semibold text-muted-foreground">
              {item.label}
            </span>
          );

          const cell = (
            <div
              className={cn(
                "flex h-28 w-full items-center justify-center bg-white px-4",
                cellClassName,
              )}
            >
              {inner}
            </div>
          );

          return (
            <CarouselItem key={item.id} className={cn("pl-2 md:pl-4", itemBasis)}>
              {item.url ? (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block h-full transition-opacity hover:opacity-80"
                  aria-label={item.label}
                >
                  {cell}
                </a>
              ) : (
                cell
              )}
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <CarouselPrevious className={cn(navBtn, "left-0")} />
      <CarouselNext className={cn(navBtn, "right-0")} />
    </Carousel>
  );
}
