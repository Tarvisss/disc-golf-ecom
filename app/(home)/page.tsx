import Link from "next/link"
import { HomeCarousel } from "@/components/shared/home/home-carousel"
import { ProductCard } from "@/components/shared/product/product-card"
import { Button } from "@/components/ui/button"
import data from "@/lib/data"

export default async function Page() {
  const featuredDiscs = data.products.filter((p) =>
    p.tags.includes("featured")
  ).slice(0, 4)

  const bestSellers = data.products.filter((p) =>
    p.tags.includes("best-seller")
  ).slice(0, 4)

  const newArrivals = data.products.filter((p) =>
    p.tags.includes("new-arrival")
  ).slice(0, 4)

  return (
    <div>
      {/* Hero Section */}
      <div className="text-center py-12 px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-input mb-4">
          Welcome to Disc-Go-Round
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Your destination for premium disc golf discs. New, used, and donated — find your perfect throw.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/products">Shop All Discs</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/donate">Donate a Disc</Link>
          </Button>
        </div>
      </div>

      {/* Carousel */}
      <div className="max-w-5xl max-h-[400px] mx-auto overflow-hidden rounded-3xl mb-16">
        <HomeCarousel items={data.carousels} />
      </div>

      {/* Featured Discs */}
      {featuredDiscs.length > 0 && (
        <section className="container mx-auto px-4 mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-input">Featured Discs</h2>
            <Button asChild variant="ghost">
              <Link href="/search?tag=featured">View All</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredDiscs.map((product) => (
              <ProductCard
                key={product.slug}
                name={product.name}
                slug={product.slug}
                brand={product.brand}
                price={product.price}
                listPrice={product.listPrice}
                image={product.images[0]}
                color={product.colors?.[0]}
                discType={product.discType?.[0]}
                weight={product.weight}
                plastic={product.plastic}
                flightNumbers={product.flightNumbers}
              />
            ))}
          </div>
        </section>
      )}

      {/* Best Sellers */}
      {bestSellers.length > 0 && (
        <section className="container mx-auto px-4 mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-input">Best Sellers</h2>
            <Button asChild variant="ghost">
              <Link href="/search?tag=best-seller">View All</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {bestSellers.map((product) => (
              <ProductCard
                key={product.slug}
                name={product.name}
                slug={product.slug}
                brand={product.brand}
                price={product.price}
                listPrice={product.listPrice}
                image={product.images[0]}
                color={product.colors?.[0]}
                discType={product.discType?.[0]}
                weight={product.weight}
                plastic={product.plastic}
                flightNumbers={product.flightNumbers}
              />
            ))}
          </div>
        </section>
      )}

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="container mx-auto px-4 mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-input">New Arrivals</h2>
            <Button asChild variant="ghost">
              <Link href="/search?tag=new-arrival">View All</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
              <ProductCard
                key={product.slug}
                name={product.name}
                slug={product.slug}
                brand={product.brand}
                price={product.price}
                listPrice={product.listPrice}
                image={product.images[0]}
                color={product.colors?.[0]}
                discType={product.discType?.[0]}
                weight={product.weight}
                plastic={product.plastic}
                flightNumbers={product.flightNumbers}
              />
            ))}
          </div>
        </section>
      )}

      {/* Donate CTA */}
      <section className="container mx-auto px-4 mb-16">
        <div className="bg-background/80 backdrop-blur-sm rounded-lg border p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-input mb-4">
            Got Discs Collecting Dust?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-6">
            Donate your unused discs and help grow the sport. Every disc finds a new home
            and keeps affordable options available for players of all levels.
          </p>
          <Button asChild size="lg">
            <Link href="/donate">Donate a Disc</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
