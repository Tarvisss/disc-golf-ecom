import Image from "next/image"
import Link from "next/link"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { cn } from "@/lib/utils"

type FlightNumbers = {
  speed: number
  glide: number
  turn: number
  fade: number
}

type ProductCardProps = {
  name: string
  slug: string
  brand: string
  price: number
  listPrice?: number
  image: string
  weight?: number
  color?: string
  plastic?: string
  discType?: string
  flightNumbers?: FlightNumbers
  className?: string
}

// const animationOptions = ['zoomin-ur duration 2000','zoomin-dl duration 2000','zommin-dr duration 2000','zommin-ul duration 2000','zommin-u duration 2000','zommin duration 2000','zommin-r duration 2000' ]

// function animate(arr: string[]){
//   const randomIndex = Math.floor(Math.random() * arr.length);
//   return arr[randomIndex]
// }



export function ProductCard({
  name,
  slug,
  brand,
  price,
  listPrice,
  image,
  weight,
  color,
  plastic,
  discType,
  flightNumbers,
  className,
}: ProductCardProps) {
  const hasDiscount = listPrice && listPrice > price
  // const animation = animate(animationOptions);

  return (
    <div
      className={cn(
        "group rounded-lg bg-card text-card-foreground shadow-sm overflow-hidden",
        className
      )}
    >
      <Link href={`/product/${slug}`} className="block">
        <div data-usal="zoomin-d" className="relative aspect-[4/3] overflow-hidden flex items-center justify-center">
          <div className="relative w-3/4 aspect-square">
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover transition-transform group-hover:scale-105 rounded-full"
            />
          </div>
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/product/${slug}`}>
          <h3 className="font-semibold text-lg truncate hover:underline">
            {name}
          </h3>
        </Link>

        <p className="text-muted-foreground text-sm">{brand}</p>

        <div className="flex items-center gap-2 mt-2">
          <span className="font-bold text-lg">${price.toFixed(2)}</span>
          {hasDiscount && (
            <span className="text-muted-foreground line-through text-sm">
              ${listPrice.toFixed(2)}
            </span>
          )}
        </div>
           <hr className="my-3" />
        <div className="text-center text-sm text-muted-foreground mb-2" data-usal="zommin-u">Flight Numbers</div>
        {flightNumbers && (
          <div className="grid grid-cols-4 gap-2 text-center mt-3" data-usal="zommin-u">
            <div>
              <div className="text-lg font-bold">{flightNumbers.speed}</div>
              <div className="text-xs text-muted-foreground">Speed</div>
            </div>
            <div>
              <div className="text-lg font-bold">{flightNumbers.glide}</div>
              <div className="text-xs text-muted-foreground">Glide</div>
            </div>
            <div>
              <div className="text-lg font-bold">{flightNumbers.turn}</div>
              <div className="text-xs text-muted-foreground">Turn</div>
            </div>
            <div>
              <div className="text-lg font-bold">{flightNumbers.fade}</div>
              <div className="text-xs text-muted-foreground">Fade</div>
            </div>
          </div>
        )}

        <Accordion type="single" collapsible className="mt-4">
          <AccordionItem value="description" className="border-b-0">
            <AccordionTrigger className="text-sm">Description</AccordionTrigger>
            <AccordionContent>
              <dl className="grid grid-cols-2 gap-2 text-sm">
                <dt className="text-muted-foreground">Name</dt>
                <dd>{name}</dd>
                <dt className="text-muted-foreground">Brand</dt>
                <dd>{brand}</dd>
                {discType && (
                  <>
                    <dt className="text-muted-foreground">Disc Type</dt>
                    <dd className="capitalize">{discType}</dd>
                  </>
                )}
                {plastic && (
                  <>
                    <dt className="text-muted-foreground">Plastic</dt>
                    <dd>{plastic}</dd>
                  </>
                )}
                {weight && (
                  <>
                    <dt className="text-muted-foreground">Weight</dt>
                    <dd>{weight}g</dd>
                  </>
                )}
                {color && (
                  <>
                    <dt className="text-muted-foreground">Color</dt>
                    <dd className="capitalize">{color}</dd>
                  </>
                )}
              </dl>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}
