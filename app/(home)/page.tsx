import { HomeCarousel } from "@/components/shared/home/home-carousel"
import data from "@/lib/data"

export default async function Page(){
  return (
    <section>
      <div>
       <h1 className="w-4xl h-[400px] text-destructive">Testing</h1>
      </div>
      <div className="max-w-4xl max-h-[400px] mx-auto overflow-hidden rounded-3xl">
          <HomeCarousel items={data.carousels} />
        </div>
    </section>
     
  )
}