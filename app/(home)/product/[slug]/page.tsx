import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import data from "@/lib/data"
import { AddToCartButton } from "@/components/shared/cart/add-to-cart-button"


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
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/products"
        className="text-input hover:text-foreground text-sm mb-6 inline-block"
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
          <div className="flex justify-between items-start gap-4">
            {/* Left: Name & Price */}
            <div className="space-y-2">
              <div>
                <h1 className="text-input text-3xl font-bold">{product.name}</h1>
                {product.category && (
                  <p className="text-input mt-1">{product.category}</p>
                )}
              </div>

              {/* Price */}
              <div className="flex items-center gap-3">
                <span className="text-3xl text-input font-bold">${product.price.toFixed(2)}</span>
                {hasDiscount && (
                  <span className="text-xl text-input line-through">
                    ${product.listPrice.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            {/* Right: Rating */}
            {product.avgRating && (
              <div className="flex flex-col items-center gap-1">
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
                <span className="text-input text-sm">
                  {product.avgRating} ({product.numReviews} reviews)
                </span>
              </div>
            )}
          </div>

          {/* Flight Numbers */}
          {product.flightNumbers && (
            <div className=" rounded-lg p-4">
              <h3 className="font-semibold mb-3 text-input text-center">Flight Numbers</h3>
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl text-input font-bold">{product.flightNumbers.speed}</div>
                  <div className="text-sm text-input">Speed</div>
                </div>
                <div>
                  <div className="text-2xl text-input font-bold">{product.flightNumbers.glide}</div>
                  <div className="text-sm text-input">Glide</div>
                </div>
                <div>
                  <div className="text-2xl text-input font-bold">{product.flightNumbers.turn}</div>
                  <div className="text-sm text-input">Turn</div>
                </div>
                <div>
                  <div className="text-2xl text-input font-bold">{product.flightNumbers.fade}</div>
                  <div className="text-sm text-input">Fade</div>
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
          <AddToCartButton
            className="w-full"
            item={{
              clientId: `${product.slug}-${product.colors?.[0] ?? 'default'}`,
              product: product.slug,
              name: product.name,
              slug: product.slug,
              category: product.category,
              quantity: 1,
              countInStock: product.countInStock,
              image: product.images[0],
              price: product.price,
            }}
          />

          {/* Description */}
          <div>
            <h3 className="font-semibold text-input mb-2">Description</h3>
            <p className="text-input">{product.description}</p>
          </div>
          <hr/>
          {/* Product Details*/}
               <h3 className="font-semibold text-input mb-2">Specifcations</h3>            
                <dl className="grid grid-cols-2 gap-2 text-sm">
                    <>
                      <dt className="text-input">Plastic</dt>
                      <dd className="text-input">{product.plastic}</dd>
                    </>
                    <>
                      <dt className="text-input">Weight</dt>
                      <dd className="text-input">{product.weight}g</dd>
                    </>
                    <>
                      <dt className="text-input">Disc Type</dt>
                      <dd className="capitalize text-input">{product.discType.join(", ")}</dd>
                    </>
                </dl>
        </div>
      </div>
    </div>
  )
}
