import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CategoriesService } from "../categories/categories.service";
import { CreateTodoDto } from "./dto/create-todo.dto";
import { UpdateTodoDto } from "./dto/update-todo.dto";
import { Todo } from "./todo.entity";

export interface TodoResponse {
  id: number;
  text: string;
  completed: boolean;
  categoryId: number;
  categoryName: string;
  createdAt: string;
}

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private readonly todosRepo: Repository<Todo>,
    private readonly categoriesService: CategoriesService,
  ) {}

  private toResponse(todo: Todo): TodoResponse {
    return {
      id: todo.id,
      text: todo.text,
      completed: todo.completed,
      categoryId: todo.category.id,
      categoryName: todo.category.name,
      // Normalize the timestamp to an ISO string for the client.
      createdAt:
        todo.createdAt instanceof Date
          ? todo.createdAt.toISOString()
          : String(todo.createdAt),
    };
  }

  async findAll(categoryId?: number): Promise<TodoResponse[]> {
    const todos = await this.todosRepo.find({
      relations: { category: true },
      where: categoryId ? { category: { id: categoryId } } : {},
      order: { createdAt: "DESC", id: "DESC" },
    });
    return todos.map((t) => this.toResponse(t));
  }

  async create(dto: CreateTodoDto): Promise<TodoResponse> {
    const category = await this.categoriesService.findOne(dto.categoryId);
    if (!category) {
      throw new BadRequestException("categoryId does not exist");
    }

    const activeCount = await this.todosRepo.count({
      where: { category: { id: dto.categoryId }, completed: false },
    });
    if (activeCount >= 5) {
      throw new BadRequestException(
        "Category limit reached. Max 5 active tasks per category.",
      );
    }

    const todo = this.todosRepo.create({
      text: dto.text.trim(),
      completed: false,
      category,
    });
    const saved = await this.todosRepo.save(todo);
    return this.toResponse(saved);
  }
  async update(id: number, dto: UpdateTodoDto): Promise<TodoResponse> {
    const todo = await this.todosRepo.findOne({
      where: { id },
      relations: { category: true },
    });
    if (!todo) {
      throw new NotFoundException(`Todo ${id} not found`);
    }
    todo.completed = dto.completed;
    const saved = await this.todosRepo.save(todo);
    return this.toResponse(saved);
  }

  async remove(id: number): Promise<void> {
    const result = await this.todosRepo.delete(id);
    if (!result.affected) {
      throw new NotFoundException(`Todo ${id} not found`);
    }
  }
}
