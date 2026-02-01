import { ProductCard } from "@/components/shared/product/product-card"
import data from "@/lib/data"
import { Vortex } from "@/components/ui/vortex"

type SearchPageProps = {
  searchParams: Promise<{
    q?: string
    category?: string
    tag?: string
  }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams
  const query = params.q?.toLowerCase() || ""
  const category = params.category || ""
  const tag = params.tag || ""

  // Filter products based on search params
  let filteredProducts = data.products

  // Filter by search query
  if (query) {
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
    )
  }

  // Filter by category (skip if "all" or empty)
  if (category && category.toLowerCase() !== "all") {
    filteredProducts = filteredProducts.filter(
      (product) => product.category.toLowerCase() === category.toLowerCase()
    )
  }

  // Filter by tag
  if (tag) {
    filteredProducts = filteredProducts.filter((product) =>
      product.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
    )
  }

  // Build page title
  let pageTitle = "Search Results"
  if (category) {
    pageTitle = category
  } else if (tag) {
    const tagDisplay = tag.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    pageTitle = tagDisplay
  } else if (query) {
    pageTitle = `Results for "${query}"`
  }

  return (
    <Vortex className="relative min-h-screen">
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">{pageTitle}</h1>
      <p className="text-muted-foreground mb-8">
        {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"} found
      </p>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
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
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">No products found</p>
          <p className="text-sm text-muted-foreground mt-2">
            Try adjusting your search or browse our categories
          </p>
        </div>
      )}
    </div>
    </Vortex>
  )
}
