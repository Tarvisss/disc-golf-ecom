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
  material?: string
  discType?: string
  flightNumbers?: FlightNumbers
  className?: string
}

export function ProductCard({
  name,
  slug,
  brand,
  price,
  listPrice,
  image,
  weight,
  color,
  material,
  discType,
  flightNumbers,
  className,
}: ProductCardProps) {
  const hasDiscount = listPrice && listPrice > price

  return (
    <div
      className={cn(
        "group rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden",
        className
      )}
    >
      <Link href={`/product/${slug}`} className="block">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
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

        <Accordion type="single" collapsible className="mt-4">
          <AccordionItem value="description">
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

          <AccordionItem value="flight-numbers">
            <AccordionTrigger className="text-sm">
              Flight Numbers
            </AccordionTrigger>
            <AccordionContent>
              {flightNumbers ? (
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div>
                    <div className="text-lg font-bold">
                      {flightNumbers.speed}
                    </div>
                    <div className="text-xs text-muted-foreground">Speed</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold">
                      {flightNumbers.glide}
                    </div>
                    <div className="text-xs text-muted-foreground">Glide</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold">
                      {flightNumbers.turn}
                    </div>
                    <div className="text-xs text-muted-foreground">Turn</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold">
                      {flightNumbers.fade}
                    </div>
                    <div className="text-xs text-muted-foreground">Fade</div>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">
                  Flight numbers not available
                </p>
              )}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="material" className="border-b-0">
            <AccordionTrigger className="text-sm">Plastic</AccordionTrigger>
            <AccordionContent>
              {material ? (
                <p>{material}</p>
              ) : (
                <p className="text-muted-foreground text-sm">
                  Material information not available
                </p>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}
