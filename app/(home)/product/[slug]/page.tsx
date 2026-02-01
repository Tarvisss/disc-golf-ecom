import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import data from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Vortex } from "@/components/ui/vortex"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

type ProductPageProps = {
  params: Promise<{ slug: string }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = data.products.find((p) => p.slug === slug)

  if (!product) {
    notFound()
  }

  const hasDiscount = product.listPrice && product.listPrice > product.price

  return (
    <Vortex className="relative min-h-screen">
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/products"
        className="text-muted-foreground hover:text-foreground text-sm mb-6 inline-block"
      >
        &larr; Back to Products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
        {/* Product Images */}
        <div className="space-y-4">
          <div data-usal="fade-u" className="relative aspect-square overflow-hidden rounded-full">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-square overflow-hidden rounded-full"
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <p className="text-muted-foreground">{product.brand}</p>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            {product.category && (
              <p className="text-muted-foreground mt-1">{product.category}</p>
            )}
          </div>

          {/* Price */}
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold">${product.price.toFixed(2)}</span>
            {hasDiscount && (
              <span className="text-xl text-muted-foreground line-through">
                ${product.listPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Rating */}
          {product.avgRating && (
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={
                      star <= Math.round(product.avgRating)
                        ? "text-yellow-500"
                        : "text-gray-300"
                    }
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-muted-foreground text-sm">
                {product.avgRating} ({product.numReviews} reviews)
              </span>
            </div>
          )}

          {/* Flight Numbers */}
          {product.flightNumbers && (
            <div className="bg-muted rounded-lg p-4">
              <h3 className="font-semibold mb-3">Flight Numbers</h3>
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">{product.flightNumbers.speed}</div>
                  <div className="text-sm text-muted-foreground">Speed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{product.flightNumbers.glide}</div>
                  <div className="text-sm text-muted-foreground">Glide</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{product.flightNumbers.turn}</div>
                  <div className="text-sm text-muted-foreground">Turn</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{product.flightNumbers.fade}</div>
                  <div className="text-sm text-muted-foreground">Fade</div>
                </div>
              </div>
            </div>
          )}

          {/* Stock Status */}
          <div>
            {product.countInStock > 0 ? (
              <span className="text-green-600 font-medium">
                In Stock ({product.countInStock} available)
              </span>
            ) : (
              <span className="text-red-600 font-medium">Out of Stock</span>
            )}
          </div>

          {/* Add to Cart Button */}
          <Button size="lg" className="w-full" disabled={product.countInStock === 0}>
            Add to Cart
          </Button>

          {/* Description */}
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground">{product.description}</p>
          </div>

          {/* Product Details Accordion */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="specs">
              <AccordionTrigger>Specifications</AccordionTrigger>
              <AccordionContent>
                <dl className="grid grid-cols-2 gap-2 text-sm">
                  {product.plastic && (
                    <>
                      <dt className="text-muted-foreground">Plastic</dt>
                      <dd>{product.plastic}</dd>
                    </>
                  )}
                  {product.weight && (
                    <>
                      <dt className="text-muted-foreground">Weight</dt>
                      <dd>{product.weight}g</dd>
                    </>
                  )}
                  {product.discType && product.discType.length > 0 && (
                    <>
                      <dt className="text-muted-foreground">Disc Type</dt>
                      <dd className="capitalize">{product.discType.join(", ")}</dd>
                    </>
                  )}
                </dl>
              </AccordionContent>
            </AccordionItem>

            {product.colors && product.colors.length > 0 && (
              <AccordionItem value="colors">
                <AccordionTrigger>Available Colors</AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <span
                        key={color}
                        className="px-3 py-1 bg-muted rounded-full text-sm"
                      >
                        {color}
                      </span>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        </div>
      </div>
    </div>
    </Vortex>
  )
}
