import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const categories = [
  "Login Help",
  "Connection", 
  "App Crash",
  "Printing",
  "Setup Help",
  "Audio Issue",
  "Bug Report",
  "Slow Speed",
  "Upload Fail",
  "Display Bug"
]

async function main() {
  console.log('Start seeding...')
  
  for (const categoryName of categories) {
    const category = await prisma.category.upsert({
      where: { name: categoryName },
      update: {},
      create: {
        name: categoryName,
      },
    })
    console.log(`Created category: ${category.name}`)
  }
  
  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 