import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Category } from "./category.entity";

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepo: Repository<Category>,
  ) {}
  findAll(): Promise<Category[]> {
    return this.categoriesRepo.find({
      select: ["id", "name"],
      order: { id: "ASC" },
    });
  }
  findOne(id: number): Promise<Category | null> {
    return this.categoriesRepo.findOne({ where: { id } });
  }
}
