import Link from "next/link"
import { ProductCard } from "@/components/shared/product/product-card"

import { Button } from "@/components/ui/button"
import data from "@/lib/data"

const PRODUCTS_PER_PAGE = 8

type ProductsPageProps = {
  searchParams: Promise<{ page?: string }>
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { page } = await searchParams
  const currentPage = Number(page) || 1
  const products = data.products

  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE)
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE
  const paginatedProducts = products.slice(startIndex, startIndex + PRODUCTS_PER_PAGE)

  return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">All Products</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {paginatedProducts.map((product) => (
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <Button
              variant="outline"
              asChild
              disabled={currentPage <= 1}
            >
              <Link href={`/products?page=${currentPage - 1}`}>
                Previous
              </Link>
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <Button
                key={pageNum}
                variant={pageNum === currentPage ? "default" : "outline"}
                asChild
              >
                <Link href={`/products?page=${pageNum}`}>
                  {pageNum}
                </Link>
              </Button>
            ))}

            <Button
              variant="outline"
              asChild
              disabled={currentPage >= totalPages}
            >
              <Link href={`/products?page=${currentPage + 1}`}>
                Next
              </Link>
            </Button>
          </div>
        )}
      </div>
  )
}
