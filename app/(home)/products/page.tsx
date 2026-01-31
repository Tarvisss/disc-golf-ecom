import { ProductCard } from "@/components/shared/product/product-card"
import data from "@/lib/data"

export default async function ProductsPage() {
  const products = data.products

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">All Products</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
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
    </div>
  )
}
