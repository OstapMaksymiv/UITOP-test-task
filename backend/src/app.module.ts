import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Category } from "./categories/category.entity";
import { CategoriesModule } from "./categories/categories.module";
import { Todo } from "./todos/todo.entity";
import { TodosModule } from "./todos/todos.module";

@Module({
  imports: [
    // Loads .env into process.env, available app-wide.
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      // sql.js is a pure-JS/WASM SQLite build — no native compilation needed,
      // so it works without platform build tools. The DB lives in memory and is
      // persisted to a file via autoSave/location below.
      type: "sqljs",
      location: process.env.DATABASE_PATH || "data.sqlite",
      autoSave: true, // Flush the in-memory DB to `location` after each change.
      entities: [Category, Todo],

      synchronize: true, // baaad for production, in prod migrations goood)
    }),
    CategoriesModule,
    TodosModule,
  ],
})
export class AppModule {}
