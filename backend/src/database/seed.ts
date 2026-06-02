import { Logger } from "@nestjs/common";
import { DataSource } from "typeorm";
import { Category } from "../categories/category.entity";

const DEFAULT_CATEGORIES = ["Work", "Personal", "Shopping", "Groceries"];

export async function seedDatabase(dataSource: DataSource): Promise<void> {
  const logger = new Logger("Seed");
  const repo = dataSource.getRepository(Category);

  const existing = await repo.count();
  if (existing > 0) {
    return;
  }

  const categories = DEFAULT_CATEGORIES.map((name) => repo.create({ name }));
  await repo.save(categories);
  logger.log(`Seeded ${categories.length} default categories.`);
}
